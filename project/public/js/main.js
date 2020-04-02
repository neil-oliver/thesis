// add hours function
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

Date.prototype.addMinutes = function(h) {
this.setTime(this.getTime() + (h*60*1000));
return this;
}


var app = new Vue({
    // This is the id of our referenced div-element
    // only this element and everything in it
    // will be connected to the data
    el: '#app',
    data: {
        now : new Date(),
        svgWidth : "800",
        svgHeight : "400",
        margin: {top: 50, left: 50, bottom: 50, right: 50 },
        tweets : [],
        candles : [],
        followers_count : 0,
        retweet_count : 0,
        reply_count : 0,
        favorite_count : 0,
        sentiment_min:0,
        verified : false,
        timePeriod : 'minute',
        startPeriod : 0,
        endPeriod : 0.5,
        grid: true,
        tooltipVisible: false,
        selectedTweet: {user:{}},
        stacked_select: 'tweets'
    },
    computed: {
        width() {
            return this.svgWidth - this.margin.left - this.margin.right;
        },
        height() {
            return this.svgHeight - this.margin.top - this.margin.bottom;
        },
        startDate(){
            if (this.tweets.length > 0){
                return d3.min(this.tweets, d => d.created_at) ;
            } else {
                return new Date()
            }
        },
        endDate(){
            if (this.tweets.length > 0){
                return new Date(d3.min(this.tweets, d => d.created_at).getTime()).addHours(this.endPeriod);
            } else {
                return new Date()
            }
        },
        filteredTweets(){
            return this.tweets.filter(x => x.created_at >= this.startDate && x.created_at <= this.endDate && x.user.followers_count >= this.followers_count && Math.abs(x.sentiment) >= this.sentiment_min && x.retweet_count >= this.retweet_count && x.reply_count >= this.reply_count && x.favorite_count >= this.favorite_count && (this.verified ? this.verified == x.user.verified : true))
        },
        filteredCandles(){
            return this.candles.filter(x => x.timestampMs >= this.startDate && x.timestampMs <= this.endDate )
        },
        aggregateTweets(){
            return d3.nest()
                .key(function(d) {
                    return app.filterTime(d.created_at)
                })
                .rollup(function(v) { return {
                    count: v.length,
                    // followerTotal: d3.sum(v, function(d) { return d.user.followers_count; }),
                    // followerAvg: d3.mean(v, function(d) { return d.user.followers_count; }),
                    followerMax: d3.max(v, function(d) { return d.user.followers_count; }),
                    // followerMin: d3.min(v, function(d) { return d.user.followers_count; }),
                    // retweetTotal: d3.sum(v, function(d) { return d.retweet_count; }),
                    // retweetAvg: d3.mean(v, function(d) { return d.retweet_count; }),
                    retweetMax: d3.max(v, function(d) { return d.retweet_count; }),
                    // retweetMin: d3.min(v, function(d) { return d.retweet_count; }),
                    // likeTotal: d3.sum(v, function(d) { return d.favorite_count; }),
                    // likeAvg: d3.mean(v, function(d) { return d.favorite_count; }),
                    likeMax: d3.max(v, function(d) { return d.favorite_count; }),
                    // likeMin: d3.min(v, function(d) { return d.favorite_count; }),
                    // commentTotal: d3.sum(v, function(d) { return d.reply_count; }),
                    // commentAvg: d3.mean(v, function(d) { return d.reply_count; }),
                    // commentMax: d3.max(v, function(d) { return d.reply_count; }),
                    // commentMin: d3.min(v, function(d) { return d.reply_count; }),
                    // interactionTotal: d3.sum(v, function(d) { return d.interaction_count; }),
                    // interactionAvg: d3.mean(v, function(d) { return d.interaction_count; }),
                    // interactionMax: d3.max(v, function(d) { return d.interaction_count; }),
                    // interactionMin: d3.min(v, function(d) { return d.interaction_count; }),
                    // verifiedTotal: d3.sum(v, function(d) { return d.user.verified; }),
                    // verifiedAvg: d3.mean(v, function(d) { return d.user.verified; }),
                    sentimentAvg: d3.mean(v, function(d) { return d.sentiment; }),
                    // sentimentMax: d3.max(v, function(d) { return d.sentiment; }),
                    // sentimentMin: d3.min(v, function(d) { return d.sentiment; }),
                    sentimentLikeAvg: d3.sum(v, function(d) { return (d.sentiment * d.favorite_count) / d3.sum(v, function(d) { return d.favorite_count; }); }),
                    sentimentFollowerAvg: d3.sum(v, function(d) { return (d.sentiment * d.user.followers_count) / d3.sum(v, function(d) { return d.user.followers_count; }); }),
                    sentimentCommentAvg: d3.sum(v, function(d) { return (d.sentiment * d.reply_count) / d3.sum(v, function(d) { return d.reply_count; }); }),
                    sentimentRetweetAvg: d3.sum(v, function(d) { return (d.sentiment * d.retweet_count) / d3.sum(v, function(d) { return d.retweet_count; }); }),
                    sentimentInteractionAvg: d3.sum(v, function(d) { return (d.sentiment * d.interaction_count) / d3.sum(v, function(d) { return d.interaction_count; }); })

                }; })
                .entries(this.filteredTweets);
        },
        aggregateCandles(){
            return d3.nest()
            .key(function(d) {
                return app.filterTime(d.timestampMs)
            })
            .rollup(function(v) { return {
                count: v.length,
                closeAvg: d3.mean(v, function(d) { return d.close; })
            }; })
            .entries(this.filteredCandles);
        },
        maxComments(){
            return d3.max(this.filteredTweets, d => d.reply_count)
        },
        maxLikes(){
            return d3.max(this.filteredTweets, d => d.favourite_count)
        },
        maxRetweets(){
            return d3.max(this.filteredTweets, d => d.retweet_count)
        },
        maxFollowers(){
            return d3.max(this.filteredTweets, d => d.user.followers_count)
        },
        correlation (){
            return this.getCorrelation()
        },
        likeWeightedCorrelation (){
            return this.getCorrelation("likeAvg")
        },
        followerWeightedCorrelation (){
            return this.getCorrelation("followerAvg")
        },
        commentWeightedCorrelation (){
            return this.getCorrelation("commentAvg")
        },
        retweetWeightedCorrelation (){
            return this.getCorrelation("retweetAvg")
        },
        interactionWeightedCorrelation (){
            return this.getCorrelation("interactionAvg")
        },
        sentimentPaths() {
            let paths = []
            paths.push({path: this.generateTweetPath('sentimentAvg'),color:d3.interpolateViridis((1/6)*1)})
            paths.push({path: this.generateTweetPath('sentimentLikeAvg'),color:d3.interpolateViridis((1/6)*2)})
            paths.push({path: this.generateTweetPath('sentimentFollowerAvg'),color:d3.interpolateViridis((1/6)*3)})
            paths.push({path: this.generateTweetPath('sentimentCommentAvg'),color:d3.interpolateViridis((1/6)*4)})
            paths.push({path: this.generateTweetPath('sentimentRetweetAvg'),color:d3.interpolateViridis((1/6)*5)})
            paths.push({path: this.generateTweetPath('sentimentInteractionAvg'),color:d3.interpolateViridis((1/6)*6)})

            return paths
        },
        candlePath() {
            const path = d3.line()
                .x(d => this.priceScale.x(new Date(d.key)))
                .y(d => this.priceScale.y(d.value.closeAvg))
                .curve(d3.curveStepAfter);
            return path(this.aggregateCandles);
        },
        volumeScale() {
            const x = d3.scaleTime().range([0, this.width]);
            const y = d3.scaleLinear().range([(this.height/2), 0]);
            x.domain([this.startDate,this.endDate]);
            y.domain(d3.extent(this.aggregateTweets, d => d.value.count));
            return { x, y };
        },
        sentimentScale() {
            const x = d3.scaleTime().range([0, this.width]);
            const y = d3.scaleLinear().range([this.height, 0]);
            x.domain([this.startDate,this.endDate]);
            y.domain([-1, 1]);
            return { x, y };
        },
        priceScale() {
            const x = d3.scaleTime().range([0, this.width]);
            const y = d3.scaleLinear().range([this.height, 0]);
            x.domain([this.startDate,this.endDate]);
            y.domain(d3.extent(this.aggregateCandles, function(d) {return d.value.closeAvg; }));
            return { x, y };
        },
        stack(){
            let nested = d3.nest().key((d) => app.filterTime(d.created_at)).entries(this.filteredTweets)
            let keys = d3.range(0,nested.length, 1)
            let stackSetup = d3.stack()
                .keys(keys)
                .value((d,key) => key < d.values.length ? this.stackSelect.selection(d,key) : 0)
            return stackSetup(nested)
        },
        stackScale() {
            const x = d3.scaleTime().range([0, this.width]);
            const y = d3.scaleLinear().range([this.height,0]);
            x.domain([this.startDate,this.endDate]);
            y.domain([0,d3.max(this.aggregateTweets, d => this.stackSelect.max(d))]);
            return { x, y };
        },
        stackSelect(){
            let max = (d) => d.value.count
            let selection = (d,key) => 1;

            if (this.stacked_select == 'tweets'){
                selection = (d,key) => 1
                max = (d) => d.value.count
            } else if (this.stacked_select == 'followers'){
                selection = (d,key) => d.values[key].user.followers_count
                max = (d) => d.value.followerMax
            } else if (this.stacked_select== 'likes'){
                selection = (d,key) => d.values[key].favorite_count
                max = (d) => d.value.likeMax
            } else if (this.stacked_select== 'retweets'){
                selection = (d,key) => d.values[key].retweet_count
                max = (d) => d.value.retweetMax
            }
            return {max, selection};
        }
    },
    methods: {
        tweetTooltip(tweet){
            tooltip = d3.select('#tooltip')
                    .style("left", (event.clientX) + "px")		
                    .style("top", (event.clientY) + "px");	
            this.selectedTweet = tweet
            this.tooltipVisible = true;

            document.querySelector('#tooltip').innerHTML = '';
            twttr.widgets.createTweet(tweet.id_str, document.querySelector('#tooltip'));
        },
        generateTweetPath(key) {
            const path = d3.line()
                .x(d => this.sentimentScale.x(new Date(d.key)))
                .y(d => this.sentimentScale.y(d.value[key]))
                .curve(d3.curveCardinal);
            return path(this.aggregateTweets);
        },
        filterTime (date){
            if (this.timePeriod == 'minute'){
                date.setSeconds(0)
                date.setMilliseconds(0)
            } else {
                date.setMinutes(0)
                date.setSeconds(0)
                date.setMilliseconds(0)
            }
            return date
        },
        bubbleScale(element, i){
            let x,y,strokeSize,size,color,opacity, strokeOpacity;

            if (this.grid){

                const rowLength = Math.ceil(Math.sqrt(this.filteredTweets.length))
                x = d3.scaleLinear()
                    .domain([0,rowLength])
                    .range([0, this.width])
                x = x(i % rowLength )

                y = d3.scaleLinear()
                    .domain([0,rowLength])
                    .range([0, this.height])
                y = y(Math.floor(i / rowLength))

                color = '#1da1f2'

                size = this.height / (rowLength*3);
                strokeSize = 0;
                opacity = 0;
                strokeOpacity = 0;

            } else {

                size = d3.scaleLinear().range([2, 50]);
                size.domain(d3.extent(this.filteredTweets, d => d.user.followers_count));
                size = size(element.user.followers_count)

                strokeSize = d3.scaleLinear().range([0, 20]);
                strokeSize.domain(d3.extent(this.filteredTweets, d => d.retweet_count));
                strokeSize = strokeSize(element.retweet_count)

                color = d3.scaleSequential().domain([-1,1]).interpolator(d3.interpolateRdYlGn)
                color = color(element.sentiment)

                x = d3.scaleTime().range([0, this.width]);
                x.domain([this.startDate,this.endDate]);
                x = x(element.created_at)

                y = d3.scaleLog().range([this.height, 0]);
                y.domain(d3.extent(this.filteredTweets, d => d.interaction_count ));
                y = y(element.interaction_count)

                opacity = 0.2;
                strokeOpacity = 1;


            }
            return {strokeSize,size,color,opacity,strokeOpacity,x,y};
            
        },
        getCorrelation (weight){

            if(weight){
                total = this.aggregateTweets.reduce((a,b) => a + b.value[weight], 0)
            }
            
            // get correlation using Pearson Correlation function
            let correlation = this.getPearsonCorrelation(this.aggregateTweets.map(x => weight ? (x.value.sentimentAvg * x.value[weight])/ total: x.value.sentimentAvg),this.aggregateCandles.map(x => parseInt(x.value.closeAvg)))
            //check that the correlation function returned a number and correct if needed.
            if (Number.isNaN(correlation)){
                correlation = 0;
            }
            return correlation.toFixed(2)
        },
        getPearsonCorrelation (x, y) {
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
    },
    directives: {
        axis(el, binding) {
          const axis = binding.arg; // x or y
          const axisMethod = { x: "axisBottom", y: "axisLeft" }[axis];
          const methodArg = binding.value[axis];

          var t = d3.transition()
            .duration(500)
            .ease(d3.easeLinear)

          d3.select(el).transition(t).call(d3[axisMethod](methodArg));
        }
    }
});

/////////////////////

var offline = true


if (offline){

    d3.json("./data/dynamodb-download.json")
  .then(function(data){
    console.time('loadData')

      data = data.sort((a, b) => new Date(b.timestamp.S) - new Date(a.timestamp.S))

      data.forEach(e => {

          if (e.type.S == 'candle'){
            e.content = JSON.parse(e.content.S)
            e.content.timestampMs = new Date(e.content.timestampMs)
            app.candles.push(e.content)
          } else {
            let timestamp = new Date(e.timestamp.S)
            let cutoff = new Date('2020-03-29T05:36:44.000Z')
            if (timestamp > cutoff){
                console.log('tweet')
                app.tweets.push(processTweet(JSON.parse(e.content.S)))
            }
          }
      })
      console.timeEnd('loadData')

  });

} else {
    var socket = io();

    socket.on('candle', function(msg){
        msg = JSON.parse(msg)
        msg.timestampMs = new Date(msg.timestampMs)
        app.candles.push(msg)
    });

    socket.on('tweet', function(msg){
        app.tweets.push(processTweet(JSON.parse(msg)))
    });
}

function processTweet(tweet){
    // let newTweet = {}
    // newTweet.id = tweet.id_str
    // newTweet.text = tweet.text
    // newTweet.user = tweet.user
    // newTweet.retweet_count = tweet.retweet_count
    // newTweet.sentiment = tweet.sentiment
    // newTweet.favorite_count = tweet.favorite_count
    
    tweet.created_at = new Date(tweet.created_at)
            
    //not available in non premium data
    tweet.reply_count = 1;
    tweet.quote_count = 1;

    tweet.interaction_count = tweet.quote_count + tweet.retweet_count + tweet.reply_count + tweet.favorite_count
    
    return tweet
}

