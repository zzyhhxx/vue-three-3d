<template>
  <div class="general-ctr">
    <div class="title">基础</div>
    <el-divider class="divider" />
    <scene></scene>
    <el-divider class="divider" />
    <div class="light-box">
      <!-- 控制环境光 -->
      <ambient-light class="control-card"></ambient-light>
      <el-divider class="divider" />
      <!-- 控制自然光 -->
      <hemi-light></hemi-light>
      <el-divider class="divider" />
      <!-- 控制阴影 -->
      <shadow></shadow>
    </div>
  </div>
</template>
<script setup>
import ColorPicker from '@/components/color-picker/color-picker.vue'
import Shadow from './components/shadow.vue'
import AmbientLight from './components/ambient.vue'
import HemiLight from './components/hemilight.vue'
import Scene from './components/scene.vue'
</script>
<style>
.control-card.turnoff .el-card__body {
  display: none;
}
</style>
<style scoped>
.general-ctr {
  font-size: 0.12rem;
  padding: 0 0.08rem;
  padding-bottom: 0.5rem;
}
.title {
  color: #616161;
  font-size: 0.18rem;
  font-weight: bold;
  text-align: left;
  margin-top: 0.14rem;
}
.light-box {
  /* margin-top: 0.2rem; */
}
.divider {
  margin-top: 0.2rem;
  margin-bottom: 0.1rem;
}
</style>
