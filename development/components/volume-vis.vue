<template>
  <div class="vis" ref="volumeviscontainer">
    <h6>{{select.charAt(0).toUpperCase() + select.slice(1)}}</h6>
    <div class="options inner-focus active" v-if="main">
      <!-- <div>
        <el-radio-group v-model="select" @change="bars = true" size="mini">
          <el-radio-button label="tweets"></el-radio-button>
          <el-radio-button label="followers"></el-radio-button>
          <el-radio-button label="likes"></el-radio-button>
          <el-radio-button label="retweets"></el-radio-button>
        </el-radio-group>
      </div> -->
      <el-checkbox size="mini" v-model="bars" label="Display Individual Tweets" border></el-checkbox>
    </div>
    <svg width="100%" :height="svgHeight" v-if="tweets.length > 0 && candles.length > 0">
      <g :transform="'translate(' + margin.left + ',' + margin.top + ')'">
        <path :d="stackArea" fill="#8addff" :fill-opacity="areaOpacity" :stroke-opacity="strokeOpacity" stroke="#8addff" stroke-width="1px"/>

        <g v-for="(row, i) in stack" :key="i" :opacity="stackOpacity">
          <rect v-for="(block, index) in stack[i]" :key="index" @mouseover="$emit('tooltip', {visible: true, id:block.data.values[i].id_str})" @mouseout="$emit('tooltip', {visible:false})"
            :height="stackScale.y(block[0]) - stackScale.y(block[1])"
            :width="width/tweetBars.length"
            :x="stackScale.x(new Date(block.data.key))"
            :y="stackScale.y(block[1])"
            fill="#8addff"
            stroke="#8addff"
            :fill-opacity="i % 2 ? 0.2 : 0.6"
          />
        </g>
        <path :d="candleArea" fill="#ffc864" fill-opacity="0.4" stroke="#ffc864" stroke-width="1px"/>
        <g v-axis:x="stackScale" :transform="`translate(0, ${height})`"></g>
        <g v-axis:y="stackScale"></g>
        <g v-axis:z="candleScale" :transform="`translate(${width},0)`"></g>
        <text class="axis-label" :x="height/2" :y="0-width-60" transform="rotate(90)" fill="#000">Bitcoin Volume</text>
        <text class="axis-label" :x="0-height/2" :y="0-60" transform="rotate(270)" fill="#000">{{select}} Volume</text>
        <text class="axis-label" :x="width/2" :y="height+40" fill="#000">Time</text>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { gsap } from "gsap";
import animateNumber from '~/components/animate-number';


