# Is Twitter Feeding Bitcoin? 
[VIEW PROJECT](http://neiloliver.co/influence)
## An analysis of Twitter content, user behavior, and correlation to Bitcoin market value.

### Table of Contents
- [Frameworks & Libraries](#frameworks--libraries)
- [Visualization Components](#visualization-components)
- [Additional Custom Components](#additional-custom-components)
- [Data Gathering](#data-gathering)
- [Data Retrieval & Aggregation](#data-retrieval--aggregation)

## Technical Documentation
*Not what you are looking for? You can find the project homepage [here](../).*

## Frameworks & Libraries
**Application Type:** Server side rendered application  
**Front End Framework:** [NUXT](https://nuxtjs.org) / [Vue.js](https://vuejs.org)  
**UI Component Library:** [Element-UI](https://element.eleme.io/#/en-US)  
**Data Structure:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
**API:** [Twitter API](https://developer.twitter.com/en/docs) & [Binance API](https://github.com/binance-exchange/binance-api-node)  
**Middleware:** Custom [Node](https://nodejs.org/en/) / [Express](https://expressjs.com) middleware via [NUXT serverMiddleware](https://nuxtjs.org/api/configuration-servermiddleware/)  
**Visualization Library:** [D3.js](https://d3js.org)  
**Additional Libraries:** [ScrollMagic](http://scrollmagic.io), [Lodash](https://lodash.com), [GSAP](https://greensock.com/gsap/), [Axios](https://github.com/axios/axios) & [Twitter-Widget](https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/overview)  

## Data Gathering
All data gathering was carried out as a batch process using a Node.js script. An additional PM2 instance is used to continuously update the data via socket.IO streams. 
### Twitter Data
Twitter data is accessed through three methods.
- Node script via the Twitter premium (paid service) full archive search. This was the intended method for the project was was not used due to limitations in the paid service only allowing access to 50,000 tweets in for the $99 fee.
- Node script using [Twit](https://github.com/ttezel/twit) package to incrementally go back through the previous 7 days (free service) of information.
- Node script using Twit to access Twitter live stream.
#### Sentiment Analysis
Sentiment Analysis was carried out on the tweet body using [Vader](https://github.com/vaderSentiment/vaderSentiment-js) with the compound score used to allow comparisons between tweets.

#### Tweet Data Manipulation
All methods of Twitter data retrieval contain both original Tweets and additional information. The additionl information can includes retweets, comments and user activity. The free twitter serivce also provides sandbox results which do not always match with the search criteria or live twitter content. To ensure data integrity, the following filters and checks were put in place.
- User Follower Count above 0
- Following / Follower ration below 10:1
- Less than 10 hashtags
- Less than 5 @mentions
- Lesson than 5 url links
- Averge daily tweet count below 100 per day
- Filter comment data entry (update original tweet data in database)
- Filter retweet data entry (update original tweet data in database)
- Check creation date in within criteria boundary
- Check keywords set in criteria are in Tweet content
  
For faster retieval by the application and lower storage costs, information that was not required for the application was stripped away leaving only Tweet statistics and ID for use with the Twitter tooltip.
```javascript
let newTweet = {
    created_at : tweet.created_at,
    id_str : tweet.id_str,
    user : {
        followers_count : tweet.user.followers_count
        friends_count : tweet.user.friends_count
        verified : tweet.user.verified
    },
    sentiment : tweet.sentiment,
    retweet_count : tweet.retweet_count,
    favorite_count : tweet.favorite_count,
    reply_count : tweet.reply_count,
    quote_count : tweet.quote_count,
    interaction_count : tweet.reply_count + tweet.quote_count + tweet.favorite_count + tweet.retweet_count
}
```

### Cryptocurrency Data
Cryptocurrency data was scraped using the [CCTX](https://github.com/ccxt/ccxt) module to incrementally go back through the historical data to a set start date (based on the twitter information being used). Candle data was retrieved in one minute increments. 
#### Candle Data Manipulation
All of the candle data is used within the application so the only manipulation that was required was to convert the data array to an object, convert the date to a javascript date object and calculate the difference between close values. While this does take up additional storage and could be calculated within the application or arregation call to the database, the additional strorage space needed was an acceptable cost to potentially increase application speed.
  
## Data Retrieval & Aggregation
Axios

## Visualization Components
### Volume Visualization

### Filtering Visulaization

### Sentiment Visualization

### Correlation Visualization

## Additional Custom Components
### Animate Number

### Correlation

### Highlighter

### Uncertainty

### Twitter Tooltip

