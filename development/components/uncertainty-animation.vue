<template>
  <div id='animation' ref="animation">
    <svg v-if="tweets.length > 0" :width="svgWidth" :height="svgHeight">
      <g :transform="'translate(' + margin.left + ',' + margin.top + ')'">
        <path :d="candlePath" fill="#ffc864" fill-opacity="0.4" stroke="#ffc864" stroke-width="1px"/>
        <path :d="sentimentPath" fill="#8addff" fill-opacity="0.4" stroke="#8addff" stroke-width="1px"/>
        <line :x1="width/2" :y1="height" :x2="width/2" :y2="0" stroke="#000" stroke-width="2px" />
      </g>
    </svg>
    <div class='date' v-if="candles.length > 0"> {{date}}</div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'uncertainty-animation',
  props: ['candles', 'tweets','sentiment'],
  data(){
    return{
      margin: {top: 0, left: 0, bottom: 0, right: 0 },
      svgHeight : 100,
      svgWidth : 300,
      index:0
    }
  },
    mounted(){
    this.svgWidth = this.$refs.animation.offsetWidth
    this.svgHeight = this.$refs.animation.offsetWidth*0.3
  },
  computed:{
    width() {
      return this.svgWidth - this.margin.left - this.margin.right;
    },
    height() {
      return this.svgHeight - this.margin.top - this.margin.bottom;
    },
    date(){
      return new Date(this.tweets[this.index].date)
    },
    tweetSign(){
      return Math.sign(this.tweets[this.index][this.sentiment]) == 1 ? 'Positive' : 'Negative'
    },
    candleSign(){
      return Math.sign(this.candles[this.index].differenceAvg) == 1 ? 'Positive' : 'Negative'
    },
    candleData(){
      let candleMin = this.candles[this.index].differenceMin
      let candleMax = this.candles[this.index].differenceMax
      return [[candleMin,0], [this.candles[this.index].differenceAvg,1], [candleMax,0]]
    },
    tweetData(){
      return [[this.tweets[this.index].minSentiment,0], [this.tweets[this.index][this.sentiment],1], [this.tweets[this.index].maxSentiment,0]]
    },
    sentimentPath() {
        const path = d3.area()
            .x(d => this.sentimentScale.x(d[0]))
            .y1(d => this.sentimentScale.y(d[1]))
            .y0(this.height)
            .curve(d3.curveMonotoneX)
        
        return path(this.tweetData);
    },
    candlePath() {
        const path = d3.area()
            .x(d => this.priceScale.x(d[0]))
            .y1(d => this.priceScale.y(d[1]))
            .y0(this.height)
            .curve(d3.curveMonotoneX)
        
        setTimeout(() => {this.increaseIndex()},500)

        return path(this.candleData);
    },
    sentimentScale() {
        const x = d3.scaleLinear().range([0,this.width]).domain([-1, 1])
        const y = d3.scaleLinear().range([this.height,this.height*0.1]).domain([0, 1])

        return {x,y};
    },
    priceScale() {
      const x = d3.scaleLinear().range([0,this.width])
      let extent = [this.candles[this.index].differenceMin,this.candles[this.index].differenceMax]
      let max = Math.max(Math.abs(extent[0]),extent[1])
      x.domain([-Math.abs(max),max]);

      const y = d3.scaleLinear().range([this.height,this.height*0.1]).domain([0, 1])

      return {x,y}
    },
    indicatorColor(){
      if (Math.abs(Math.sign(this.candles[this.index].differenceAvg) + Math.sign(this.tweets[this.index][this.sentiment])) == 2 ){
        return '#23cf5f'
      } else {
        return '#da2915'
      }
    }
  },
  methods:{
    increaseIndex(){
      let max = Math.max(this.tweets.length, this.candles.length )
      if(this.index < max-1){
        this.index+=1
      } else {
        this.index = 0
      }
    },
    round(num){
      return num.toFixed(2)
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
.date{
    font-family: 'Roboto', sans-serif;
    color:grey;
    text-transform: uppercase;
    font-size: 0.8em;
}
path,line{
  transition: all ease-in-out 0.5s;
}
#animation{
  padding:20px;
  pointer-events: none;		
  text-align: center;
  margin-top:20px;
  width:100%
}

</style>
