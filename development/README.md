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
- Node script via the Twitter premium (paid service) full archive search. 
- Node script using [Twit](https://github.com/ttezel/twit) package to incrementally go back through the previous 7 days (free service) of information.
- Node script using Twit to access Twitter live stream.
#### Data Manipulation
  
### Cryptocurrency Data

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

