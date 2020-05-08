<template>
    <div id='tooltip' :class="{ active: visible }">
      <Tweet :id="id" :key="id"><div class="spinner"></div></Tweet>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { Tweet } from 'vue-tweet-embed'

export default {
  name: 'twitter-tooltip',
  components:{
    "Tweet": Tweet,
  },
  props: ['id', 'visible'],
}
</script>
<style scoped>
#tooltip{
    position: fixed;			
    pointer-events: none;		
    opacity: 0;
    width:400px;
}

#tooltip.active{
    transition: opacity 1s ease-in-out 0s;
    opacity: 1;
}

iframe {
    width: 100% !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
}
</style>
