/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */
const express = require('express')
const app = express()
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let uri = process.env.MONGO_URI

async function aggregate(startDate, endDate, retweet_count, favorite_count, followers_count, verified, sentiment, period) {

    startDate = startDate || 'Wed, 01 Nov 2017 00:00:00 GMT'
    endDate = endDate || 'Sun, 01 Nov 2020 00:00:00 GMT'

    let minuteVal = "0"

    if (period == 'minute'){
        minuteVal = {
            '$toString': '$_id.minute'
          }
    }

    const pipeline = []

    if (sentiment){        
        let addField = {
            '$addFields': {
              'content.absSentiment': {
                '$abs': '$content.sentiment'
              }
            }
        }
        pipeline.push(addField) 
    }

    const match = {
        '$match': {
            'type': 'tweet', 
            'timestamp': {
            '$type': 'date', 
            '$gte': new Date(startDate), 
            '$lt': new Date(endDate)
            }
        }
    }
    const group = {
        '$group': {
            '_id': {
            'year': {
                '$year': '$timestamp'
            }, 
            'month': {
                '$month': '$timestamp'
            }, 
            'day': {
                '$dayOfMonth': '$timestamp'
            }, 
            'hour': {
                '$hour': '$timestamp'
            }, 
            }, 
            'Count': {
            '$sum': 1
            }, 
            'avgRetweets': {
            '$avg': '$content.retweet_count'
            }, 
            'avgFollowers': {
            '$avg': '$content.user.followers_count'
            }, 
            'avgLikes': {
            '$avg': '$content.favorite_count'
            }, 
            'avgSentiment': {
            '$avg': '$content.sentiment'
            }, 
            'maxRetweets': {
            '$max': '$content.retweet_count'
            }, 
            'maxFollowers': {
            '$max': '$content.user.followers_count'
            }, 
            'maxLikes': {
            '$max': '$content.favorite_count'
            }, 
            'maxSentiment': {
            '$max': '$content.sentiment'
            }, 
            'minRetweets': {
            '$min': '$content.retweet_count'
            }, 
            'minFollowers': {
            '$min': '$content.user.followers_count'
            }, 
            'minLikes': {
            '$min': '$content.favorite_count'
            }, 
            'minSentiment': {
            '$min': '$content.sentiment'
            }, 
            'likeSentiment': {
            '$sum': {
                '$multiply': [
                '$content.sentiment', '$content.favorite_count'
                ]
            }
            }, 
            'likeSum': {
            '$sum': '$content.favorite_count'
            }, 
            'followerSentiment': {
            '$sum': {
                '$multiply': [
                '$content.sentiment', '$content.user.followers_count'
                ]
            }
            }, 
            'followerSum': {
            '$sum': '$content.user.followers_count'
            }, 
            'retweetSentiment': {
            '$sum': {
                '$multiply': [
                '$content.sentiment', '$content.retweet_count'
                ]
            }
            }, 
            'retweetSum': {
            '$sum': '$content.retweet_count'
            }, 
            'id': {
            '$addToSet': '$content.id_str'
            }
        }
    }

    const project ={
        '$project': {
            'date': {
                '$toDate': {
                  '$concat': [
                    {
                      '$toString': '$_id.year'
                    }, '-', {
                      '$toString': '$_id.month'
                    }, '-', {
                      '$toString': '$_id.day'
                    }, 'T', {
                      '$toString': '$_id.hour'
                    }, ':', minuteVal
                  ]
                }
              },
            'likeSentiment': {
            '$cond': [
                {
                '$eq': [
                    '$likeSum', 0
                ]
                }, 0, {
                '$divide': [
                    '$likeSentiment', '$likeSum'
                ]
                }
            ]
            }, 
            'followerSentiment': {
            '$cond': [
                {
                '$eq': [
                    '$followerSum', 0
                ]
                }, 0, {
                '$divide': [
                    '$followerSentiment', '$followerSum'
                ]
                }
            ]
            }, 
            'retweetSentiment': {
            '$cond': [
                {
                '$eq': [
                    '$retweetSum', 0
                ]
                }, 0, {
                '$divide': [
                    '$retweetSentiment', '$retweetSum'
                ]
                }
            ]
            },
            'Count' : 1, 
            'avgRetweets': 1, 
            'avgFollowers': 1, 
            'avgLikes': 1, 
            'avgSentiment': 1, 
            'maxRetweets': 1, 
            'maxFollowers': 1, 
            'maxLikes': 1, 
            'maxSentiment': 1, 
            'minRetweets': 1, 
            'minFollowers': 1, 
            'minLikes': 1, 
            'minSentiment': 1, 
            'retweetSum': 1, 
            'likeSum': 1, 
            'followerSum': 1, 
            'id': 1
        }
    };

    if (period == 'minute'){
        group['$group']['_id']['minute'] = {
            '$minute': '$timestamp'
        }
    }

    if (verified == 'true'){
        match['$match']['content.user.verified'] = true
    }

    if (retweet_count){
        match['$match']['content.retweet_count'] = {
            '$gte': parseInt(retweet_count)
        }
    }

    if (favorite_count){
        match['$match']['content.favorite_count'] = {
            '$gte': parseInt(favorite_count)
        }
    }

    if (followers_count){
        match['$match']['content.user.followers_count'] = {
            '$gte': parseInt(followers_count)
        }
    }

    if (sentiment){
        match['$match']['content.absSentiment'] = {
            '$gte': parseFloat(sentiment)
        }
    }

    pipeline.push(match)
    pipeline.push(group)
    pipeline.push(project)

    return new Promise(resolve => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
            function(connectErr, client) {
              assert.equal(null, connectErr);
              const coll = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
              coll.aggregate(pipeline).toArray()
              .then(results => {
                resolve(results)
              })
              //client.close();
            });
    });
  
}


