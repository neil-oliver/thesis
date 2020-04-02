var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'));


http.listen(3000, function(){
  console.log('listening on *:3000');
});

const dotenv = require('dotenv')

///////////////////////////////////////

// var Twit = require('twit')

// var T = new Twit({
//   consumer_key:process.env.consumer_key,
//   consumer_secret:process.env.consumer_secret,
//   access_token:process.env.access_token,
//   access_token_secret:process.env.access_token_secret,
//   timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
//   strictSSL:            true,     // optional - requires SSL certificates to be valid.
// })

// var Sentiment = require('sentiment');
// var moment = require('moment');
// var sentiment = new Sentiment();

// var tracker = []
// var count = tracker.length

// var stream = T.stream('statuses/filter', { track: 'BTC, bitcoin, #BTC, #Bitcoin, $BTC', language: 'en' })

// stream.on('tweet', function (tweet) {
//     var followers = tweet.user.followers_count
//     console.log(tweet)
//     var result = sentiment.analyze(tweet.text);
//     io.emit('sentiment',{"time": moment(parseInt(tweet.timestamp_ms)).format(), "score": result.comparative, "followers": followers, interaction : 0}); 
// })


/////////////////

// const ccxws = require("ccxws");
// const binance = new ccxws.binance();
 
// // market could be from CCXT or genearted by the user
// const market = {
//   id: "BTCUSDT", // remote_id used by the exchange
//   base: "BTC", // standardized base symbol for Bitcoin
//   quote: "USDT", // standardized quote symbol for Tether
// };

// //binance.candlePeriod = '1m';
 
// // handle trade events
// binance.on("candle", candle => {
//   console.log(candle)
//   io.emit('BTC',candle)
// });
 
// // subscribe to trades
// binance.subscribeCandles(market);

// AWS Setup
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.region = "us-east-2";
AWS.config.update({
    "region": process.env.region,
    "accessKeyId": process.env.accessKeyId,
    "secretAccessKey": process.env.secretAccessKey
});

var dynamodb = new AWS.DynamoDB();

// on connection
io.on('connection', function(socket){
    
  var params = {
      TableName : "thesis",
      KeyConditionExpression: "#type = :type and #timestamp between :minDate and :maxDate", // the query expression
      ExpressionAttributeNames: { "#timestamp": "timestamp", "#type": "type" },
      ExpressionAttributeValues: { // the query values
          ":type": {S: "candle"},
          ":minDate": {S: new Date("August 28, 2019").toISOString()},
          ":maxDate": {S: new Date("October 11, 2020").toISOString()}
      }
  };

  dynamodb.query(params, function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
          console.log("Candle Query succeeded.");
          data.Items.forEach(function(item) {
                io.emit('candle',item.content.S)
          });
      }
  });

  var params2 = {
    TableName : "thesis",
    KeyConditionExpression: "type = :type and timestamp between :minDate and :maxDate", // the query expression
    ExpressionAttributeNames: { "#timestamp": "timestamp", "#type": "type" },
    ExpressionAttributeValues: { // the query values
        ":type": {S: "tweet"},
        ":minDate": {S: new Date("August 28, 2019").toISOString()},
        ":maxDate": {S: new Date("October 11, 2020").toISOString()}
    }
};

dynamodb.query(params2, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Tweet Query succeeded.");
        data.Items.forEach(function(item) {
              io.emit('tweet',item.content.S)
        });
    }
});

});