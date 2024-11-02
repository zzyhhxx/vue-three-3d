<template>
  <div>
    <div class="card-header">
      <span>阴影</span>
      <el-switch v-model="turnOff"
                 class="ml-2"
                 active-color="#000000"
                 inactive-color="#bbbec1" />
    </div>
    <div class="color-item">
      <div class="label">颜色</div>
      <color-picker class="color-picker"
                    :init-color="shadowColor"
                    @changeColor="changeColor"></color-picker>
    </div>
    <div class="slider-item">
      <span class="demonstration">不透明度</span>
      <div class="item-value">{{ opacity }}</div>
      <el-slider class="item-slider"
                 v-model="opacity"
                 :min="settings.opacity.min"
                 :max="settings.opacity.max"
                 :step="settings.opacity.step"></el-slider>
    </div>
    <div class="slider-item">
      <span class="demonstration">模糊</span>
      <div class="item-value">{{ blur }}</div>
      <el-slider class="item-slider"
                 v-model="blur"
                 :min="settings.blur.min"
                 :max="settings.blur.max"
                 :step="settings.blur.step"></el-slider>
    </div>
    <div class="slider-item">
      <span class="demonstration">高度</span>
      <div class="item-value">{{ height }}</div>
      <el-slider class="item-slider"
                 v-model="height"
                 :min="settings.height.min"
                 :max="settings.height.max"
                 :step="settings.height.step"></el-slider>
    </div>

  </div>
</template>
<script setup>
import ColorPicker from '@/components/color-picker/color-picker.vue'
import bus from '@/libs/mitt/mitt'
import { computed, inject } from 'vue'
import { formatFix2 } from '@/utils/common'
const settings = {
  opacity: {
    min: 0,
    max: 1,
    step: 0.01
  },
  blur: {
    min: 0.5,
    max: 10,
    step: 0.01
  },
  height: {
    min: -100,
    max: 100,
    step: 1
  }
}
const settingsData = inject('shadowSettings')
const shadowSettings = computed({
  get: () => {
    return settingsData ? settingsData.value : {}
  }
})
const turnOff = computed({
  get: () => {
    return shadowSettings.value.visible
  },
  set: (flag) => {
    bus.emit('switchShadow', flag)
  }
})
const shadowColor = computed({
  get: () => {
    return shadowSettings.value.color
  }
})
const changeColor = (color) => {
  bus.emit('changeShadow', { color })
}
const opacity = computed({
  get: () => {
    return formatFix2(shadowSettings.value.opacity)
  },
  set: (opacity) => {
    bus.emit('changeShadow', { opacity })
  }
})
const blur = computed({
  get: () => {
    return formatFix2(shadowSettings.value.blur)
  },
  set: (blur) => {
    bus.emit('changeShadow', { blur })
  }
})
const height = computed({
  get: () => {
    return formatFix2(shadowSettings.value.height)
  },
  set: (height) => {
    bus.emit('changeShadow', { height })
  }
})
</script>
<style>
.el-drawer__body {
  padding: 0.1rem !important;
}
</style>
<style scoped>
.box-card {
  width: 100%;
  font-size: 0.18rem;
  border-radius: 0.15rem;
}
.slider-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.12rem;
  height: 0.4rem;
  line-height: 0.4rem;
  color: #616161;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header span {
  font-size: 0.16rem;
}
.demonstration {
  width: 0.6rem;
  text-align: left;
  white-space: nowrap;
}
.item-slider {
  flex: 1;
}
.color-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.color-item .label {
  white-space: nowrap;
}
.position {
  margin-top: 0.2rem;
}
.position .label {
  text-align: left;
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
.sky-ground {
  display: flex;
  justify-content: space-between;
}
.sky-ground .color-item .label {
  margin-right: 0.08rem;
}
</style>
