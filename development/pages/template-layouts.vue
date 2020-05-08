<template>
  <el-container>
    <el-main>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="12">
          <div class="grid-content bg-purple">
            <h1>Title</h1>
            <div class="content">
              Main Extra Wide
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="20" :md="18" :lg="12" :xl="12">
          <div class="grid-content bg-purple-light">
            <div class="content">
              Main Wide
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="18" :md="12" :lg="8" :xl="8">
          <div class="grid-content bg-purple-light">
            <div class="content">
              Main Thin
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" style="flex-wrap: wrap;" class="row-bg" justify="space-around">
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content bg-purple">
            <div class="content">
              Block 1
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content bg-purple">
            <div class="content">
              Block 2
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content bg-purple">
            <div class="content">
              Block 3
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
          <div class="grid-content bg-purple">
            <div class="content">
              Block 4
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" style="flex-wrap: wrap;" class="row-bg" justify="center">
        <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
          <div class="grid-content bg-purple">
            <div class="content">
              Block 1
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
          <div class="grid-content bg-purple-light">
            <div class="content">
              Block 2
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script src="./js/main.js"></script>
<style src="./css/styles.css"></style>
<style scoped>
  .content{
    background-color: pink;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background-color: #99a9bf;
  }
  .bg-purple {
    background-color: #d3dce6;
  }
  .bg-purple-light {
    background-color: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    text-align: center;
    overflow: hidden;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>


