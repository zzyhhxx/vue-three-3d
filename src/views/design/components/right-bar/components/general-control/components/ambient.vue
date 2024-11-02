<template>
  <div>
    <div class="card-header">
      <span>环境光</span>
      <el-switch v-model="turnOff"
                 class="ml-2"
                 active-color="#000000"
                 inactive-color="#bbbec1" />
    </div>
    <div class="load-hdr">
      <el-select v-model="hdrValue"
                 class="m-2"
                 placeholder="Select"
                 size="small">
        <el-option v-for="(item, index) in envMap"
                   :key="item.name"
                   :label="item.title"
                   :value="index">
          <div class="option-item">
            <div class="option-img">
              <img :src="baseUrl + item.image"
                   alt="" />
            </div>
            <div class="option-name">
              {{ item.title }}
            </div>
          </div>
        </el-option>
      </el-select>
    </div>
    <div class="slider-item">
      <span class="demonstration">强度</span>
      <div class="item-value">{{ intensity }}</div>
      <el-slider class="item-slider"
                 v-model="intensity"
                 size="large"
                 :min="settings.intensity.min"
                 :max="settings.intensity.max"
                 :step="settings.intensity.step"></el-slider>
    </div>
    <div class="color-item">
      <div class="label">颜色</div>
      <color-picker ref="colorPicker"
                    class="color-picker"
                    :init-color="initColor"
                    @changeColor="changeLightColor"></color-picker>
    </div>
  </div>
</template>
<script>
import ColorPicker from '@/components/color-picker/color-picker.vue'
import { getEnvironmentsData } from '@/utils/data'
import { lightConfig } from '@/config/light-config'
const config = require('@/config/config')
import bus from '@/libs/mitt/mitt'
export default {
  components: {
    ColorPicker
  },
  data() {
    return {
      settings: {
        intensity: {
          min: 0,
          max: 5,
          step: 0.01
        }
      },
      turnOff: true,
      intensity: lightConfig.ambient.intensity,
      color: lightConfig.ambient.color,
      rotation: 1,
      envMap: getEnvironmentsData(),
      hdrValue: 0,
      baseUrl: config.baseUrl,
      initColor: lightConfig.ambient.color
    }
  },
  watch: {
    turnOff(newVal) {
      bus.emit('switchAmbient', newVal)
    },
    intensity(newVal) {
      bus.emit('setAmbient', { intensity: newVal })
    },
    hdrValue(newVal) {
      bus.emit('changeHdr', newVal)
    },
    color(color) {
      bus.emit('setAmbient', { color })
    }
  },
  mounted() {
    bus.on('lightAmbient', (e) => {
      console.log('lightAmbient', e)
      this.turnOff = e.visible
      this.initColor = e.color
      this.intensity = e.intensity
    })
    bus.on('lightHdrEnv', (e) => {
      console.log('lightHdrEnv', e)
      this.hdrValue = this.getEnvConfigIndex(e.name)
    })
    this.hdrValue = this.getEnvConfigIndex(lightConfig.hdrEnv.name)
  },
  methods: {
    changeLightColor(color) {
      this.color = color
    },
    getEnvConfigIndex(name) {
      let value = 0
      this.envMap.forEach((item, index) => {
        if (item.name === name) {
          value = index
        }
      })
      return value
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
