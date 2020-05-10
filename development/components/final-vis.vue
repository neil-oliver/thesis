<template>
  <div class="vis" ref='finalviscontainer'>
    <el-radio-group v-model="index" size="mini">
      <el-radio-button label="0">Tweet Sentiment</el-radio-button>
      <el-radio-button label="1">Follower Weighted</el-radio-button>
      <el-radio-button label="2">Retweet Weighted</el-radio-button>
      <el-radio-button label="3">Like Weighted</el-radio-button>
    </el-radio-group>

    <svg width="100%" :height="svgHeight">
      <g :transform="'translate(' + margin.left + ',' + margin.top + ')'">
        <g v-for="(d,i) in candlePathData" :key="d[0].date.toString()">
          <rect :x="priceScale.x(new Date(d[0].date))" y='0' :width='rectWidth' :height='height' :opacity="gradientColor(d,i)" fill="#23cf5f" />
          <path :d="candlePath(d)" stroke="#ffc400" stroke-width="2px" fill="none"/>
          <circle @mouseover="$emit('finalTooltip', {visible: true, index:i})" @mouseout="$emit('finalTooltip', {visible:false})"
            :cx="priceScale.x(new Date(d[0].date))"
            :cy="priceScale.y(d[0].CloseAvg)"
            r="3" fill="#ffc400" />
        </g>
        <path :d="sentimentPath" stroke="#5cc9f5" stroke-width="2px" fill="none"/>
        <g v-axis:x="sentimentScale" :transform="`translate(0, ${height})`"></g>
        <g v-axis:y="priceScale"></g>
        <text class="axis-label" :x="0-height/2" :y="0-40" transform="rotate(270)" fill="#000">Single Bitcoin $</text>
        <text class="axis-label" :x="width/2" :y="height+40" fill="#000">Time</text>
      </g>
    </svg>
  </div>
</template>

<script>
//date helpers
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

Date.prototype.addMinutes = function(h) {
this.setTime(this.getTime() + (h*60*1000));
return this;
}

import * as d3 from 'd3';
import { gsap } from "gsap";
import _ from 'lodash';
import correlation from '~/components/correlation'
import animateNumber from '~/components/animate-number';
import animation from '~/components/uncertainty-animation';

