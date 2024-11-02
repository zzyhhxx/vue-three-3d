<template>
  <div class="right-bar"
       :class="{showfullscreen: showFullScreen}">
    <div class="bar-content">
      <general-control></general-control>
    </div>
    <div class="module-zoom">
      <!-- 放大 -->
      <el-button class="button-add"
                 type="default"
                 circle
                 @click="enlargeModule">
        <el-icon class="el-icon--center">
          <i class="ri ri-add-line ri-lg"></i>
        </el-icon>
      </el-button>
      <!-- 缩小 -->
      <el-button class="button-subtract"
                 type="default"
                 circle
                 @click="reduceModule">
        <el-icon class="el-icon--center">
          <i class="ri ri-subtract-line ri-lg"></i>
        </el-icon>
      </el-button>
    </div>

  </div>
  <div class="right-bar style-drawer"
       :class="{show: showStyleDrawer && !showFullScreen}">
    <div class="bar-content">
      <div class="style-drawer-top">
        <div class="title">{{ barTitle }}</div>
        <div class="style-drawer-close"
             @click="closeStyleDrawer">
          <i class="ri-close-line"></i>
        </div>
      </div>

      <light-control v-show="isLight"
                     :title="barTitle"
                     :settings="lightSetting"
                     @changeIntensity="changeLightSetting"
                     @changeDistance="changeLightSetting"
                     @changeLightColor="changeLightSetting"
                     @changePosition="changeLightSetting"
                     @changeAngel="changeLightSetting"></light-control>
      <style-control v-show="!isLight"
                     :modules="modules"
                     :current-index="currentIndex"
                     :current-module="currentModule"
                     :show-style-drawer="showStyleDrawer"
                     :mapping-data="mappingData"></style-control>
    </div>
  </div>
