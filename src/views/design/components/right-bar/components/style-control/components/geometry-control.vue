<template>
  <div class="">
    <div v-if="settingData && settingData.settings && settingData.settings.canSetDevel"
         class="slider-item">
      <span class="demonstration">斜面</span>
      <div class="item-value">{{ devel }}</div>
      <el-slider class="item-slider"
                 v-model="devel"
                 size="large"
                 :min="0"
                 :max="1"
                 :step="0.001"></el-slider>
    </div>
    <div v-if="settingData && settingData.settings && settingData.settings.canSetExtrude"
         class="slider-item">
      <span class="demonstration">压缩</span>
      <div class="item-value">{{ extrude }}</div>
      <el-slider class="item-slider"
                 v-model="extrude"
                 size="large"
                 :min="0"
                 :max="1"
                 :step="0.001"></el-slider>
    </div>
    <div v-if="settingData && settingData.settings && settingData.settings.canSetRound"
         class="slider-item">
      <span class="demonstration">弧度</span>
      <div class="item-value">{{ round }}</div>
      <el-slider class="item-slider"
                 v-model="round"
                 size="large"
                 :min="0"
                 :max="1"
                 :step="0.001"></el-slider>
    </div>
  </div>
</template>
<script setup>
// 形状控制组件
import { inject, computed } from 'vue'
import bus from '@/libs/mitt/mitt'
const settingData = inject('currentModuleSetting')

const devel = computed({
  get: () => {
    const { settings } = settingData ? settingData.value : {}
    return settings.morphTargetInfluences[0]
  },
  set: (devel) => {
    bus.emit('changeGeomtryShape', { type: 'devel', value: devel })
  }
})
const extrude = computed({
  get: () => {
    const { settings } = settingData ? settingData.value : {}
    return settings.morphTargetInfluences[1]
  },
  set: (extrude) => {
    bus.emit('changeGeomtryShape', { type: 'extrude', value: extrude })
  }
})
const round = computed({
  get: () => {
    const { settings } = settingData ? settingData.value : {}
    return settings.morphTargetInfluences[2]
  },
  set: (round) => {
    bus.emit('changeGeomtryShape', { type: 'round', value: round })
  }
})
</script>
<style scoped>
.slider-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.12rem;
  height: 0.4rem;
  line-height: 0.4rem;
  color: #616161;
}
.demonstration {
  width: 0.6rem;
  text-align: left;
  white-space: nowrap;
}
.item-value {
  background: #e0e0e0;
  color: #616161;
  height: 0.18rem;
  line-height: 0.18rem;
  border-radius: 0.05rem;
  margin-right: 0.08rem;
  min-width: 0.4rem;
  text-align: center;
}
.item-slider {
  flex: 1;
}
</style>
