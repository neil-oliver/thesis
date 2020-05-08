<template>
<span :style="{'background-image':gradient}" :class="{color:highlight == true, 'no-color':true}">
    {{val}}
</span>
</template>

<script>

export default {
    name: 'sentiment-highlight',
    props:{
        val: {
            required: true
        },
        color:{
            required: true
        }
    },
    data(){
        return {
            highlight:false
        }
    },
    computed:{
        gradient(){
            return `linear-gradient(to right, white 50%, ${this.color} 50%)`
        }
    },
    mounted(){
        this.switch()
    },
    methods:{
        switch(){
            setTimeout(() => {
                this.highlight = !this.highlight
                this.switch()
            }, 5000);
        }
    }
}
</script>
<style scoped>
.no-color{
  background-position: 0;
  background-size: 200%;
  transition: all 0.4s;
}
.color{
    background-position: -100%
}

</style>
