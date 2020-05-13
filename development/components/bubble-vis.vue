<template>
  <div class="vis" ref="bubbleviscontainer">
    <el-checkbox v-if="options" size="mini" v-model="grid" label="Grid View" border></el-checkbox>
    <svg width="100%" :height="svgHeight">
      <g :transform="'translate(' + margin.left + ',' + margin.top + ')'">
          <g v-for="(element, i) in tweets" :key="element.id_str"  :transform="move(element,i)" @mouseover="$emit('tooltip', {visible: true, id: element.id_str})" @mouseout="$emit('tooltip', {visible:false})">
          <path :d="path" :fill="grid == true ? '#7CD9FF' : fillColor(element.sentiment)" stroke="#7CD9FF" stroke-width="10" :stroke-opacity="grid == true ? 1 : 0" :fill-opacity="element.filtered == true ? 1 : 0"/>
          </g>
        <transition-group tag="g" name="fade">
          <g key="1" v-if="grid == false" v-axis:x="axisScale" :transform="`translate(0, ${height})`"></g>
          <g key="2" v-if="grid == false" v-axis:y="axisScale"></g>
          <text key="3" v-if="grid == false" class="axis-label" :x="0-height/2" :y="0-40" transform="rotate(270)" fill="#000">Interactions</text>
          <text key="4" v-if="grid == false" class="axis-label" :x="width/2" :y="height+40" fill="#000">Time</text>
        </transition-group>
      </g>
    </svg>
  </div>              
</template>

<script>
  import * as d3 from 'd3';

  export default {
    name: 'bubble-vis',

    data(){
      return{
        svgHeight : 800,
        svgWidth : 800,
        margin: {top: 20, left: 50, bottom: 50, right: 20 },
        grid:true,
        path: "M153.62,301.59c94.34,0,145.94-78.16,145.94-145.94,0-2.22,0-4.43-.15-6.63A104.36,104.36,0,0,0,325,122.47a102.38,102.38,0,0,1-29.46,8.07,51.47,51.47,0,0,0,22.55-28.37,102.79,102.79,0,0,1-32.57,12.45,51.34,51.34,0,0,0-87.41,46.78A145.62,145.62,0,0,1,92.4,107.81a51.33,51.33,0,0,0,15.88,68.47A50.91,50.91,0,0,1,85,169.86c0,.21,0,.43,0,.65a51.31,51.31,0,0,0,41.15,50.28,51.21,51.21,0,0,1-23.16.88,51.35,51.35,0,0,0,47.92,35.62,102.92,102.92,0,0,1-63.7,22A104.41,104.41,0,0,1,75,278.55a145.21,145.21,0,0,0,78.62,23",
      }
    },
    props: {
        tweets: {
            required: true,
            type:Array
        },
        options:{
          type:Boolean,
          default:false
        }
    },
    created(){
      (this.options == true) ? this.grid = false : this.grid = true
    },
    computed:{
      width() {
        return this.svgWidth - this.margin.left - this.margin.right;
      },
      height() {
        return this.svgHeight - this.margin.top - this.margin.bottom;
      },
      start(){
        return d3.min(this.tweets, d => new Date(d.created_at))
      },
      end(){
        return d3.max(this.tweets, d => new Date(d.created_at))
      },
      axisScale(){
        const x = d3.scaleTime().range([0, this.width]);
        x.domain([this.start,this.end]);
        const y = d3.scaleLog().range([this.height, 0]).base(2).nice();
        y.domain(d3.extent(this.tweets, d => d.interaction_count ));
        return { x, y };
      },
      fillColor(){
          return d3.scaleLinear().domain([-1,0,1]).range(['#ff6076', '#fccd47', '#4af2a1'])
      },
      rowLength(){
        return Math.ceil(Math.sqrt(this.tweets.length))
      },
      x(){
        if (this.grid){
          let x = d3.scaleLinear()
              .domain([0,this.rowLength])
              .range([0, this.width])
            return (el,i) => x(i % this.rowLength )
        } else {
          let x = d3.scaleTime()
            .range([0, this.width])
            .domain([this.start,this.end]);
          return (el,i) => x(el.created_at)
        }
      },
      y(){
        if (this.grid){
          let y = d3.scaleLinear()
            .domain([0,this.rowLength])
            .range([0, this.height])
          return (el,i) => y(Math.floor(i / this.rowLength))
        } else {
          let y = d3.scaleLog()
            .range([this.height-10, 0])
            .domain(d3.extent(this.tweets, d => d.interaction_count ));
          return (el,i) => y(el.interaction_count)
        }
      },
      size(){
        let maxSize = 50;

        if (window.innerWidth < 768){
          maxSize = 20;
        }
        if (this.grid){
          return (el) => (this.height / (this.rowLength*3)) > 15 ? 15 : (this.height / (this.rowLength*3));
        } else {
          let size = d3.scaleLinear().range([2, maxSize])
            .domain(d3.extent(this.tweets, d => d.user.followers_count));
          return (el) => size(el.user.followers_count)
        }
      },
      move(){
        return (element,i) => `translate(${this.x(element,i)},${this.y(element,i)}) scale(${this.size(element)/100})`
      }
    },
    mounted(){
      this.svgWidth = this.$refs.bubbleviscontainer.offsetWidth
      this.svgHeight = this.$refs.bubbleviscontainer.offsetWidth
      if (window.innerWidth < 768){
        this.margin = {top: 20, left: 20, bottom: 20, right: 20 }
      }
    },
    directives: {
      axis(el, binding) {
        let _this = this
        let axis = binding.arg; // x or y
        const axisMethod = { x: "axisBottom", y: "axisLeft"}[axis];

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

.fade-enter-active, .fade-leave-active {
  transition: 1s opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
