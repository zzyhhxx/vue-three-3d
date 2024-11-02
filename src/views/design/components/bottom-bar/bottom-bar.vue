<template>
  <div class="bottom-bar">
    <div
      class="left-item"
      :class="{ active: cameraType === 'ort' }"
      @click="changeCamera('ort')"
    >
      正交
    </div>
    <div class="center-control">
      <div class="reset" @click="changeCameraDirect('front')">重置</div>
      <div
        class="top"
        :class="{ active: cameraDirect === 'top' }"
        @click="changeCameraDirect('top')"
      >
        顶
      </div>
      <div
        class="left"
        :class="{ active: cameraDirect === 'left' }"
        @click="changeCameraDirect('left')"
      >
        左
      </div>
      <div
        class="right"
        :class="{ active: cameraDirect === 'right' }"
        @click="changeCameraDirect('right')"
      >
        右
      </div>
      <div
        class="bottom"
        :class="{ active: cameraDirect === 'front' }"
        @click="changeCameraDirect('front')"
      >
        前
      </div>
    </div>
    <div
      class="right-item"
      :class="{ active: cameraType === 'per' }"
      @click="changeCamera('per')"
    >
      透视
    </div>
    <el-button-group class="ml-4">
      <el-button type="default" round @click="changeModel(MODEL.TRANSLATE)">
        <el-icon class="el-icon--left">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="定位模式"
            placement="top"
          >
            <i class="ri ri-drag-move-2-fill ri-lg"></i>
          </el-tooltip>
        </el-icon>
      </el-button>
      <el-button type="default" round @click="changeModel(MODEL.ROTATE)">
        <el-icon class="el-icon--left">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="旋转模式"
            placement="top"
          >
            <i class="ri ri-refresh-line ri-lg"></i>
          </el-tooltip>
        </el-icon>
      </el-button>
      <el-button type="default" round @click="changeModel(MODEL.SCALE)">
        <el-icon class="el-icon--left">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="缩放模式"
            placement="top"
          >
            <i class="ri ri-crop-line ri-lg"></i>
          </el-tooltip>
        </el-icon>
      </el-button>
    </el-button-group>
  </div>
</template>
<script setup>
import bus from '@/libs/mitt/mitt'
import { ref, inject, computed } from 'vue'
const cameraSettingsData = inject('cameraSettings')
const cameraSettings = computed({
  get: () => {
    return cameraSettingsData.value
  }
})
// 相机方向
const cameraDirect = computed({
  get: () => {
    return cameraSettings.value.direct
  },
  set: (direct) => {
    bus.emit('changeCameraDirect', direct)
  }
})
const changeCameraDirect = (direct) => {
  cameraDirect.value = direct
}
// 相机类型
const cameraType = computed({
  get: () => {
    return cameraSettings.value.type
  },
  set: (type) => {
    bus.emit('changeCamera', type)
  }
})
const changeCamera = (type) => {
  cameraType.value = type
}
const MODEL = {
  SCALE: 'scale',
  ROTATE: 'rotate',
  TRANSLATE: 'translate'
}
const changeModel = (model) => {
  bus.emit('changeModel', model)
}
</script>
<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 0.2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.left-item,
.right-item {
  width: 0.54rem;
  height: 0.36rem;
  background: #8a8a8a;
  border-radius: 0.15rem;
  font-size: 0.12rem;
  color: #ffffff;
  line-height: 0.36rem;
  text-align: center;
  cursor: pointer;
}
.center-control {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: #d4d4d4;
  margin: 0 0.2rem;
  font-size: 0.12rem;
  position: relative;
}
.center-control .reset {
  position: absolute;
  width: 0.32rem;
  height: 0.32rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #f1f3f3;
  border-radius: 50%;
  line-height: 0.32rem;
  text-align: center;
  cursor: pointer;
}
.top,
.left,
.right,
.bottom {
  position: absolute;
  width: 0.16rem;
  height: 0.16rem;
  background: #8a8a8a;
  border-radius: 50%;
  line-height: 0.16rem;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
}
.top,
.bottom {
  left: 50%;
  transform: translateX(-50%);
}
.top {
  top: 0.04rem;
}
.bottom {
  bottom: 0.04rem;
}
.left,
.right {
  top: 50%;
  transform: translateY(-50%);
}
.left {
  left: 0.04rem;
}
.right {
  right: 0.04rem;
}
.active {
  background: #2a2b2c;
}
.ml-4 {
  margin-left: 0.12rem;
}
</style>
