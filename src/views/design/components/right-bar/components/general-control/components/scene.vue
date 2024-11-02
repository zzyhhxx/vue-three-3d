<template>
  <div class="scene-box">
    <div class="box-label">场景设置</div>
    <div class="box-item">
      <div class="item-name">背景</div>
      <div class="item-opt">
        <el-select v-model="backgroundType"
                   class="m-2"
                   placeholder=""
                   :popper-append-to-body="false"
                   size="small">
          <el-option v-for="item in backgroundTypes"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value" />
        </el-select>
      </div>
    </div>

    <div class="box-item">
      <div class="item-name">背景色</div>
      <div v-if="backgroundType === 'blank'"
           class="item-opt">
        <color-picker :init-color="environmentSettings.sceneBgColor"
                      @changeColor="changeColor"></color-picker>
      </div>
      <div v-else
           class="item-opt">
        <color-picker :init-color="environmentSettings.sceneBgColorFirst"
                      @changeColor="changeFirstColor"></color-picker>
        <color-picker class="color-opt"
                      :init-color="environmentSettings.sceneBgColorSecond"
                      @changeColor="changeSecondColor"></color-picker>
      </div>
    </div>

    <div v-if="backgroundType === 'gradient'"
         class="box-item">
      <div class="item-name">角度</div>
      <div class="item-value">{{ angle }}</div>
      <el-slider class="item-slider"
                 v-model="angle"
                 :min="- 90"
                 :max="90"
                 :step="1"></el-slider>
    </div>

    <div v-if="showCameraZoom"
         class="box-item">
      <div class="item-name">透视</div>
      <div class="item-opt">
        <el-select v-model="cameraZoom"
                   class="m-2"
                   placeholder=""
                   :popper-append-to-body="false"
                   size="small">
          <el-option v-for="item in cameraZoomConfig"
                     :key="item.value"
                     :label="item.name"
                     :value="item.value" />
        </el-select>
      </div>
    </div>
  </div>
</template>
<script setup>
import ColorPicker from '@/components/color-picker/color-picker.vue'
import bus from '@/libs/mitt/mitt'
import { inject, computed } from 'vue'
const environmentSettings = inject('environmentSettings')
const cameraSettings = inject('cameraSettings')
const cameraZoom = computed({
  get: () => {
    return cameraSettings.value.zoom
  },
  set: (per) => {
    bus.emit('changeCameraZoom', per)
  }
})
const cameraZoomConfig = [
  {
    name: '15%',
    value: 0.15
  },
  {
    name: '25%',
    value: 0.25
  },
  {
    name: '50%',
    value: 0.5
  },
  {
    name: '75%',
    value: 0.75
  },
  {
    name: '100%',
    value: 1
  }
]

const showCameraZoom = computed(() => {
  return cameraSettings.value.type === 'per'
})
// gradient
const backgroundType = computed({
  get: () => {
    return environmentSettings.value.backgroundType
  },
  set: (type) => {
    bus.emit('changeBackgroundType', type)
  }
})
const backgroundTypes = [
  {
    name: '单色',
    value: 'blank'
  },
  {
    name: '渐变',
    value: 'gradient'
  }
]

const angle = computed({
  get: () => {
    return environmentSettings.value.bgColorAngle
  },
  set: (angle) => {
    bus.emit('changeGradientBg', { angle })
  }
})

const changeColor = (color) => {
  bus.emit('changeBgColor', color)
}
const changeFirstColor = (color) => {
  bus.emit('changeGradientBg', { color })
}
const changeSecondColor = (color) => {
  bus.emit('changeGradientBg', { color2: color })
}
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
  font-size: 0.14rem;
  text-align: left;
  margin-top: 0.14rem;
}
.scene-box {
  margin-top: 0.1rem;
}
.box-label {
  text-align: left;
  font-size: 0.16rem;
}
.box-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #616161;
}
.box-item:nth-child(n + 3) {
  margin-top: 0.05rem;
}
.item-opt .el-select {
  width: 0.65rem;
}
.light-box {
  margin-top: 0.2rem;
}
.item-name {
  white-space: nowrap;
  width: 0.6rem;
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
.item-slider {
  flex: 1;
}
.color-opt {
  margin-left: 0.1rem;
}
</style>
