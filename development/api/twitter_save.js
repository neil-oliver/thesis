var request = require("request")
var m = require('moment')
var vader = require('vader-sentiment');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
require('dotenv').config()

//Twitter OAuth --- Application only, user context not required. 
var search_auth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token:         process.env.TWITTER_TOKEN,
  token_secret:  process.env.TWITTER_SECRET,

};

let tweets = [];
let processedTweets = [];
let next = null;
let counter = 1;

function searchTwitter(){
  
    //Product details
  var search_config = {
    url: 'api.twitter.com/1.1/tweets/search/30days/',
    env: 'dev'
  };
  
  // build request <-- input
  var query = {
    "query": 'bitcoin btc -is:retweet -is:reply',
    "fromDate":"202003050000",
    "toDate":"202003050100",
    "maxResults":"10"
  };
  
  if (next != null){
    query.next = next
  }
  
  // request options
  var request_options = {
    //POST form with "body: query" below
    url: 'https://' + search_config['url'] + search_config['env'] + '.json',
  
    oauth: search_auth,
    json: true,
    headers: {
      'content-type': 'application/json'
    },
    body: query 
  };
  
  // POST request
  request.post(request_options, function (error, response, body) {
    //console.log(request_options['url'])
  
    if (error) {
      console.log('Error making search request.');
      console.log(error);
      return;
    }
    

    if (body.hasOwnProperty('next')){
      next = body.next
      fs.writeFile('next.txt', next, function (err) {
        if (err) return console.log(err);
      });
    } else {
      next = null
    }
    
    fs.writeFile('./tweets/tweets_' + counter + '.json', JSON.stringify(body.results), function (err) {
      if (err) return console.log(err);
    });
    
    counter +=1
    
    tweets = body.results;
    processTweets();
  
  });
}


function processTweets(){

    if (tweets.length > 0){
      console.log('\n ---------------------------------------')

      let tweet = tweets.pop()

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
      if(new Date(tweet.created_at) < new Date(1583020800000) ){
        console.log(`tweet ${tweet.id_str} removed due to ${new Date(tweet.created_at)} being before ${new Date(1583020800000)}`)
        clean = false
      }
      
      if (clean){
        if (tweet.hasOwnProperty('text')){
          
          // sentiment calculation
          let sentiResult = vader.SentimentIntensityAnalyzer.polarity_scores(tweet.text);
          tweet.sentiment = sentiResult.compound;
          
          //reduce tweet
          let newTweet = {
            created_at : tweet.created_at,
            id_str : tweet.id_str,
            user : {
                followers_count : tweet.user.followers_count,
                friends_count : tweet.user.friends_count,
                verified : tweet.user.verified
            },
            sentiment : tweet.sentiment,
            retweet_count : tweet.retweet_count,
            favorite_count : tweet.favorite_count,
            reply_count : tweet.reply_count,
            quote_count : tweet.quote_count,
            interaction_count : tweet.reply_count + tweet.quote_count + tweet.favorite_count + tweet.retweet_count
        }
          
          if (!tweet.text.toLowerCase().includes('bitcoin') || !tweet.text.toLowerCase().includes('btc')){
            console.log('WARNING - Keyword not found in ' + tweet.text)
          }


          tweet = newTweet
          
          // console.log(tweet)
          processedTweets.push({type:'tweet', timestamp:new Date(tweet.created_at), content:tweet})
        }
      }
      console.log('\n ---------------------------------------\n')

      processTweets()
    
    } else {
      console.log("finished processing tweets")
      if (processedTweets.length > 0){
        saveData()
      } else if (next != null){
        setTimeout(() => {
          processedTweets = []
          searchTwitter()
        },1000)
      }
    }

}

function saveData(data){
  
  const uri = process.env.MONGO_URI;

  MongoClient.connect(uri, { useNewUrlParser: true, forceServerObjectId:true },
    function(connectErr, client) {
      assert.equal(null, connectErr);
      const coll = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
      
      coll.insertMany(processedTweets, function(err, res) {
        if (err) throw err;
        // console.log(res);
        
        if (next != null){
          setTimeout(() => {
            processedTweets = []
            searchTwitter()
          },1000)
        }
        client.close();
      });

    });
  
}

searchTwitter()