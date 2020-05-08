const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
var moment = require('moment');
require('dotenv').config()


///////////////////
// Historic data from binance

const ccxt = require ('ccxt')

const exchangeId = 'binance',
symbol = 'BTC/USDT',
exchangeClass = ccxt[exchangeId], 
exchange = new exchangeClass ({
        'apiKey': process.env.BINANCE_API_KEY,
        'secret': process.env.BINANCE_SECRET,
        'timeout': 30000,
        'enableRateLimit': true,
    })
    
let limit = new Date(2020, 03, 01, 00, 00) - (60000*1000)
let results = [];
let processedCandles = [];
        
if (exchange.has.fetchOHLCV) {
    getCandles(limit)
}


async function getCandles(){
  console.log('getting candles with limit of ' + limit)
  
  if (limit != null){
  
    results = await exchange.fetchOHLCV ('BTC/USDT', '1m', limit, 1000)

    if (results[0][0] > 1583020800000){
      limit = limit - (60000*1000)
      processCandles()
    } else {
      limit = null
      processCandles()
    }
  }
}

function processCandles(){
  console.log('processing candle')

  if (results.length > 0){
    let candle = results.pop()
    
    let candleObject = {
      timestampMs:candle[0],
      open:candle[1],
      high:candle[2],
      low:candle[3],
      close:candle[4],
      volume:candle[5],
    }
    
    if (results.length > 0){
      let diff = candle[4] - results[results.length-1][4]
      candleObject.difference = diff.toFixed(2)
    } else {
      candleObject.difference = 0
    }
    
    console.log(new Date(candleObject.timestampMs))
    processedCandles.push({type:'candle', timestamp:new Date(candleObject.timestampMs), content:candleObject})
    processCandles()
  } else {
    saveData()
  }
  

    
}

function saveData(){
  console.log('saving ' + processedCandles.length + ' candles.')

  const uri = process.env.MONGO_URI;

  MongoClient.connect(uri, { useNewUrlParser: true, forceServerObjectId:true },
    function(connectErr, client) {
      assert.equal(null, connectErr);
      const coll = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
      
      coll.insertMany(processedCandles, function(err, res) {
        if (err) throw err;

        if (limit != null){
          setTimeout(() => {
            results = [];
            processedCandles = []
            getCandles()
          },3000)
        }
        client.close();
      });

    });
  
}