app.get('/', async (req, res) => {
    let results = {
        tweets :[],
        candles:[]
    }
    results.tweets = await aggregate(req.query.startDate, req.query.endDate, req.query.retweet_count, req.query.favorite_count, req.query.followers_count, req.query.verified, req.query.sentiment, req.query.period)
    results.candles = await aggregateCandles(req.query.startDate, req.query.endDate, req.query.period)
    res.send(results)
});


module.exports = {
    path: "/api/",
    handler: app
};

async function aggregateCandles(startDate, endDate, period) {

    startDate = startDate || 'Wed, 01 Nov 2017 00:00:00 GMT'
    endDate = endDate || 'Sun, 01 Nov 2020 00:00:00 GMT'

    let minuteVal = "0"

    if (period == 'minute'){
        minuteVal = {
            '$toString': '$_id.minute'
          }
    }

    const pipeline = []

    const match = {
        '$match': {
            'type': 'candle', 
            'timestamp': {
            '$type': 'date', 
            '$gte': new Date(startDate), 
            '$lt': new Date(endDate)
            }
        }
    }

    const group = {
        '$group': {
            '_id': {
                'year': {
                    '$year': '$timestamp'
                }, 
                'month': {
                    '$month': '$timestamp'
                }, 
                'day': {
                    '$dayOfMonth': '$timestamp'
                }, 
                'hour': {
                    '$hour': '$timestamp'
                }, 
            }, 
            'Count': {
                '$sum': 1
            }, 
            'OpenAvg': {
                '$avg': '$content.open'
            }, 
            'CloseAvg': {
                '$avg': '$content.close'
            }, 
            'HighAvg': {
                '$avg': '$content.high'
            }, 
            'LowAvg': {
                '$avg': '$content.low'
            }, 
            'VolumeAvg': {
                '$avg': '$content.volume'
            }, 
            'OpenMax': {
                '$max': '$content.open'
            }, 
            'CloseMax': {
                '$max': '$content.close'
            }, 
            'HighMax': {
                '$max': '$content.high'
            }, 
            'LowMax': {
                '$max': '$content.low'
            }, 
            'VolumeMax': {
                '$max': '$content.volume'
            }, 
            'VolumeSum': {
                '$sum': '$content.volume'
            }, 
            'OpenMin': {
                '$min': '$content.open'
            }, 
            'CloseMin': {
                '$min': '$content.close'
            }, 
            'HighMin': {
                '$min': '$content.high'
            }, 
            'LowMin': {
                '$min': '$content.low'
            }, 
            'VolumeMin': {
                '$min': '$content.volume'
            },
            'differenceAvg': {
                '$avg': {
                  '$toDouble': '$content.difference'
                }
            }, 
            'differenceMax': {
                '$max': {
                  '$toDouble': '$content.difference'
                }
            }, 
            'differenceMin': {
                '$min': {
                  '$toDouble': '$content.difference'
                }
            }
        }
    }

    const project ={
        '$project': {
            'date': {
                '$toDate': {
                  '$concat': [
                    {
                      '$toString': '$_id.year'
                    }, '-', {
                      '$toString': '$_id.month'
                    }, '-', {
                      '$toString': '$_id.day'
                    }, 'T', {
                      '$toString': '$_id.hour'
                    }, ':', minuteVal
                  ]
                }
            },
            'Count' : 1,
            'OpenAvg': 1, 
            'CloseAvg': 1, 
            'HighAvg': 1, 
            'LowAvg': 1, 
            'VolumeAvg': 1, 
            'OpenMax': 1, 
            'CloseMax': 1, 
            'HighMax': 1, 
            'LowMax': 1, 
            'VolumeMax': 1, 
            'OpenMin': 1, 
            'CloseMin': 1, 
            'HighMin': 1, 
            'LowMin': 1, 
            'VolumeMin': 1,
            'VolumeSum': 1,
            'differenceAvg' : 1,
            'differenceMax' : 1,
            'differenceMin': 1,
            'id': 1
        }
    };

    if (period == 'minute'){
        group['$group']['_id']['minute'] = {
            '$minute': '$timestamp'
        }
    }

    pipeline.push(match)
    pipeline.push(group)
    pipeline.push(project)


    return new Promise(resolve => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
            function(connectErr, client) {
              assert.equal(null, connectErr);
              const coll = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
              coll.aggregate(pipeline).toArray()
              .then(results => {
                resolve(results)
              })
              //client.close();
            });
    });
  
}

app.get('/tweets', async (req, res) => {
    res.send(await getTweets(req.query.startDate, req.query.endDate))
});

function getTweets(startDate, endDate){
    let filter = {
        'type': 'tweet', 
        'timestamp': {
        '$gte': new Date(startDate),
        '$lt': new Date(endDate)

        }
    }

    return new Promise(resolve => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
            function(connectErr, client) {
              assert.equal(null, connectErr);
              const coll = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
              coll.find(filter).toArray()
              .then(results => {
                resolve(results)
              })
              //client.close();
            });
    });
}

app.get('/dates', async (req, res) => {
    let start = await getDates('start')
    let end = await getDates('end')

    res.send({start:start[0].timestamp,end:end[0].timestamp})
});

function getDates(dateType){

    let sort = -1

    if (dateType =='start'){
        sort = 1
    }

    let filter = {
        'type': 'tweet', 
    }

    return new Promise(resolve => {
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
            function(connectErr, client) {
              assert.equal(null, connectErr);
              const coll = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
              coll.find(filter).sort({ "timestamp" : sort }).limit(1).toArray()
              .then(results => {
                resolve(results)
              })
              //client.close();
            });
    });
}