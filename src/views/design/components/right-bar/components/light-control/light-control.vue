<template>
  <div>
    <div v-if="settings.needIntensity"
         class="slider-item">
      <span class="demonstration">强度</span>
      <div class="item-value">{{ intensity }}</div>
      <el-slider class="item-slider"
                 v-model="intensity"
                 :min="settings.intensity.min"
                 :max="settings.intensity.max"
                 :step="settings.intensity.step"></el-slider>
    </div>
    <div v-if="settings.needDistance"
         class="slider-item">
      <span class="demonstration">距离</span>
      <div class="item-value">{{ distance }}</div>
      <el-slider class="item-slider"
                 v-model="distance"
                 :min="settings.distance.min"
                 :max="settings.distance.max"
                 :step="settings.distance.step"></el-slider>
    </div>
    <div v-if="settings.needAngel"
         class="slider-item">
      <span class="demonstration">角度</span>
      <div class="item-value">{{ angle }}</div>
      <el-slider class="item-slider"
                 v-model="angle"
                 :min="settings.angle.min"
                 :max="settings.angle.max"
                 :step="settings.angle.step"></el-slider>
    </div>
    <div v-if="settings.needColor"
         class="color-item">
      <div class="label">颜色</div>
      <color-picker ref="colorPicker"
                    class="color-picker"
                    :init-color="lightColor"
                    @changeColor="changeLightColor"></color-picker>
    </div>
    <position-control v-show="settings.needPosition"></position-control>
  </div>
</template>
<script>
import ColorPicker from '@/components/color-picker/color-picker.vue'
import PositionControl from '@/components/position-control/position-control.vue'
const config = require('@/config/config')
import { computed, inject } from 'vue'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    settings: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    ColorPicker,
    PositionControl
  },
  data() {
    return {
      turnOff: true,
      intensity: 0,
      distance: 0,
      angle: 0,
      color: '',
      groundColor: '',
      skyColor: '',
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: 1,
      baseUrl: config.baseUrl
    }
  },
  setup() {
    const currentModuleSetting = inject('currentModuleSetting')
    const lightColor = computed({
      get: () => {
        const { settings } = currentModuleSetting
          ? currentModuleSetting.value
          : {}
        return settings.color || '#ffffff'
      }
    })
    return {
      lightColor
    }
  },
  watch: {
    turnOff(newVal) {
      this.$emit('turnOffLights', newVal)
    },
    intensity(newVal) {
      this.$emit('changeIntensity', { intensity: newVal })
    },
    distance(newVal) {
      this.$emit('changeDistance', { distance: newVal })
    },
    angle(newVal) {
      this.$emit('changeAngel', { angle: newVal })
    },
    position: {
      handler(newVal) {
        this.$emit('changePosition', { position: newVal })
      },
      deep: true
    },
    settings: {
      handler() {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let { lightSettings } = this.settings || {}
      let { intensity, distance, angle } = lightSettings || {}
      if (intensity !== undefined) {
        this.intensity = intensity
      }
      if (distance !== undefined) {
        this.distance = distance
      }
      if (angle !== undefined) {
        this.angle = angle
      }
    },
    changeLightColor(color) {
      this.$emit('changeLightColor', { color })
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
  font-size: 0.14rem;
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
  margin-top: 0.2rem;
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
