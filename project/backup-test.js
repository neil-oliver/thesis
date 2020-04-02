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
        this.value = this.randomChange();
    }
    randomChange(){
        let val = Math.random()*10
        if (Math.random() < 0.5){
            val = -Math.abs(val)
        }
        return 1000 + val
    }
}

let bitcoin = []
let numberOfCandles = 100000;
for (let i=0;i<numberOfCandles;i++){
bitcoin.push(new Candle())
}

//create array of tweets
let tweets = []
let numberOfTweets = 100000;
for (let i=0;i<numberOfTweets;i++){
tweets.push(new Tweet())
}

let elements = ["followers","retweets","comments","likes"]

function filterTweets(list,filters){
    filterTweets = (arr,min,element) => arr.filter(x => x[element] > min)

    // filter the data for each of the filter minimums
    for (filter in elements){
        list = filterTweets(list,filters[elements[filter]],elements[filter])
    }
    return list
}

function getCorrelation(list,weight){

    if(weight){
        total = list.reduce((a,b) => a + b[weight], 0)
    }

    // get correlation using Pearson Correlation function
    let correlation = getPearsonCorrelation(list.map(x => weight ? (x.sentiment * x[weight])/ total: x.sentiment),bitcoin.map(x => x.value))
    //check that the correlation function returned a number and correct if needed.
    if (Number.isNaN(correlation)){
        correlation = 0;
    }
    return correlation
}

function getAllCorrelations(list){
    //expected pre-filtered list
    return {
    "correlation" : getCorrelation(list),
    "likeWeightedCorrelation" : getCorrelation(list,"likes"),
    "followerWeightedCorrelation" : getCorrelation(list,"followers"),
    "commentWeightedCorrelation" : getCorrelation(list,"comments"),
    "retweetWeightedCorrelation" : getCorrelation(list,"retweets"),
    "interactionWeightedCorrelation" : getCorrelation(list,"interactions")
    }
}


function createFilterList(steps,list,e){
    //create empty list and start from the first element on the first call of the function
    list = list || []
    e = e || 0

    // find the maximum value in the element
    let max = Math.max.apply(Math, tweets.map(function(o) { return o[elements[e]]; }));
    //loop through each item of the existing list
    let length = list.length
    for (let x=0;x<length;x++){
        for (let i=0;i<max;i+=Math.floor(max/steps)){
            let temp = list[x]
            temp[elements[e]] = i
            let filteredList = filterTweets(tweets,temp)
            temp = {...temp, ...getAllCorrelations(filteredList) }
            list.push(temp)
        }
    }

    // //loop through in steps to the maximum value and record the step value
    for (let i=0;i<max;i+=Math.floor(max/steps)){
        let temp = {"followers":0,"retweets":0,"comments":0,"likes":0}
        temp[elements[e]] = i
        let filteredList = filterTweets(tweets,temp)
        temp = {...temp, ...getAllCorrelations(filteredList) }
        list.push(temp)
    }

    // if there are more elements in the list, loop again
    if (e+1 < elements.length){
        list = createFilterList(steps,list,e+1)
    }
    return list
}

//create all possible filters based on steps
let filterList = createFilterList(5) // 5 is probably fine

console.log(filterTweets(tweets,filterList[1450]))

//detect best filter
var maxCorrelation = Number.NEGATIVE_INFINITY;
var maxobj;
var bestCorrelation = '';

filterList.map(function(obj){     
    if (obj.correlation > maxCorrelation){
        maxobj = obj;
        maxCorrelation = obj.correlation;
        bestCorrelation = 'Tweet Volume';
    }  
    if (obj.likeWeightedCorrelation > maxCorrelation){
        maxobj = obj;
        maxCorrelation = obj.likeWeightedCorrelation;
        bestCorrelation = 'Like Weighted';
    } 
    if (obj.followerWeightedCorrelation > maxCorrelation){
        maxobj = obj;
        maxCorrelation = obj.followerWeightedCorrelation;
        bestCorrelation = 'Follower Weighted';
    } 
    if (obj.retweetWeightedCorrelation > maxCorrelation){
        maxobj = obj;
        maxCorrelation = obj.retweetWeightedCorrelation;
        bestCorrelation = 'Retweet Weighted';
    }  
    if (obj.commentWeightedCorrelation > maxCorrelation){
        maxobj = obj;
        maxCorrelation = obj.commentWeightedCorrelation;
        bestCorrelation = 'Comment Weighted';
    }  
    if (obj.interactionWeightedCorrelation > maxCorrelation){
        maxobj = obj;
        maxCorrelation = obj.interactionWeightedCorrelation;
        bestCorrelation = 'Interaction Weighted';
    } 
});
console.log("the highest correlation is: " + maxCorrelation + " using a " + bestCorrelation + " Correlation.")
console.log("the filter settings used were: " + JSON.stringify(maxobj))


//////////////

function getPearsonCorrelation(x, y) {
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

