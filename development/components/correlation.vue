<template>
    <animate-number :val='type == "correlation" ? correlation : match' :round='type == "correlation" ? 2 : 0'></animate-number>
</template>

<script>
import animateNumber from '~/components/animate-number';

export default {
  components: {
    "animate-number" : animateNumber
  },
  name: 'Correlation',
  props: ['tweets','candles','sentiment','offset','type'],
  computed:{
    correlation (){
      let correlation = this.getPearsonCorrelation(this.tweets.map(x => x[this.sentiment]),this.offsetCandles.map(x => x.differenceAvg))
      //check that the correlation function returned a number and correct if needed.
      if (Number.isNaN(correlation)){
          correlation = 0;
      }
      return correlation.toFixed(2)
    },
    match(){
        let result = this.getMatch(this.tweets.map(x => (x[this.sentiment] > 0) ? 1 : 0),this.offsetCandles.map(x => (x.differenceAvg > 0) ? 1 : 0))
        return result * 100
    },
    offsetCandles(){
        let candleCopy = JSON.parse(JSON.stringify(this.candles))

        for(let i=0;i<Math.abs(this.offset);i++){
            if (candleCopy.length > 0){
                candleCopy.shift()
            }
        }
        return candleCopy
    }
  },
  methods:{
    getPearsonCorrelation (x, y) {
        // code adapted from: https://memory.psych.mun.ca/tech/js/correlation.shtml
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
    },
    getMatch(x,y){
        let max = Math.max(x.length, y.length)

        let results = []

        for (let i=0;i<max;i++){
            x[i] == y[i] ? results.push(1) : results.push(0)
        }

        if (results.length > 0) {
            let total = results.reduce((previous, current) => current += previous)
            let average = total / results.length
            return average.toFixed(2)
        } else {
            return 0
        }
    }
  }
}
</script>
<style scoped>
#correlations{
    display: block;
    text-align: center;
}
</style>
