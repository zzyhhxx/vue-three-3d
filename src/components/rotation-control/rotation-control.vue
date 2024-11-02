<template>
  <div class="slider-control">
    <div class="item-top">
      <div class="top-title">旋转</div>
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
      <div class="item-value">{{ rotationX }}</div>
      <el-slider class="item-slider"
                 v-model="rotationX"
                 :min="min"
                 :max="max"
                 :step="step"></el-slider>
    </div>
    <div class="slider-item">
      <span class="demonstration">y</span>
      <div class="item-value">{{ rotationY }}</div>
      <el-slider class="item-slider"
                 v-model="rotationY"
                 :min="min"
                 :max="max"
                 :step="step"></el-slider>
    </div>
    <div class="slider-item">
      <span class="demonstration">z</span>
      <div class="item-value">{{ rotationZ }}</div>
      <el-slider class="item-slider"
                 v-model="rotationZ"
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
const min = -3.142
const max = 3.142
const step = 0.001
const settingData = inject('currentModuleSetting')
const rotation = computed({
  get: () => {
    const { settings } =
      settingData && settingData.value ? settingData.value : {}
    return settings && settings.rotation
      ? settings.rotation
      : { x: 0, y: 0, z: 0 }
  }
})
const rotationX = computed({
  get: () => {
    return formatFix2(rotation.value.x)
  },
  set: (x) => {
    bus.emit('setRotation', { x, y: rotationY.value, z: rotationZ.value })
  }
})
const rotationY = computed({
  get: () => {
    return formatFix2(rotation.value.y)
  },
  set: (y) => {
    bus.emit('setRotation', { x: rotationX.value, y, z: rotationZ.value })
  }
})
const rotationZ = computed({
  get: () => {
    return formatFix2(rotation.value.z)
  },
  set: (z) => {
    bus.emit('setRotation', { x: rotationX.value, y: rotationY.value, z })
  }
})

const reset = () => {
  bus.emit('setRotation', { x: 0, y: 0, z: 0 })
}
</script>
<style scoped>
.slider-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.12rem;
  height: 0.4rem;
  line-height: 0.4rem;
}
.demonstration {
  width: 0.6rem;
  text-align: left;
}
.item-slider {
  flex: 1;
}
.item-top {
  font-size: 0.14rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
