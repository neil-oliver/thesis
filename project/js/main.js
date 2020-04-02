var socket = io();

var app = new Vue({
    // This is the id of our referenced div-element
    // only this element and everything in it
    // will be connected to the data
    el: '#app',
    data: {
        tweets : [],
        candles : [],
        followers : 0,
        retweets : 0,
        comments : 0,
        likes : 0,
        verified : false,
    },
    computed: {
        filteredTweets: function(){
            return this.tweets.filter(x => x["followers"] > this.followers && x["retweets"] > this.retweets && x["comments"] > this.comments && x["likes"] > this.likes && (this.verified ? this.verified == x["verified"] : true))
        },
        maxComments:function(){
            return Math.max.apply(Math, this.filteredTweets.map(function(o) { return o.comments; }))
        },
        maxLikes:function(){
            return Math.max.apply(Math, this.filteredTweets.map(function(o) { return o.likes; }))
        },
        maxRetweets:function(){
            return Math.max.apply(Math, this.filteredTweets.map(function(o) { return o.retweets; }))
        },
        maxFollowers:function(){
            return Math.max.apply(Math, this.filteredTweets.map(function(o) { return o.followers; }))
        },
        correlation : function(){
            return this.getCorrelation()
        },
        likeWeightedCorrelation : function(){
            return this.getCorrelation("likes")
        },
        followerWeightedCorrelation : function(){
            return this.getCorrelation("followers")
        },
        commentWeightedCorrelation : function(){
            return this.getCorrelation("comments")
        },
        retweetWeightedCorrelation : function(){
            return this.getCorrelation("retweets")
        },
        interactionWeightedCorrelation : function(){
            return this.getCorrelation("interactions")
        }
    },
    methods: {
        getCorrelation : function(weight){

            if(weight){
                total = this.filteredTweets.reduce((a,b) => a + b[weight], 0)
            }
        
            // get correlation using Pearson Correlation function
            let correlation = this.getPearsonCorrelation(this.filteredTweets.map(x => weight ? (x.sentiment * x[weight])/ total: x.sentiment),this.candles.map(x => x.close))
            //check that the correlation function returned a number and correct if needed.
            if (Number.isNaN(correlation)){
                correlation = 0;
            }
            return correlation
        },
        getPearsonCorrelation : function(x, y) {
            var shortestArrayLength = 0;
             
            if(x.length == y.length) {
                shortestArrayLength = x.length;
            } else if(x.length > y.length) {
                shortestArrayLength = y.length;
                //console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
            } else {
                shortestArrayLength = x.length;
                //console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
            }
          
            var xy = [];
            var x2 = [];
            var y2 = [];
          
            for(var i=0; i<shortestArrayLength; i++) {
                xy.push(x[i] * y[i]);
                x2.push(x[i] * x[i]);
                y2.push(y[i] * y[i]);
            }
          
            var sum_x = 0;
            var sum_y = 0;
            var sum_xy = 0;
            var sum_x2 = 0;
            var sum_y2 = 0;
          
            for(var i=0; i< shortestArrayLength; i++) {
                sum_x += x[i];
                sum_y += y[i];
                sum_xy += xy[i];
                sum_x2 += x2[i];
                sum_y2 += y2[i];
            }
          
            var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
            var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
            var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
            var step4 = Math.sqrt(step2 * step3);
            var answer = step1 / step4;
          
            return answer;
        }
    }
});

/////////////////////

// make some data
function createTestData(max){
    class Tweet {
        constructor() {
            this.followers = Math.floor(Math.random()*10000000);
            this.retweets = Math.floor(Math.random()*1000000);
            this.comments = Math.floor(Math.random()*100000);
            this.likes = Math.floor(Math.random()*1000000);
            this.interactions = this.likes + this.comments + this.retweets;
            this.verified = Math.random() < 0.2 ? true : false;
            this.sentiment = this.randomSentiment();
        }
        randomSentiment(){
            let val = Math.random()
            if (Math.random() < 0.5){
                val = -Math.abs(val)
            }
            return val
        }
    }
    
    class Candle {
        constructor() {
            this.close = this.randomChange();
        }
        randomChange(){
            let val = Math.random()*10
            if (Math.random() < 0.5){
                val = -Math.abs(val)
            }
            return 1000 + val
        }
    }
    
    for (let i=0;i<max;i++){
    app.candles.push(new Candle())
    }
    
    //create array of tweets
    for (let i=0;i<max;i++){
    app.tweets.push(new Tweet())
    }
}

createTestData(10000)

socket.on('BTC', function(msg){
    //app.candles.push(msg)
});