export default {
  name: 'volume-vis',
  components:{
    "animate-number" : animateNumber,
  },
  props: {
    tweets:{
      type:Array,
      required:true
    }, 
    candles:{
      type:Array,
      required:true
    }, 
    main:{
      type:Boolean,
      default:false
    }, 
    'weight':{
      type:String,
    },
    selected:{
      type:String
    }
  },
  data(){
    return{
      svgWidth : 200,
      svgHeight : 200,
      margin: {top: 50, left: 80, bottom: 50, right: 80 },
      bars: (this.main == true) ? false : true,
      select: this.weight
    }
  },
  mounted(){
    this.svgWidth = this.$refs.volumeviscontainer.offsetWidth
    this.svgHeight = this.$refs.volumeviscontainer.offsetWidth*0.5
    if (window.innerWidth < 768){
        this.margin = {top: 20, left: 30, bottom: 20, right: 30 }
    }
  },
  watch:{
    select(){
      this.$emit('volumeFocusUpdate', this.select)
    },
    selected(newValue,OldValue){
      this.bars = true
      console.log(newValue, OldValue)
      if (newValue == this.select){
        this.select = OldValue
      }
    }
  },
  computed:{
    start(){
      return d3.min(this.tweets, d => new Date(d.created_at))
    },
    end(){
      return d3.max(this.filteredTweets, d => new Date(d.created_at))
    },
    width() {
      return this.svgWidth - this.margin.left - this.margin.right;
    },
    height() {
      return this.svgHeight - this.margin.top - this.margin.bottom;
    },
    stackOpacity(){
      return this.bars ? "1" : "0"
    },
    areaOpacity(){
      return this.bars ? "0" : "0.4"

    },
    strokeOpacity(){
      return this.bars ? "0" : "1"
    },
    filteredTweets(){
      let maxDate = d3.max(this.tweets, d => d.created_at)
      maxDate = this.filterTime(maxDate)
      return this.tweets.filter(d => d.created_at < maxDate)
    },
    stack(){

        let nested = d3.nest().key(d => this.filterTime(d.created_at)).entries(this.filteredTweets)
        let maxVals = d3.max(nested.map((d) => d.values.length))
        let keys = d3.range(maxVals)
        let stackSetup = d3.stack()
            .keys(keys)
            .value((d,key) => {
              return key < d.values.length ? this.stackSelect.selection(d,key) : 0
              })

        return stackSetup(nested)
    },
    tweetBars(){
      let _this = this
      let selection = () => 1

      if (this.select == 'tweets'){
          selection = () => 1
      } else if (this.select == 'followers'){
          selection = (d) => d.user.followers_count
      } else if (this.select == 'likes'){
          selection = (d) => d.favorite_count
      } else if (this.select == 'retweets'){
          selection = (d) => d.retweet_count
      }

      return d3.nest()
        .key(d => this.filterTime(d.created_at))
        .rollup(v => d3.sum(v, d => selection(d)))
        .entries(this.tweets);
      
    },
    stackScale() {
      let y = d3.scaleLinear().range([this.height,0]);
      const x = d3.scaleTime().range([0, this.width]);
      x.domain([this.start,this.end]);

      y.domain([0,d3.max(this.tweetBars, d => d.value)]);
      return { x, y };
    },
    stackSelect(){
        let max = (d) => d.Count
        let selection = (d,key) => 1;

        if (this.select == 'tweets'){
            selection = (d,key) => 1
            max = (d) => d.Count
        } else if (this.select == 'followers'){
            selection = (d,key) => d.values[key].user.followers_count
            max = (d) => d.maxFollowers
        } else if (this.select == 'likes'){
            selection = (d,key) => d.values[key].favorite_count
            max = (d) => d.maxLikes
        } else if (this.select == 'retweets'){
            selection = (d,key) => d.values[key].retweet_count
            max = (d) => d.maxRetweets
        }
        return {max, selection};
    },
    candleScale(){
      let y = d3.scaleLinear().range([this.height,0]);

      const x = d3.scaleTime().range([0, this.width]);
      x.domain([this.start,this.end]);
      y.domain([0,d3.max(this.candles, d => d.VolumeSum)]);
      return { x, y };

    },
    candleArea(){
          let curve = this.bars ? d3.curveStepAfter : d3.curveCardinal
          const area = d3.area()
            .x(d => this.candleScale.x(new Date(d.date)))
            .y1(d => this.candleScale.y(d.VolumeSum))
            .y0(this.candleScale.y(0))  
            .curve(curve);
        return area(this.candles);
    },
    stackArea(){
      let curve = this.bars ? d3.curveStepAfter : d3.curveCardinal

      const area = d3.area()
        .x(d => this.stackScale.x(new Date(d.key)))
        .y1(d => this.stackScale.y(d.value))
        .y0(this.candleScale.y(0))  
        .curve(curve);
      return area(this.tweetBars);
    }
  },
  methods:{
    filterTime (date){
          date = JSON.parse(JSON.stringify(date))
          date = new Date(date)
          date.setMinutes(0)
          date.setSeconds(0)
          date.setMilliseconds(0)

      return date
    }
  },
  directives: {
    axis(el, binding) {
      let axis = binding.arg; // x or y
      const axisMethod = { x: "axisBottom", y: "axisLeft", z:"axisRight" }[axis];

      //deal with the issue of X and Y
      (axis == 'z') ? axis = 'y' : axis

      const methodArg = binding.value[axis];

      var t = d3.transition()
        .duration(500)
        .ease(d3.easeLinear)

      d3.select(el).transition(t).call(d3[axisMethod](methodArg));
    }
  }
}
</script>
<style scoped>
rect{
  transition: all 0.5s ease-in-out 0s
}
path{
  transition: all ease-in-out 1s
}
</style>
