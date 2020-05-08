<template>
<span :class="{ highlight: highlight, huge:huge}">{{animatedRoundedNumber}}</span>
</template>

<script>
import { gsap } from "gsap";

export default {
    name: 'animate-number',
    props:{
        val: {
            required: true
        },
        round: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 1
        },
        highlight: {
            type: Boolean,
            default: false
        },
        grow: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            animatedNumber : 0
        }
    },
    watch:{
        val(newValue){
            gsap.to(this.$data, { duration: this.duration, animatedNumber: newValue })
        }
    },
    computed: {
        animatedRoundedNumber(){
            let rounded =  parseFloat(this.animatedNumber).toFixed(this.round)
            return parseFloat(rounded).toLocaleString('en')
        },
        huge(){
            return (this.val > 1500 && this.grow == true) ? true : false
        }
    }
}
</script>
<style scoped>
.huge{
    transition: all ease-in-out 1s;
    font-size: 3em;
    color:#5cc9f5;
    line-height: 1.2em;
}
</style>