</template>
<style>
.control-card.turnoff .el-card__body {
  display: none;
}
</style>
<script>
import StyleControl from './components/style-control/style-control.vue'
import LightControl from './components/light-control/light-control.vue'
import GeneralControl from './components/general-control/general-control.vue'
import bus from '@/libs/mitt/mitt'
export default {
  components: {
    StyleControl,
    LightControl,
    GeneralControl
  },
  data() {
    return {
      showStyleDrawer: false,
      dialogFormVisible: false,
      isCanSubmit: false,
      feedback: ''
    }
  },
  props: {
    modules: {
      type: Array,
      default() {
        return []
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    currentModule: {
      type: Object,
      default() {
        return {}
      }
    },
    showFullScreen: {
      type: Boolean,
      default: false
    },
    mappingData: {
      type: [Array, Object],
      default() {
        return []
      }
    }
  },
  watch: {
    currentIndex(index) {
      if (index > -1) {
        this.showStyleDrawer = true
      }
    },
    feedback(val) {
      this.isCanSubmit = !!val
    }
  },
  computed: {
    barTitle() {
      let { title = '', name = '' } = this.modules[this.currentIndex] || {}
      return title || name
    },
    isLight() {
      let { isLight = false } = this.modules[this.currentIndex] || {}
      return isLight
    },
    lightSetting() {
      let {
        lightType,
        settings: lightSettings,
        isLight
      } = this.modules[this.currentIndex] || {}
      if (!lightSettings || !isLight) {
        return {}
      }
      let pointSettings = {
        needIntensity: true, // 强度
        intensity: {
          min: 0,
          max: 20,
          step: 1,
          default: 1
        },
        needDistance: true,
        distance: {
          min: 0,
          max: 1000,
          step: 10,
          default: 500
        },
        needColor: true, // 颜色
        needPosition: true, // 光源位置
        position: {
          x: {
            min: -500,
            max: 500,
            step: 1
          },
          y: {
            min: -500,
            max: 500,
            step: 1
          },
          z: {
            min: -500,
            max: 500,
            step: 1
          }
        }
      }
      let directSetings = {
        needIntensity: true, // 强度
        intensity: {
          min: 0,
          max: 5,
          step: 0.01,
          default: 0.5
        },
        needColor: true, // 颜色
        needPosition: true, // 光源位置
        position: {
          x: {
            min: -500,
            max: 500,
            step: 1
          },
          y: {
            min: -500,
            max: 500,
            step: 1
          },
          z: {
            min: -500,
            max: 500,
            step: 1
          }
        }
      }
      let spotSettings = {
        needIntensity: true, // 强度
        intensity: {
          min: 0,
          max: 5,
          step: 0.01,
          default: 0.5
        },
        needDistance: true,
        distance: {
          min: 0,
          max: 500,
          step: 1,
          default: 500
        },
        needAngel: true,
        angle: {
          min: 0,
          max: 100,
          step: 0.01,
          default: 24
        },
        needColor: true, // 颜色
        needPosition: true, // 光源位置
        position: {
          x: {
            min: -500,
            max: 500,
            step: 1
          },
          y: {
            min: -500,
            max: 500,
            step: 1
          },
          z: {
            min: -500,
            max: 500,
            step: 1
          }
        }
      }
      let settings = {}
      switch (lightType) {
        case 'point':
          settings = pointSettings
          break
        case 'direct':
          settings = directSetings
          break
        case 'spot':
          settings = spotSettings
          break
      }
      return { ...settings, lightSettings }
    }
  },
  mounted() {
    bus.on('showStyleDrawer', () => {
      this.showStyleDrawer = true
    })
    bus.on('closeStyleDrawer', () => {
      this.showStyleDrawer = false
    })
  },
  methods: {
    closeStyleDrawer() {
      this.showStyleDrawer = false
    },
    // 放大
    enlargeModule() {
      bus.emit('enlargeModule')
    },
    // 缩小
    reduceModule() {
      bus.emit('reduceModule')
    },
    changeLightSetting(e) {
      bus.emit('changeLightSetting', e)
    },
    showFeedBack() {
      this.dialogFormVisible = true
    },
  }
}
</script>
<style>
.load-hdr .el-select {
  width: 100%;
}
.load-hdr .el-input__inner {
  background: #e0e0e0;
}
</style>
<style scoped>
.right-bar {
  position: fixed;
  right: 0;
  top: 0.4rem;
  width: 2.32rem;
  height: calc(100% - 0.4rem);
  background-color: #f1f3f3;
  transition: all ease-in-out 0.3s;
  /* box-shadow: 0 2px 0 0 #f5f5f5; */
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  z-index: 1;
  padding: 0 0.08rem;
}
.bar-content {
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  color: transparent !important;
}
.right-bar.style-drawer {
  z-index: 2;
  transform: translateX(100%);
}
.right-bar.style-drawer.show {
  transform: translateX(0);
}
.bar-bottom {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.button-sun {
  margin-top: 1rem;
}
.button-add {
  margin-bottom: 0.1rem;
}
.button-subtract {
  margin-bottom: 0.2rem;
}
.button-question {
  margin-bottom: 0.4rem;
}
.button-add,
.button-subtract {
  margin-left: 0 !important;
}
.drawer-title {
  font-size: 0.18rem;
  text-align: left;
}
.control-card:nth-child(n + 2) {
  margin-top: 0.2rem;
}
.showfullscreen {
  transform: translateX(100%);
}
.style-drawer-close {
  font-size: 0.16rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.08rem;
}
.title {
  font-size: 0.14rem;
  color: #616161;
  text-align: left;
}
.style-drawer-top {
  height: 0.36rem;
  line-height: 0.36rem;
  position: relative;
}
.module-zoom,
.feed-back {
  position: absolute;
  left: 0;
  bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transform: translateX(-150%);
}
.feed-back {
  bottom: auto;
  top: 0.6rem;
}
.feedback-dialog .title {
  font-size: 0.24rem;
  text-align: center;
  margin-top: 0.1rem;
  margin-bottom: 0.3rem;
}
</style>
