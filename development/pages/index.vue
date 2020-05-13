<template>
  <el-container>
    <el-main>
      <el-row type="flex" class="page" justify="center" align="middle">
        <el-col :span="24">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16">
              <div class="grid-content">
                <h1 class="title">Is Twitter Feeding Bitcoin?</h1>
                <h2 class="subheading">An analysis of <sentiment-highlight val="Twitter" color="#5cc9f5"/> content, user behavior, and correlation to <sentiment-highlight val="Bitcoin" color="#fccd47"/> market value.</h2>
                <h3>By Neil Oliver</h3>
                <img style="padding:0;" width="150px" src="~static/images/intro-logo.svg"/>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
              <div class="grid-content">
                <div class="content">
                  Since it's introduction in 2008, <span class="bitcoin">Bitcoin</span> has increasingly become the hot investiment that your next door neighbours son kept going on about. 
                  The mysterious electronic currency that was once predominantly known as the payment method of criminals on 'the dark web' was suddenly worth over $20,000 per coin.
                  Prices were rising 'to the moon' and then in January 2018 prices crashed, loosing over half of its value. <strong>What causes this huge rise and falls in value?</strong>
                  A large factor might be that you listened to your neighbours son for financial advice, and chances are, he got his from <span class="twitter">Twitter</span>.
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <div id="start-arrow">
          <a href="#bitcoin-explanation-container"><i class="el-icon-arrow-down" style="font-size:2em; padding:50px;"></i></a>
        </div>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1 id="bitcoin-explanation-container">Breaking Down Bitcoin</h1>
            <div class="content">
              <span class="bitcoin">Bitcoin</span> is the original and most popular <a href="https://en.wikipedia.org/wiki/Cryptocurrency">cryptocurrency</a>, a digitial asset designed to be used as a medium of exchange.
              If that sounds complex or confusing don't worry, the important bit to understand is that <span class="bitcoin">Bitcoin</span> is in limited supply and is traded in a similar manner to the stock market.
              When lots of people want to buy <span class="bitcoin">Bitcoin</span>, the price goes up; when people sell, the price goes down.
              The main difference is that without a brick and mortar company or physical assets behind it, the value of <span class="bitcoin">Bitcoin</span> is based on peoples perception, and is heavily influenced by online discussions on social media platforms, including <span class="twitter">Twitter</span>.
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" style="flex-wrap: wrap;" class="row-bg" justify="center">
        <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="6">
          <div class="grid-content">
            <img width="100%" src="~static/images/bitcoin-value.svg"/>
          </div>
        </el-col>
        <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="6">
          <div class="grid-content">
            <img width="100%" src="~static/images/bitcoin-activity.svg"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <div class="content">
              We can measure <span class="bitcoin">Bitcoin</span> in two ways, either by the value of each coin as it rises and falls, or by how many people are buying and selling <span class="bitcoin">Bitcoin</span>. 
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>A little Bird Told Me</h1>
            <div class="content">
              With 330 Million monthly active users and only 13% of users having private profiles, <span class="twitter">Twitter</span> is place to go to get the inside scoop from everyone, ranging from celebrites to that guy called John who lives down the street.
              It's perfect to find out what the latest thing <a href="https://twitter.com/realDonaldTrump">Donald Trump</a> is complaining about, or to read about everything from fashion to finance, because of its #hashtags and short message form.
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
            <img width="100%" src="~static/images/annotated-tweet.svg"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <div class="content">
              Each account is unique from the person behind the account, what the are saying, to how many people follow them and interact with their content. But <strong>which of these elements has the greatest effect on influencing <span class="bitcoin">Bitcoin</span> value?</strong>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
            <div class="content focus active" style="text-align:center;">
              <h6>Does <span class="twitter">Twitter</span> really have the inside scoop, and if so, where is it hidden?</h6>
              <br>
              <p>Let's look at the <animate-number :val="tweets.length"/> Tweets that took place over 12 Hours starting from {{startDate}}.</p>
              <br>
              <p>Want to see a different date? You can simply change it.</p>
              <br>
                <el-date-picker
                  v-model="fixedStart"
                  type="datetime"
                  :time-arrow-control="true"
                  :picker-options="pickerOptions"
                  placeholder="Select date and time">
                </el-date-picker>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>The Voice of a Million Tweets</h1>
            <div class="content">
              When lots of people talk about <span class="bitcoin">Bitcoin</span> on <span class="twitter">Twitter</span>, does the activity of people buying and selling increase as well?
              <p>These aren't just numbers. Click the 'display individual tweets' button to visualize each tweet. Hover over each block to see exactly what was said.</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
            <volume-vis
              @tooltip="processMouseover"
              @volumeFocusUpdate="updateVolumeFocus"
              weight="tweets"
              main
              :tweets="allTweets" 
              :candles="hourAggregateCandles"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>Don't Judge A Book By It's Cover</h1>
            <div class="content">
              A body of tweets is much more than simply how many of them there are; its about their content too.
              Lets dive deeper and compare the amount amount of retweets, comments and likes each tweet received.
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" style="flex-wrap: wrap;" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content">
            <volume-vis
              @tooltip="processMouseover"
              weight="tweets" 
              :tweets="allTweets" 
              :selected="volumeFocus"
              :candles="hourAggregateCandles"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content">
            <volume-vis
              @tooltip="processMouseover"
              weight="followers" 
              :tweets="allTweets" 
              :selected="volumeFocus"
              :candles="hourAggregateCandles"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content">
            <volume-vis
              @tooltip="processMouseover"
              weight="likes" 
              :tweets="allTweets"
              :selected="volumeFocus" 
              :candles="hourAggregateCandles"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content">
            <volume-vis
              @tooltip="processMouseover"
              weight="retweets"
              :tweets="allTweets" 
              :selected="volumeFocus"
              :candles="hourAggregateCandles"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>Do I care about what you say?</h1>
            <div class="content">
              Maybe listening to <em>everyone</em> isn't such a great idea.
              Lets use some filters to exclude some tweets that are from people with a small amount of followers, or that people aren't interacting with.            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
            <div class="content focus active">
              <filters :followers.sync="followers_count" :retweets.sync="retweet_count" :favorites.sync="favorite_count" :sentiment.sync="sentiment_min" :verified.sync="verified" :offset.sync="offset"/>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
            <bubble-vis @tooltip='processMouseover' 
              :tweets="tweets"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <div class="content">
              <div style="font-size:2em; text-align:center; line-height:1.5em;">"I <sentiment-highlight val="love" color="#4af2a1"/> Bitcoin, but i am <sentiment-highlight val="worried" color="#ff6076"/> the price might <sentiment-highlight val="crash" color="#ff6076"/> soon."</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <div class="content">
              It's not all about who is talking about <span class="bitcoin">Bitcoin</span>, its about what they are saying. The sentiment of the tweet is how positive or negative it is.
              While there is a little bit more to it than looking at positive and negative words, its a good representation of what is happening behind the scenes.
              The end result is a score on a scale from <sentiment-highlight val="-1" color="#ff6076"/> to <sentiment-highlight val="1" color="#4af2a1"/>.
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
            <bubble-vis @tooltip='processMouseover' 
              :tweets="tweets"
              options />
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="10">
          <div class="grid-content">
            <div class="content focus active" style="width:100%;">
              <el-collapse>
                <el-collapse-item title="Click Here To Change Your Filters" name="1">
                  <filters :followers.sync="followers_count" :retweets.sync="retweet_count" :favorites.sync="favorite_count" :sentiment.sync="sentiment_min" :verified.sync="verified" :offset.sync="offset"/>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>It's Time to Look a Little Deeper</h1>
            <div class="content">
              <p>An hour isn't very long when trying to spot patterns. Let's zoom out and look at what 5 days looks like.</p>
              <div style="text-align:center;padding:20px;"><el-button id='big-button' class="big-button" type="success" @click="goBig">Click Me!</el-button></div>
              <p>We are now looking at <animate-number :val="filteredTweetCount" :grow="true" :highlight="true" /> tweets.</p> 
              <p>You can now change up the time period in any of the filter sections below.</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>Together As One</h1>
            <div class="content">
              <p>Let's take a step back and look at the average sentiment of all of the tweets combined, compared with the rise and fall in <span class="bitcoin">Bitcoin</span> price.</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
            <img width="100%" src="~static/images/sentiment-detail.svg"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="10">
          <div class="grid-content">
            <div class="content focus active" style="width:100%;">
              <el-collapse>
                <el-collapse-item title="Click Here To Change Your Filters" name="1">
                  <filters :followers.sync="followers_count" :retweets.sync="retweet_count" :favorites.sync="favorite_count" :sentiment.sync="sentiment_min" :verified.sync="verified" :offset.sync="offset" :timePeriod.sync="timePeriod" :endPeriod.sync="endPeriod" :maxTimePeriod="maxTimePeriod" :level="1"/>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
            <sentiment-vis @tooltip="processMouseover"
              @sentimentFocusUpdate="updateSentimentFocus"
              :weight="0" 
              :tweets="aggregateTweets" 
              :candles="aggregateCandles" 
              :offset="offset"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="20" :sm="16" :md="8" :lg="6" :xl="6">
          <div class="grid-content">
            <h1>Look Who's Talking</h1>
            <div class="content">
              <p>With so many numbers, graphs and filters, it can be easy to forget we are talking about real Tweets from real people.</p>
              <p>You can check back here at any point to see a selection of tweets that match your filter criteria.</p>
            </div>
          <el-carousel direction="vertical" :autoplay="true" :interval="6000" @change="changeCarouselTweets">
            <el-carousel-item v-for="item in carouselItems" :key="item">
                <Tweet :id="item" :key="item" :options="{ cards: 'hidden', conversation:'none' }"><div class="spinner"></div></Tweet>
            </el-carousel-item>
          </el-carousel>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>Weight a minute</h1>
            <div class="content">
              <p>Enough of the bad puns (we cant promise anything), weighted averages might be the key to unlocking <span class="twitter">Twitter's</span> secrets.</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16">
          <div class="grid-content">
            <img width="100%" src="~static/images/weighted-average.svg"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <div class="content">
              <p>You don't need to understand the Math, just that tweets with a higher 'weight' (either number of followers, comments, retweets or likes) will contribute more to the overall score.</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" style="flex-wrap: wrap;" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content">
            <sentiment-vis @tooltip="processMouseover"
              :weight="0"
              :tweets="aggregateTweets" 
              :candles="aggregateCandles" 
              :offset="offset"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content">
            <sentiment-vis @tooltip="processMouseover"
              :weight="1"
              :tweets="aggregateTweets" 
              :candles="aggregateCandles" 
              :offset="offset"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content">
            <sentiment-vis @tooltip="processMouseover"
              :weight="2"
              :tweets="aggregateTweets" 
              :candles="aggregateCandles" 
              :offset="offset"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content">
            <sentiment-vis @tooltip="processMouseover"
              :weight="3"
              :tweets="aggregateTweets" 
              :candles="aggregateCandles" 
              :offset="offset"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>You can't influence me... can you?</h1>
            <div class="content">
              Does influence happen immediately? It is likely that there is a delay between people talking on <span class="twitter">Twitter</span> and people buying and selling <span class="bitcoin">Bitcoin</span>.
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
              <img width="100%" src="~static/images/offset-animation.gif"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="10">
          <div class="grid-content">
            <div class="content focus active" style="width:100%;">
              <el-collapse>
                <el-collapse-item title="Click Here To Change Your Filters" name="1">
                  <filters :followers.sync="followers_count" :retweets.sync="retweet_count" :favorites.sync="favorite_count" :sentiment.sync="sentiment_min" :verified.sync="verified" :offset.sync="offset" :timePeriod.sync="timePeriod" :endPeriod.sync="endPeriod" :maxTimePeriod="maxTimePeriod" :level="2"/>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>The Big Five Zero</h1>
            <div class="content">
              What are the chances of guessing a coin flip correctly? 50-50. 
              If the <span class="twitter">Twitter</span> sentiment matches the direction of <span class="bitcoin">Bitcoin</span> price changes any less than 50% of the time, we may as well flip a coin.
              If the sentiment <strong>consistently</strong> matches more than 50% of the time, we might be observing <span class="twitter">Twitter's</span> influence over <span class="bitcoin">Bitcoin</span>. 
              <div style="text-align:center;padding-top:20px;">
                <label>current match rate</label>
                <h6 style="font-size:10em;"><correlation :tweets="aggregateTweets" :candles="aggregateCandles" :sentiment="finalFocus" :offset="offset"/>%</h6>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="18">
          <div class="grid-content">
            <final-vis @finalTooltip="processFinalTooltip"
              @finalFocusUpdate="updateFinalFocus"
              :tweets="aggregateTweets" 
              :candles="aggregateCandles"
              :offset="offset"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h6>Why is there no sentiment Scale?</h6>
            <div class="content">
              <p>The <span class="twitter">blue line</span> represents the continuous rise and fall in sentiment.
              Each sentiment score now continues from where it left off in the previous time period.
              This means the scale value is nonsense, but it does allow us to view the sentiment in a similar way to the rise and fall of <span class="bitcoin">Bitcoin</span> price.
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>Are you Sure?</h1>
            <div class="content">
              For each time period, we have to take average results from lots of Tweets and <span class="bitcoin">Bitcoin</span> price data. 
              This means there is a range of results, where some might be a match and some not.
              You can cover over any of the points on the graph above to see the details.
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content">
              <img width="100%" src="~static/images/uncertainty.svg"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content">
            <h1>Can we predict Bitcoin price now?</h1>
            <div class="content">
              No, This isn't a prediction tool. 
              There are too many variables and too much uncertainty in the data to make any form of accurate prediction. 
              The sentiment of most tweets will be mixed, and displaying the sentiment of lots of tweets as one averaged number does not give a clear impression of how people are feeling. 
              The possible combinations of filters, weightings, time periods and time delays are nearly endless, the answer to <span class="twitter">Twitter's</span> feeling about <span class="bitcoin">Bitcoin</span> may be in the data, but it is well hidden. 
              Even then, the volatility of <span class="bitcoin">Bitcoin</span> price means that what works today, will probably not work tomorrow. 
              Even if the magic formula was found, and we could know the exact influence Twitter has on <span class="bitcoin">Bitcoin</span> price, it is only one piece of a larger puzzle.
              <h6 style="text-align:center;padding-top:20px;">Maybe this is why you shouldn't trust <span class="twitter">Twitter</span> to give you financial advice.</h6>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
        <el-footer class="footer">
          <div class="content">
            <a href="http://github.com/neil-oliver/thesis"><span style="padding-right:20px;"><img width="12px" src="~static/images/github.svg"/> Technical Documentation</span></a>
            <a href="http://neiloliver.co"><span><i class="el-icon-data-analysis"></i> Portfolio</span></a>
          </div>
    </el-footer>
    <div class="progress">
      <progress-menu v-for="(element,i) in headings" :key="i" :el="element" :offset="scrollOffset"/>
    </div>
    <twitter-tooltip :id='selectedTweet' :visible='tooltipVisible'></twitter-tooltip>
    <tooltip :visible="finalTooltipVisible" :index="tooltipIndex" :tweets="aggregateTweets" :candles="aggregateCandles" sentiment="avgSentiment"/>
    <div class="spinner" v-if="spinner == true"><i class="el-icon-loading" style="font-size:medium;;"></i><span style="padding-left:5px;">Loading</span></div>
  </el-container>
</template>
<script src="./js/main.js"></script>
<style src="./css/styles.css"></style>
<style scoped>
  .footer{
    width:100vw;
    background: #D3D3D3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .footer a {
    font-weight: normal;
    text-decoration: none;
    font-family: 'Roboto', sans-serif;
    fill:grey;
    font-size: small;
    text-transform: uppercase;
  }

  .content{
    text-align: left;

  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }

  .row-bg {
    padding: 10px 0;
  }
  .grid-content {
    text-align: center;
    overflow: hidden;
    padding:20px;
  }

</style>


