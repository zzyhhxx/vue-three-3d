<template>
  <div class="img-control-bar">
    <!-- 旋转 -->
    <div class="rotate bar-item"
         @click="rotate()">
      <i class="ri ri-clockwise-line ri-lg"></i>
    </div>
    <!-- 左右翻转 -->
    <div class="flip bar-item"
         @click="flip()">
      <i class="ri ri-merge-cells-horizontal ri-lg"></i>
    </div>
    <!-- 上下翻转 -->
    <div class="upside-down bar-item"
         @click="upsideDown()">
      <i class="ri ri-merge-cells-vertical ri-lg"></i>
    </div>
    <!-- 缩放 -->
    <div class="zoom bar-item">
      <el-popover placement="bottom"
                  :width="300"
                  trigger="click">
        <template #reference>
          <el-icon class="el-icon--center">
            <i class="ri ri-zoom-in-line ri-lg"></i>
          </el-icon>
        </template>
        <el-slider class="zoom-slider"
                   v-model="zoomVal"
                   :min="0.01"
                   :max="10"
                   :step="0.01"></el-slider>
      </el-popover>
    </div>
    <!-- 背景色 -->
    <div class="bg-color bar-item">
      <i class="ri ri-paint-brush-line ri-lg"></i>
      <div class="img-color-picker">
        <color-picker @changeColor="changeColor"></color-picker>
      </div>

    </div>
  </div>
</template>
<script>
import colorPicker from '@/components/color-picker/color-picker.vue'
export default {
  components: {
    colorPicker
  },
  data() {
    return {
      zoomVal: 1
    }
  },
  watch: {
    zoomVal(v) {
      this.$emit('changeZoom', v)
    }
  },
  methods: {
    rotate() {
      this.$emit('rotate')
    },
    flip() {
      this.$emit('flip')
    },
    upsideDown() {
      this.$emit('upsideDown')
    },
    changeColor(color) {
      this.$emit('changeColor', color)
    }
  }
}
</script>
<style scoped>
.img-control-bar {
  display: flex;
  justify-content: space-around;
}
.bar-item {
  width: 0.32rem;
  height: 0.32rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.img-color-picker {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}
</style>
