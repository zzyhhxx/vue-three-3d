<template>
  <div>
    <div class="card-header">
      <span>自然光</span>
      <el-switch v-model="turnOff"
                 class="ml-2"
                 active-color="#000000"
                 inactive-color="#bbbec1" />
    </div>
    <div class="sky-ground">
      <div class="color-item">
        <div class="label">天空颜色</div>
        <color-picker class="color-picker"
                      :init-color="initSkyColor"
                      @changeColor="changeSkyColor"></color-picker>
      </div>

      <div class="color-item">
        <div class="label">地板颜色</div>
        <color-picker class="color-picker"
                      :init-color="initGroundColor"
                      @changeColor="changeGroundColor"></color-picker>
      </div>
    </div>
    <div class="slider-item">
      <span class="demonstration">强度</span>
      <div class="item-value">{{ intensity }}</div>
      <el-slider class="item-slider"
                 v-model="intensity"
                 :min="settings.intensity.min"
                 :max="settings.intensity.max"
                 :step="settings.intensity.step"></el-slider>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/components/color-picker/color-picker.vue'
const config = require('@/config/config')
import { lightConfig } from '@/config/light-config'
const { hemiLight } = lightConfig
import bus from '@/libs/mitt/mitt'
export default {
  components: {
    ColorPicker
  },
  data() {
    return {
      turnOff: true,
      settings: {
        intensity: {
          min: 0,
          max: 5,
          step: 0.01
        }
      },
      intensity: hemiLight.intensity,
      initGroundColor: hemiLight.groundColor,
      initSkyColor: hemiLight.skyColor,
      skyColor: '',
      groundColor: '',
      baseUrl: config.baseUrl
    }
  },
  watch: {
    turnOff(newVal) {
      bus.emit('switchHemLight', newVal)
    },
    intensity(newVal) {
      bus.emit('setHemLight', { intensity: newVal })
    },
    skyColor(color) {
      bus.emit('setHemLight', { color })
    },
    groundColor(groundColor) {
      bus.emit('setHemLight', { groundColor })
    }
  },
  mounted() {
    bus.on('lightHemiLight', (e) => {
      console.log('lightHemiLight', e)
      this.turnOff = e.visible
      this.initSkyColor = e.skyColor
      this.initGroundColor = e.groundColor
      this.intensity = e.intensity
    })
  },
  methods: {
    changeSkyColor(color) {
      this.skyColor = color
    },
    changeGroundColor(groundColor) {
      this.groundColor = groundColor
    }
  }
}
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
  font-size: 0.12rem;
}
.color-item .label {
  white-space: nowrap;
  color: #616161;
}
.position {
  margin-top: 0.2rem;
}
.position .label {
  text-align: left;
  font-size: 0.12rem;
  color: #616161;
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
.option-item {
  display: flex;
  justify-content: space-between;
}
.option-img img {
  width: 0.32rem;
  height: 0.32rem;
}
</style>
