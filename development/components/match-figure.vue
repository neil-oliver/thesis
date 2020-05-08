<template>
  <div id="match">
    <h2>Match</h2>
    <div id='figure'><animate-number :val='match'/>%</div>
  </div>
</template>

<script>
import animateNumber from '~/components/animate-number';

export default {
  components: {
    "animate-number" : animateNumber
  },
  name: 'match-figure',
  props: ['title','tweets','candles','sentiment','offset'],
  computed:{
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
#match{
    display: block;
    text-align: center;
}
#figure{
    font-size:4em;
}
</style>
