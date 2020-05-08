<template>
  <div class='selection'>
    <label for="{{attr}}slider">{{name}}</label>
    <input type="range" :min="{{min}}" :max="{{max}}" v-model="val" class="slider" id="{{attr}}slider">{{attr}}
  </div>
</template>
<script>
export default {
  name: 'filter-slider',
  props: [name, max, min, attr],
  data: () {
    val: 0
  }
}
</script>
<style scoped>

</style>
