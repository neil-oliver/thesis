<template>
  <div class="vis" ref="sentimentviscontainer">
    <el-checkbox size="mini" v-model="curve" label="Curve" border></el-checkbox>
    <el-checkbox size="mini" v-model="fixedHeight" label="Fixed Values" border></el-checkbox>

    <h6>{{title}}</h6>
    <div>
      <svg width="100%" :height="svgHeight">
        <g :transform="'translate(' + margin.left + ',' + margin.top + ')'">
          <line :x1="0" :y1="sentimentScale.y(0)" :x2="width" :y2="sentimentScale.y(0)" style="stroke:rgb(19, 105, 163);stroke-width:2" />
          <g>
            <path :d="candlePath" :stroke="candleStroke" stroke-width="2px" fill="none"/>
            <path :d="sentimentPath" :stroke="pathColor" stroke-width="2px" fill="none"/>
            <path :d="sentimentArea" :fill="pathColor" :fill-opacity="areaOpacity" stroke="none"/>
            <path :d="candleArea" :fill="candleStroke" :fill-opacity="areaOpacity" stroke="none"/>
          </g>
          <g v-axis:x="sentimentScale" :transform="`translate(0, ${height})`"></g>
          <g v-axis:y="sentimentScale"></g>
          <g v-axis:z="priceScale" :transform="`translate(${width},0)`"></g>
          <text class="axis-label" :x="height/2" :y="0-width-40" transform="rotate(90)" fill="#000">Price Change</text>
          <text class="axis-label" :x="0-height/2" :y="0-40" transform="rotate(270)" fill="#000">Sentiment</text>
          <text class="axis-label" :x="width/2" :y="height+40" fill="#000">Time</text>
        </g>
      </svg>
    </div>
    <div id="details">
      <div>Total {{titleWord}}s: <animate-number :val="total"></animate-number></div>
      <div>Average {{title}} : <animate-number :val="totalAverage"></animate-number></div>
      Pearson's R Correlation: <correlation :tweets="tweets" :candles="candles" :sentiment="sentiment" :offset="offset" type="correlation"/><br>
      Match Percentage: <correlation :tweets="tweets" :candles="candles" :sentiment="sentiment" :offset="offset"/>%
    </div>
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
import matchFigure from '~/components/match-figure'

import animateNumber from '~/components/animate-number';


