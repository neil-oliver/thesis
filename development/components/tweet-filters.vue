<template>
    <div id='filters'>
      <div style="padding:0 0 10px 0;">
        <div class="button-group-label">Followers</div>
        <el-radio-group :value="followers" @input="$emit('update:followers',$event)" size="mini">
          <el-radio-button label="0"></el-radio-button>
          <el-radio-button label="10"></el-radio-button>
          <el-radio-button label="100"></el-radio-button>
          <el-radio-button label="1,000"></el-radio-button>
          <el-radio-button label="10,000"></el-radio-button>
        </el-radio-group>
      </div>
      <div style="padding:0 0 10px 0;">
        <div class="button-group-label">Retweets</div>
        <el-radio-group :value="retweets" @input="$emit('update:retweets',$event)" size="mini">
          <el-radio-button label="0"></el-radio-button>
          <el-radio-button label="10"></el-radio-button>
          <el-radio-button label="100"></el-radio-button>
          <el-radio-button label="1,000"></el-radio-button>
          <el-radio-button label="10,000"></el-radio-button>
        </el-radio-group>
      </div>
      <div style="padding:0 0 10px 0;">
        <div class="button-group-label">Likes / Favorites</div>
        <el-radio-group :value="favorites" @input="$emit('update:favorites',$event)" size="mini">
          <el-radio-button label="0"></el-radio-button>
          <el-radio-button label="10"></el-radio-button>
          <el-radio-button label="100"></el-radio-button>
          <el-radio-button label="1,000"></el-radio-button>
          <el-radio-button label="10,000"></el-radio-button>
        </el-radio-group>
      </div>
      <div style="padding:0 0 10px 0;">
        <div class="button-group-label">Sentiment</div>
        <el-radio-group :value="sentiment" @input="$emit('update:sentiment',$event)" size="mini">
          <el-radio-button label="0">All</el-radio-button>
          <el-radio-button label="0.05">Weak</el-radio-button>
          <el-radio-button label="0.15">What the Scientists Use</el-radio-button>
          <el-radio-button label="0.5">Strong</el-radio-button>
          <el-radio-button label="0.8">Very Strong</el-radio-button>
        </el-radio-group>

      </div>
      <div style="padding:0 0 10px 0;">
        <div class="button-group-label"></div>
        <el-checkbox :value="verified" @input="$emit('update:verified',$event)" label="Verified Users Only" border size="mini"></el-checkbox>
      </div>
      <div style="padding:0 0 10px 0;" v-if="level > 0">
        <div class="button-group-label">Time Period</div>
        <el-radio-group :value="timePeriod" @input="$emit('update:timePeriod',$event)" size="mini">
          <el-radio-button label="minute"></el-radio-button>
          <el-radio-button label="hour"></el-radio-button>
        </el-radio-group>
      </div>
      <div style="padding:0 0 10px 0;" v-if="level > 0">
        <div class="button-group-label">number of {{timePeriod}}'s</div>
          <el-input-number size="mini" :value="endPeriod" @input="$emit('update:endPeriod',$event)" :min="1" :max="maxTimePeriod"></el-input-number>
      </div>
      <div style="padding:0 0 10px 0;" v-if="level > 1">
        <div class="button-group-label">Offset</div>
          <el-input-number size="mini" :value="offset" @input="$emit('update:offset',$event)" :min="-30" :max="0"></el-input-number>
      </div>
    </div>
</template>

<script>
export default {
  name: 'tweet-filters',
  props: ['followers', 'retweets', 'favorites', 'sentiment', 'verified', 'offset', 'level', 'timePeriod', 'endPeriod', 'maxTimePeriod',],
  methods:{
    test(event){
      console.log(event)
    }
  }
}
</script>
<style scoped>
#filters{
  text-align:left;
}
.button-group-label{
  display: inline-block;
  width:150px;
  font-family: 'Roboto', sans-serif;
  color:grey;
  text-transform: uppercase;
  font-size: 0.8em;
  font-weight: 300;
}
</style>
