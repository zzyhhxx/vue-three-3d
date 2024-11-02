<template>
  <div class="slider-control">
    <div class="item-top">
      <div class="top-title">缩放</div>
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
      <span class="demonstration">scale</span>
      <div class="item-value">{{ filter(scale) }}</div>
      <el-slider class="item-slider"
                 v-model="scale"
                 :min="min"
                 :max="max"
                 :step="step"></el-slider>
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from 'vue'
import bus from '@/libs/mitt/mitt'
import { filters } from '@/hooks/filter'
const filter = filters().formatFix2
const min = 0
const max = 10
const step = 0.01
const settingData = inject('currentModuleSetting')
const scale = computed({
  get: () => {
    const { settings } =
      settingData && settingData.value ? settingData.value : {}
    let scale = settings && settings.scale ? settings.scale : 1
    if (Object.keys(scale).length) {
      scale = scale.x
    }
    return scale
  },
  set: (scale) => {
    bus.emit('setScale', { scale: scale })
  }
})
const reset = () => {
  bus.emit('setScale', { scale: 1 })
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