export default {
  name: 'final-vis',
  components:{
    'animate-number':animateNumber,
    correlation: correlation,
    animation:animation
  },
  props: ['tweets', 'candles','offset'],
  data(){
    return{
      margin: {top: 50, left: 100, bottom: 50, right: 100 },
      modCandles: [],
      candleStroke: "#ffc864",
      svgHeight : 200,
      svgWidth : 200,
      sentimentList: [
        {key:'avgSentiment',title:'Tweet Sentiment'},
        {key:'followerSentiment',title:'Follower Weighted Sentiment'},
        {key:'retweetSentiment', title:'Retweet Weighted Sentiment'},
        {key:'likeSentiment',title:'Like Weighted Sentiment'}
      ],
      index:0,
    }
  },
  created(){
    this.debouncedOffsetDates = _.debounce(this.offsetDates, 200)
  },
  mounted(){
    this.svgWidth = this.$refs.finalviscontainer.offsetWidth
    this.svgHeight = this.$refs.finalviscontainer.offsetWidth*0.5
    if (window.innerWidth < 768){
      this.margin = {top: 20, left: 30, bottom: 20, right: 30 }
    }
  },
  watch:{
    index(){
      this.$emit('finalFocusUpdate', this.sentimentList[this.index].key)
    },
    offset(newValue, oldValue){
      return this.debouncedOffsetDates()
    },
    candles(){
      this.offsetDates()
    }
  },
  computed:{
    period(){
      let p = 'hour'
      if (this.candles.length > 0){
        if (this.candles[0]._id.hasOwnProperty('minute')){
          p = 'minute'
        }
      }
      return p
    },
    start(){
      return d3.min(this.tweets, d => new Date(d.date))
    },
    end(){
      return d3.max(this.tweets, d => new Date(d.date))
    },
    width() {
      return this.svgWidth - this.margin.left - this.margin.right;
    },
    height() {
      return this.svgHeight - this.margin.top - this.margin.bottom;
    },
    titleWord(){
      return this.title.split(' ')[0]
    },
    total(){
      let t = 0
      if (this.titleWord == 'Tweet'){
        t = d3.sum(this.tweets, d => d.Count)
      } else {
        let key = this.titleWord.toLowerCase() + 'Sum'
        t = d3.sum(this.tweets, d => d[key])
      }
      return t
    },
    sentiment(){
      return this.sentimentList[this.index].key
    },
    title(){
      return this.sentimentList[this.index].title
    },
    totalAverage(){
      let avg = d3.mean(this.tweets, d => d[this.sentiment])
      return parseFloat(avg).toFixed(2)
    },
    pathColor(){
      return d3.interpolateViridis((1/4)*this.index)
    },
    candlePath() {
      return d3.line()
        .defined(d => !isNaN(d.CloseAvg))
        .x(d => this.priceScale.x(new Date(d.date)))
        .y(d => this.priceScale.y(d.CloseAvg))
        .curve(d3.curveStepAfter);
    },
    sentimentPath() {
      let line = d3.line()
        .x(d => this.sentimentScale.x(new Date(d.date)))
        .y(d => this.sentimentScale.y(d.sentiment))
        .curve(d3.curveStepAfter); // d3.curveBundle.beta(0.5)

      return line(this.trackingSentiment)
    },
    candlePathData(){
      return this.modCandles.map( (p, index) => index === this.modCandles.length - 1 ? [p] : [p, this.modCandles[index+1]]);
    },
    trackingSentiment(){
      return this.tweets.map((d,i) => i == 0 ? {sentiment: d[this.sentiment], date:d.date} : {sentiment: d[this.sentiment] + this.tweets[i-1][this.sentiment], date: d.date})
    },
    sentimentScale() {
        const x = d3.scaleTime().range([0, this.width]);
        const y = d3.scaleLinear().range([this.height, 0]);
        x.domain([this.start,this.end]);
        y.domain(d3.extent(this.trackingSentiment, d => d.sentiment));
        return { x, y };
    },
    priceScale() {
      const x = d3.scaleTime().range([0, this.width]);
      const y = d3.scaleLinear().range([this.height, 0]);
      x.domain([this.start,this.end]);
      let extent = d3.extent(this.candles, function(d) {return d.CloseAvg; })

      y.domain(extent);
      return { x, y };
    },
    priceDifferenceScale() {
      const y = d3.scaleLinear().range([0,1]);
      y.domain(d3.extent(this.candles, function(d) {return d.differenceAvg; }));
      return y;
    },
    rectWidth(){
      const x = d3.scaleTime().range([0, this.width]);
      x.domain([0,this.end-this.start]);
      if (this.period == 'minute'){
        return x(1*60*1000)
      } else{
        return x(1*60*60*1000)
      }
    }
  },
  methods:{
    gradientColor(p,i){

      if (Math.abs(Math.sign(this.modCandles[i].differenceAvg) + Math.sign(this.tweets[i][this.sentiment])) == 2 ){
        return 0.4
      } else {
        return 0
      }
    },
    offsetDates(){
      let _this = this
      let newCandles = JSON.parse(JSON.stringify(_this.candles))

      newCandles.forEach(function(part, index) {
        if (_this.period == 'minute'){
          part.date = new Date(part.date).addMinutes(_this.offset)
        } else {
          part.date = new Date(part.date).addHours(_this.offset)
        }
      });
      
      for (let i=0;i<Math.abs(this.offset);i++){
        newCandles.shift()
      }
      this.modCandles = newCandles
    }
  },
  directives: {
    axis(el, binding) {
      let axis = binding.arg; // x or y
      const axisMethod = { x: "axisBottom", y: "axisLeft", z: "axisRight"}[axis];
      
      //deal with the issue of X and Y
      (axis == 'z') ? axis = 'y' : axis

      const methodArg = binding.value[axis];

      var t = d3.transition()
        .duration(500)
        .ease(d3.easeLinear)

      d3.select(el).transition(t).call(d3[axisMethod](methodArg).ticks(5));
    }
  }
}
</script>
<style scoped>
rect{
  transition: all ease-in-out 0.5s;
}
circle{
  transition: all ease-in-out 1s;
}
</style>
