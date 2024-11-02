<template>
  <div class="slider-control">
    <div class="item-top">
      <div class="top-title">位置</div>
      <div class="top-reset active"
           @click="reset()">
        <el-tooltip class="box-item"
                    effect="dark"
                    content="重置"
                    placement="top">
          <i class="ri ri-restart-line ri-lg"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="slider-item">
      <span class="demonstration">x</span>
      <div class="item-value">{{ positionX }}</div>
      <el-slider class="item-slider"
                 v-model="positionX"
                 :min="min"
                 :max="max"
                 :step="step"></el-slider>
    </div>
    <div class="slider-item">
      <span class="demonstration">y</span>
      <div class="item-value">{{ positionY }}</div>
      <el-slider class="item-slider"
                 v-model="positionY"
                 :min="min"
                 :max="max"
                 :step="step"></el-slider>
    </div>
    <div class="slider-item">
      <span class="demonstration">z</span>
      <div class="item-value">{{ positionZ }}</div>
      <el-slider class="item-slider"
                 v-model="positionZ"
                 :min="min"
                 :max="max"
                 :step="step"></el-slider>
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import bus from '@/libs/mitt/mitt'
import { formatFix2 } from '@/utils/common'
const min = -500
const max = 500
const step = 0.01
const settingData = inject('currentModuleSetting')
const position = computed({
  get: () => {
    const { settings } =
      settingData && settingData.value ? settingData.value : {}
    return settings && settings.position
      ? settings.position
      : { x: 0, y: 0, z: 0 }
  }
})
const positionX = computed({
  get: () => {
    return formatFix2(position.value.x)
  },
  set: (x) => {
    bus.emit('setPosition', { x, y: positionY.value, z: positionZ.value })
  }
})
const positionY = computed({
  get: () => {
    return formatFix2(position.value.y)
  },
  set: (y) => {
    bus.emit('setPosition', { x: positionX.value, y, z: positionZ.value })
  }
})
const positionZ = computed({
  get: () => {
    return formatFix2(position.value.z)
  },
  set: (z) => {
    bus.emit('setPosition', { x: positionX.value, y: positionY.value, z })
  }
})
const reset = () => {
  bus.emit('setPosition', { x: 0, y: 0, z: 0 })
}
</script>
<style scoped>
.slider-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.18rem;
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 0.12rem;
  color: #616161;
}
.demonstration {
  width: 0.6rem;
  text-align: left;
}
.item-slider {
  flex: 1;
}
.item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.14rem;
  height: 0.4rem;
  line-height: 0.4rem;
}
.top-reset {
  position: relative;
  font-size: 0.16rem;
  width: 0.28rem;
  height: 0.28rem;
  cursor: pointer;
}
.top-reset.active {
  color: #616161;
  border-radius: 50%;
}
.top-reset i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
</style>