export default {
  name: 'sentiment-vis',
  components:{
    'animate-number':animateNumber,
    correlation: correlation,
    'match-figure':matchFigure
  },
  props: {
    tweets:{
      type:Array,
    }, 
    candles:{
      type:Array,
    },
    weight:{
      type:Number,
    },
    selected:{
      type:Number
    }
  },
  data(){
    return{
      margin: {top: 50, left: 50, bottom: 50, right: 50 },
      modCandles: [],
      candleStroke: "#ffc864",
      svgHeight : 400,
      svgWidth : 800,
      sentimentList: [
        {key:'avgSentiment',title:'Tweet Sentiment'},
        {key:'followerSentiment',title:'Follower Weighted Sentiment'},
        {key:'retweetSentiment', title:'Retweet Weighted Sentiment'},
        {key:'likeSentiment',title:'Like Weighted Sentiment'}
      ],
      index:this.weight,
      offset:0,
      fixedHeight:false,
      curve:false
    }
  },
  created(){
    this.debouncedOffsetDates = _.debounce(this.offsetDates, 200)
  },
  watch:{
    select(){
      this.$emit('sentimentFocusUpdate', this.select)
    },
    selected(newValue,OldValue){
      this.bars = true
      console.log(newValue, OldValue)
      if (newValue == this.select){
        this.select = OldValue
      }
    },
    offset(newValue, oldValue){
      return this.debouncedOffsetDates()
    },
    candles(){
      this.offsetDates()
    }
  },
  mounted(){
    this.svgWidth = this.$refs.sentimentviscontainer.offsetWidth
    this.svgHeight = this.$refs.sentimentviscontainer.offsetWidth*0.5
    if (window.innerWidth < 768){
      this.margin = {top: 20, left: 30, bottom: 20, right: 30 }
    }
  },
  computed:{
    start(){
      return d3.min(this.tweets, d => new Date(d.date))
    },
    end(){
      return d3.max(this.tweets, d => new Date(d.date))
    },
    period(){
      let p = 'hour'
      if (this.candles.length > 0){
        if (this.candles[0]._id.hasOwnProperty('minute')){
          p = 'minute'
        }
      }
      return p
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
    sentiment(){
      return this.sentimentList[this.index].key
    },
    title(){
      return this.sentimentList[this.index].title
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
    totalTweets(){
      return d3.sum(this.tweets, d => d.Count)
    },
    totalAverage(){
      let avg = d3.mean(this.tweets, d => d[this.sentiment])
      return parseFloat(avg).toFixed(2)
    },
    curveType(){
      return this.curve ? d3.curveCardinal : d3.curveStepAfter
    },
    sentimentPath() {
      if (!this.fixedHeight){
        const path = d3.line()
            .x(d => this.sentimentScale.x(new Date(d.date)))
            .y(d => this.sentimentScale.y(d[this.sentiment]))
            .curve(this.curveType);
        return path(this.tweets);
      } else {
        const path = d3.line()
            .x(d => this.sentimentScale.x(new Date(d.date)))
            .y(d => this.sentimentScale.y((d[this.sentiment] > 0) ? 0.5 : -0.5))
            .curve(this.curveType);
        return path(this.tweets);
      }
    },
    sentimentArea(){
      var area = d3.area()
        .x(d => this.sentimentScale.x(new Date(d.date)))      // Position of both line breaks on the X axis
        .y1(d => this.sentimentScale.y(d['maxSentiment']))     // Y position of top line breaks
        .y0(d => this.sentimentScale.y(d['minSentiment']))  
        .curve(this.curveType);

      return area(this.tweets);

    },
    candleArea(){
      var area = d3.area()
        .x(d => this.priceScale.x(new Date(d.date)))      // Position of both line breaks on the X axis
        .y1(d => this.priceScale.y(d.differenceMax))     // Y position of top line breaks
        .y0(d => this.priceScale.y(d.differenceMin))  
        .curve(this.curveType);

      return area(this.modCandles);

    },
    areaOpacity(){
      return this.fixedHeight ? 0 : 0.2
    },
    pathColor(){
      return d3.interpolateViridis((1/4)*this.index)
    },
    candlePath() {
      if (!this.fixedHeight){
        const path = d3.line()
            .x(d => this.priceScale.x(new Date(d.date)))
            .y(d => this.priceScale.y(d.differenceAvg))
            .curve(this.curveType);
        return path(this.modCandles);
      } else {
        let extent = d3.extent(this.candles, function(d) {return d.differenceAvg; })
        let max = Math.max(Math.abs(extent[0]),extent[1])
        const path = d3.line()
            .x(d => this.priceScale.x(new Date(d.date)))
            .y(d => this.priceScale.y((d.differenceAvg > 0) ? max / 2 : -Math.abs(max / 2)))
            .curve(this.curveType);
        return path(this.modCandles);
      }
    },
    sentimentScale() {
        const x = d3.scaleTime().range([0, this.width]);
        const y = d3.scaleLinear().range([this.height, 0]);
        x.domain([this.start,this.end]);
        y.domain([-1, 1]);
        return { x, y };
    },
    priceScale() {
      const x = d3.scaleTime().range([0, this.width]);
      const y = d3.scaleLinear().range([this.height, 0]);
      x.domain([this.start,this.end]);
      let extent = d3.extent(this.candles, function(d) {return d.differenceAvg; })

      if (!this.fixedHeight){
        extent = [d3.min(this.candles, function(d) {return d.differenceMin; }), d3.max(this.candles, function(d) {return d.differenceMax; })]
      }

      let max = Math.max(Math.abs(extent[0]),extent[1])

      y.domain([-Math.abs(max),max]);
      return { x, y };
    }
  },
  methods:{
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

</style>
