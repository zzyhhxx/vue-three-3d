<template>
  <div class="style-control"
       :style="{height: settings.canScreenRotate ? '1rem' : '.5rem' }">
    <div class="item-control">
      <div class="color-item">
        <span>颜色：</span>
        <div v-if="settings.mesh && settings.mesh.length"
             style="display:flex;">
          <div v-for="item in settings.mesh"
               :key="item.name"
               class="color-picker-item">
            <color-picker :extra-data="item.name"
                          @changeColor="changeColor"
                          :init-color="item.color"></color-picker>
          </div>

        </div>
        <template v-else>
          <color-picker ref="colorPicker"
                        @changeColor="changeColor"
                        :init-color="settings.color || '#ffffff'"></color-picker>
        </template>

      </div>
      <div v-if="settings.canScreenRotate"
           class="rotation-item">
        <div class="item-name">屏幕角度：</div>
        <div class="item-value">{{ screenRotation }}</div>
        <el-slider class="item-slider"
                   v-model="screenRotation"
                   :min="min"
                   :max="max"
                   :step="step"></el-slider>
      </div>
    </div>
  </div>
</template>
<script setup>
import ColorPicker from '@/components/color-picker/color-picker.vue'
import { inject, computed } from 'vue'
import bus from '@/libs/mitt/mitt'
import { formatFix2 } from '@/utils/common'
const settingData = inject('currentModuleSetting')
const settings = computed({
  get: () => {
    const { settings } =
      settingData && settingData.value ? settingData.value : {}
    return settings || {}
  }
})

const changeColor = (color) => {
  bus.emit('changeColor', color)
}

const max = 1.57
const min = -0.8
const step = 0.001
const screenRotation = computed({
  get: () => {
    return formatFix2(settings.value.screenRotation || 0)
  },
  set: (rotation) => {
    bus.emit('setScreenRotation', rotation)
  }
})
</script>

<style scoped>
.style-control {
  display: flex;
  justify-content: flex-start;
  font-size: 0.2rem;
  color: #616161;
}
.item-image,
.item-image img {
  width: 1.14rem;
  height: 1.3rem;
}
.item-control {
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 0.4rem;
  line-height: 0.4rem;
  align-items: center;
}
.item-control .color-item,
.item-control .rotation-item {
  width: 100%;
}
.color-item {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.rotation-item {
  text-align: left;
  display: flex;
  align-items: center;
}
.style-control {
  font-size: 0.12rem;
}
.item-slider {
  flex: 1;
}
.item-name {
  width: 0.6rem;
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
.color-picker-item:nth-child(n + 2) {
  margin-left: 0.1rem;
}
</style>
