var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
require('dotenv').config()

var moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


var Twit = require('twit')

var T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token:         process.env.TWITTER_TOKEN,
  access_token_secret:  process.env.TWITTER_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

var vader = require('vader-sentiment');
var m = require('moment')

function getTweets(){

  var stream = T.stream('statuses/filter', { track: 'bitcoin btc', language: 'en' })
 
  stream.on('tweet', function (tweet) {
    console.log(tweet)
      saveToDB(tweet)
  })

}

const ccxws = require("ccxws");
const binance = new ccxws.binance();

let lastCandle = null
let lastTicker = null
let diff = 0

function getCandles(){

  // market could be from CCXT or genearted by the user
  const market = {
    id: "BTCUSDT", // remote_id used by the exchange
    base: "BTC", // standardized base symbol for Bitcoin
    quote: "USDT", // standardized quote symbol for Tether
  };
  
    // subscribe to trades
  binance.subscribeCandles(market);
   
  // handle trade events
  binance.on("candle", candle => {
    if (lastTicker == null){
        lastTicker = candle
    }
    processCandles(candle)
  });
   
}

function processCandles(candle){
  console.log('processing candle')
  
  if (lastTicker.timestampMs != candle.timestampMs){
    lastCandle = lastTicker
  }
  
  if (lastCandle != null){
    diff = candle.close - lastCandle.close
  }
  
  candle.difference = diff.toFixed(2)

  
  console.log(candle)
  if (lastTicker.timestampMs != candle.timestampMs){
    let obj = {_id:lastTicker.timestampMs, type:'candle', timestamp:new Date(lastTicker.timestampMs), content:lastTicker}
    saveCandle(obj)
  }
  
  lastTicker = candle

}


function saveToDB(tweet){
  

    const tweetTime = new Date(tweet.created_at).toISOString()
    
    let clean = true
    
    //ignore accounts with 0 followers
    if (tweet.user.followers_count == 0){
      console.log(`tweet ${tweet.id_str} removed due to no followers`)
      clean = false
    } 
    // ignore accounts with a following to follower ratio about 10
    if (tweet.user.friends_count / tweet.user.followers_count > 10){
      console.log(`tweet ${tweet.id_str} removed due to follower ratio`)
      clean = false
    }
    
    var a = m();
    var b = m(tweet.user.created_at);
    var diff = a.diff(b, 'days')+1
    
    //ignore accounts that are brand new
    if (diff < 2){
      console.log(`tweet ${tweet.id_str} removed due to being less than a day old`)
      clean = false
    }
    // ingore accounts with more than 50 tweets per day
    if (tweet.user.statuses_count / diff > 100){
      console.log(`tweet ${tweet.id_str} removed due to high tweet volume`)
      clean = false
    }
    
    // ignore tweets with more than 10 hashtags, 5 urls or 5 mentions
    if (tweet.entities.hashtags.length > 10){
      console.log(`tweet ${tweet.id_str} removed due to excessive hashtags`)
      clean = false
    }
    
    if (tweet.entities.urls.length > 5){
      console.log(`tweet ${tweet.id_str} removed due to excessive links`)
      clean = false
    }
    
    if (tweet.entities.urls.user_mentions > 5){
      console.log(`tweet ${tweet.id_str} removed due to excessive follower mentions`)
      clean = false
    }
    
    // grab inner tweet if its a quote or retweet
    if (tweet.hasOwnProperty('quoted_status')){
      console.log('comment tweet detected')
      tweet = tweet.quoted_status 
    }
    if (tweet.hasOwnProperty('retweeted_status')){
      console.log('retweet detected')
      tweet = tweet.retweeted_status
    }
    
    //check the original date
    if(new Date(tweet.created_at) < new Date(1588291200000) ){
      console.log(`tweet ${tweet.id_str} removed due to ${new Date(tweet.created_at)} being before ${new Date(1588291200000)}`)
      clean = false
    }
    
    let lower = tweet.text.toLowerCase()

    if (lower.indexOf('bitcoin') == -1 && lower.indexOf('btc') == -1){
      clean = false
      console.log('WARNING - Keyword not found in ' + tweet.text)
    }
  
    if (clean){
      if (tweet.hasOwnProperty('text')){
        
        // sentiment calculation
        let sentiResult = vader.SentimentIntensityAnalyzer.polarity_scores(tweet.text);
        tweet.sentiment = sentiResult.compound;
        
        //reduce tweet
        let newTweet = {}
        newTweet.created_at = tweet.created_at
        newTweet.id_str = tweet.id_str
        newTweet.user = {}
        newTweet.user.followers_count = tweet.user.followers_count
        newTweet.user.friends_count = tweet.user.friends_count
        newTweet.user.verified = tweet.user.verified
        newTweet.retweet_count = tweet.retweet_count
        newTweet.sentiment = tweet.sentiment
        newTweet.favorite_count = tweet.favorite_count
        
        tweet = newTweet
        
        let item = {type:'tweet', updated: new Date(tweetTime), timestamp:new Date(tweet.created_at), content:tweet}

        const uri = process.env.MONGO_URI;
      
        MongoClient.connect(uri, { useNewUrlParser: true },
          function(connectErr, client) {
            assert.equal(null, connectErr);
            const coll = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
            
            coll.updateOne({ _id: tweet.id_str, updated:{'$lte': new Date(tweetTime)} },
            { $set: item },
            { upsert: true }, 
            function(err, res) {
              if (err) throw err;
              client.close();
            });
        });
      }
    }
}

function saveCandle(item){
  const uri = process.env.MONGO_URI;

  MongoClient.connect(uri, { useNewUrlParser: true },
    function(connectErr, client) {
      assert.equal(null, connectErr);
      const coll = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
      
      coll.updateOne({ _id: item._id},
      { $set: item },
      { upsert: true }, 
      function(err, res) {
        if (err) console.log(err);
        client.close();
      });
  });
}

// start it up!
getTweets()
getCandles()