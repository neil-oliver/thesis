<template>
<div class="progress-stage">
    <span :class="{visible: show == true, desc:true}">{{el.textContent}}</span>
    <span v-on:click="handleClick" @mouseover="showDesc" @mouseout="showDesc" :class="{ progressfocus: checkpoint == true, ball:true }"></span>
</div>
</template>

<script>

export default {
    name: 'progress-tracker',
    props:['offset', "el"],
    data(){
        return {
            show:false,
            offsetHeight:0
        }
    },
    mounted(){
        this.offsetHeight = this.el.getBoundingClientRect().top
    },
    computed:{
        checkpoint(){
            return this.offsetHeight <= this.offset ? true : false
        },
    },
    methods:{
        showDesc(){
            this.show = !this.show
        },
        handleClick(){
            this.el.scrollIntoView()
        }
    }
}
</script>
<style scoped>
    .progress-stage{
        text-align:right;
        padding:10px;
        height:2em;
    }
    .desc{
        padding:0 10px;
        border-radius:5px;
        background-color:rgba(255,255,255,0.7);
        border-style: solid;
        border-width: 1px;
        border-color: #e2e2e2;
        font-family: 'DM Serif Display', serif;
        font-size:1.5em;
        font-weight: bold;
        opacity:0;
        pointer-events: none;
    }
    .visible{
        opacity:1;
        transition: all 0.5s ease-in-out 0s;
    }
    .ball{
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background-color:#fff;
        display: inline-block;
        border-style: solid;
        border-width: 2px;
        border-color: #bbb;
        pointer-events: auto;
    }
    .progressfocus{
        border-color: #5a5a5a;
        border-width: 3px;
        transition: all 0.5s ease-in-out 0s;
    }

    @media only screen and (max-width: 768px) {
        .ball{
            height: 10px;
            width: 10px;
        }
        .progress-stage{
            padding:0;
        }
    }
</style>
