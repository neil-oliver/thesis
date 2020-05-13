// add hours function
import * as d3 from 'd3';
import axios from 'axios'
import sentimentVis from '~/components/sentiment-vis'
import bubbleVis from '~/components/bubble-vis'
import volumeVis from '~/components/volume-vis'
import finalVis from '~/components/final-vis'
import twitterTooltip from '~/components/twitter-tooltip';
import animateNumber from '~/components/animate-number';
import _ from 'lodash';
import tooltip from '~/components/uncertainty-tooltip';
import filters from '~/components/tweet-filters';
import progressMenu from '~/components/progress-tracker';
import sentimentHighlight from '~/components/sentiment-highlight';
import correlation from '~/components/correlation'
import { Tweet } from 'vue-tweet-embed'

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

Date.prototype.addMinutes = function(h) {
this.setTime(this.getTime() + (h*60*1000));
return this;
}

export default {
    components:{
        "sentiment-vis": sentimentVis,
        "bubble-vis": bubbleVis,
        "volume-vis": volumeVis,
        "final-vis": finalVis,
        "twitter-tooltip": twitterTooltip,
        "animate-number" : animateNumber,
        "progress-menu" : progressMenu,
        "sentiment-highlight":sentimentHighlight,
        tooltip: tooltip,
        filters:filters,
        correlation:correlation,
        Tweet:Tweet
    },
    data (){
        return {
            allTweets : [],
            fixedStart: '2020-05-03T12:00:00.000Z',
            tooltipVisible: false,
            finalTooltipVisible: false,
            tooltipIndex: 0,
            selectedTweet: "6",
            aggregateTweets: [],
            aggregateCandles: [],
            hourAggregateCandles: [],
            timePeriod:'hour', startPeriod:0, endPeriod:12, followers_count:0, retweet_count:0, reply_count:0, favorite_count: 0, sentiment_min: 0, verified: false, grid: true, stacked_select:'tweets', bars:false, fixedHeight: false, curve: true, offset:0,
            volumeFocus:"tweets",
            sentimentFocus:"tweets",
            sentimentFocus:"tweets",
            finalFocus:"avgSentiment",
            headings: [],
            scrollOffset:0,
            earliest: new Date("March 1, 2020"),
            latest: new Date("March 31, 2020"),
            carouselItems:[],        
            pickerOptions: {
                disabledDate: this.disabledDates
            },
            spinner:false
        }
    },
    mounted(){
        this.headings = document.querySelectorAll("h1")
        let _this = this

        const Block1 = this.$scrollmagic.scene({
            triggerElement: '#big-button',
            triggerHook: 0.2
        }).on('enter', function (event) {
            _this.goBig()
        });
        this.$scrollmagic.addScene(Block1)

    },
    async created(){
        if (process.client) { 
            window.addEventListener('scroll', this.handleScroll);
        }

        this.debounceGetData = _.debounce(this.updateData, 200)

        this.updateData(true)

        let _this = this;

          axios.get('api/dates/', {
            params :{}
          })
          .then(function (response) {
            _this.earliest = new Date(response.data.start)
            _this.latest = new Date(response.data.end)
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    watch:{
        followers_count() {
            this.debounceGetData()
        },
        retweet_count(){
            this.debounceGetData()
        },
        // reply_count(){
        //     return this.debounceGetData()
        // },
        favorite_count(){
            this.debounceGetData()
        },
        sentiment_min(){
            this.debounceGetData()
        },
        verified(){
            this.debounceGetData()
        },
        timePeriod(){
            this.debounceGetData()
        },
        startDate(){
            this.debounceGetData()
        },
        endDate(){
            this.debounceGetData()
        },
        fixedStart(){
            this.updateData(true)
        },
        aggregateTweets(){
            this.carouselItems = []
            for (let i=0;i<5;i++){
                this.carouselItems.push(this.tweetIds.pop())
            }
        },
    },
    computed: {
        tweets(){
            return this.allTweets.map((x) => {
                (x.user.followers_count >= this.followers_count && Math.abs(x.sentiment) >= this.sentiment_min && x.retweet_count >= this.retweet_count && x.reply_count >= this.reply_count && x.favorite_count >= this.favorite_count && (this.verified ? this.verified == x.user.verified : true)) ? x.filtered = true : x.filtered = false;
                return x
            })
        },
        startDate(){
            if (this.timePeriod == 'minute'){
                return new Date(this.fixedStart).addMinutes(this.startPeriod);
            } else {
                return new Date(this.fixedStart).addHours(this.startPeriod);
            }
        },
        endDate(){
            if (this.timePeriod == 'minute'){
                return new Date(this.fixedStart).addMinutes((this.startPeriod + this.endPeriod));
            } else {
                return new Date(this.fixedStart).addHours((this.startPeriod + this.endPeriod));
            }
        },
        tweetTotals(){
            let totals = {}
            totals.likes = {}
            totals.followers = {}
            totals.retweets = {}

            totals.likes.total = d3.sum(this.aggregateTweets, d => d.likeSum)
            totals.likes.average = d3.mean(this.aggregateTweets, d => d.avgLikes)
            totals.likes.min = d3.min(this.aggregateTweets, d => d.minLikes)
            totals.likes.max = d3.max(this.aggregateTweets, d => d.maxLikes)

            totals.followers.total = d3.sum(this.aggregateTweets, d => d.followerSum)
            totals.followers.average = d3.mean(this.aggregateTweets, d => d.avgFollowers)
            totals.followers.min = d3.min(this.aggregateTweets, d => d.minFollowers)
            totals.followers.max = d3.max(this.aggregateTweets, d => d.maxFollowers)

            totals.retweets.total = d3.sum(this.aggregateTweets, d => d.retweetSum)
            totals.retweets.average = d3.mean(this.aggregateTweets, d => d.avgRetweets)
            totals.retweets.min = d3.min(this.aggregateTweets, d => d.minRetweets)
            totals.retweets.max = d3.max(this.aggregateTweets, d => d.maxRetweets)

            return totals

        },
        filteredTweetCount(){
            return d3.sum(this.aggregateTweets, d => d.Count)
        },
        tweetIds(){
            let ids = this.aggregateTweets.map(d => d.id)
            return [].concat.apply([], ids)
        },
        maxTimePeriod(){
            let max = (this.latest - this.earliest - (this.startPeriod*60000))
            if (this.timePeriod == 'minute'){
                max = max / (60*1000)
            } else {
                max = max / (60*60*1000)
            }
            if (max > 720) {
                max = 720 //12 hours or 30 days in minutes max
            }

            return Math.floor(max)

        }
    },
    methods: {
        disabledDates(time) {
            return time.getTime() < this.earliest || time.getTime() > this.latest;
        },
        changeCarouselTweets(){
            this.carouselItems.shift()
            this.carouselItems.push(this.tweetIds.pop())
        },
        goBig(){
            this.timePeriod = "hour";
            this.endPeriod = 216;
        },
        handleScroll () {
            this.scrollOffset = window.scrollY
        },
        updateVolumeFocus(data){
            this.volumeFocus = data
        },
        updateSentimentFocus(data){
            this.sentimentFocus = data
        },
        updateFinalFocus(data){
            this.finalFocus = data
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
        processMouseover(payload){
            if (payload.visible == true){
                this.tooltipVisible = true
                this.selectedTweet = payload.id
            } else {
                this.tooltipVisible = false
            }

            const tooltip = d3.select('#tooltip')
                .style("left", (event.clientX) + "px")		
                .style("top", (event.clientY) + "px");
        },
        processFinalTooltip(payload){
            if (payload.visible == true){
                this.finalTooltipVisible = true
                this.tooltipIndex = payload.index
            } else {
                this.finalTooltipVisible = false
            }

            const tooltip = d3.select('#final-tooltip')
                .style("left", (event.clientX) + "px")		
                .style("top", (event.clientY) + "px");
        },
        async updateData(force){
            this.spinner = true
            let _this = this;

            if (force == true){
                axios.get('api/tweets/', {
                    params :{
                    startDate : this.startDate,
                    endDate: new Date(this.fixedStart).addHours((this.startPeriod + 12))
                    }
                  })
                  .then(function (response) {
                    let tweetdata = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        
                    while(_this.allTweets.length > 0) {_this.allTweets.pop();}

                    tweetdata.forEach(element => {
                        _this.allTweets.push(processTweet(element.content))
        
                    });
                    _this.spinner = false        
                  })
                  .catch(function (error) {
                    console.log(error);
                    _this.spinner = false
                  });
            }

            axios.get('api', {
                params :{
                startDate : this.startDate, 
                endDate : this.endDate, 
                retweet_count : this.retweet_count, 
                favorite_count : this.favorite_count, 
                followers_count : this.followers_count, 
                verified : this.verified, 
                sentiment : this.sentiment_min, 
                period : this.timePeriod
                }
            })
            .then(function (response) {
                let tweetdata = response.data.tweets.sort((a, b) => new Date(a.date) - new Date(b.date))
                let candledata = response.data.candles.sort((a, b) => new Date(a.date) - new Date(b.date))

                // _this.aggregateTweets = tweetdata

                _this.aggregateCandles = candledata

                let newaggtweets = []

                let tweetIndex = 0
                if (tweetdata.length > 0){
                    for (let i in candledata){
                        let newTweet = {"_id":{},"Count":0,"avgRetweets":0,"avgFollowers":0,"avgLikes":0,"avgSentiment":0,"maxRetweets":0,"maxFollowers":0,"maxLikes":0,"maxSentiment":0,"minRetweets":0,"minFollowers":0,"minLikes":0,"minSentiment":0,"likeSum":0,"followerSum":0,"retweetSum":0,"id":[],"date":"","likeSentiment":0,"followerSentiment":0,"retweetSentiment":0}
                        
                        if (i < tweetdata.length){
                            if (candledata[i].date == tweetdata[tweetIndex].date){
                                newaggtweets.push(tweetdata[tweetIndex])
                                tweetIndex += 1
                            } else {
                                newTweet.date = candledata[i].date
                                newaggtweets.push(newTweet)
                            }
                        } else {
                            newTweet.date = candledata[i].date
                            newaggtweets.push(newTweet)
                        }
                    }
                }
                _this.aggregateTweets = newaggtweets

                if (force) {
                    _this.hourAggregateCandles = candledata
                }

                _this.spinner = false

            })
            .catch(function (error) {
                console.log(error);
                _this.spinner = false

            });
        }
    }
};

/////////////////////

function processTweet(tweet){
    
    tweet.created_at = new Date(tweet.created_at)
            
    //not available in non premium data
    tweet.reply_count = 1;
    tweet.quote_count = 1;
    tweet.filtered = true

    tweet.interaction_count = tweet.quote_count + tweet.retweet_count + tweet.reply_count + tweet.favorite_count
    
    return tweet
}