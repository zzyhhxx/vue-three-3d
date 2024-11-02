<template>
  <!-- three 画布 -->
  <div ref="threeDom"
       id="threeContainer"
       v-loading="loading"
       element-loading-text="模型加载中..."
       @mousedown="selectMouseDown"
       @mouseup="selectMouseUp"
       @click="clickSelectModule"
       @mousemove="threeDomMouseMove">
  </div>

  <div>
    <!-- 左侧工具栏 -->
    <side-bar :modules="state.modulesSetting"
              :current-index="currentIndex"
              :current-module="currentModuleSetting"
              :show-full-screen="showFullScreen"></side-bar>
    <!-- 底部工具栏 -->
    <bottom-bar></bottom-bar>
    <!-- 右侧工具栏 -->
    <right-bar :modules="state.modulesSetting"
               :current-index="currentIndex"
               :current-module="currentModuleSetting"
               :show-full-screen="showFullScreen"
               :mapping-data="state.mappingData"></right-bar>
  </div>
</template>
<script>
import SideBar from './components/side-bar/side-bar.vue'
import BottomBar from './components/bottom-bar/bottom-bar.vue'
import RightBar from './components/right-bar/right-bar.vue'

import { initScene } from './hooks/core'
import { moduleControl } from './hooks/controls/module'
import { cameraControl } from './hooks/controls/camera'
import { environmentControl } from './hooks/controls/environment'
import { shadowControl } from './hooks/controls/shadow'

import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { deepClone } from '@/utils/common'
import bus from '@/libs/mitt/mitt'

export default {
  components: {
    SideBar,
    BottomBar,
    RightBar
  },
  setup() {
    const store = useStore()

    const CoreData = initScene()
    const ModuleControler = moduleControl(CoreData)
    const CameraControler = cameraControl(CoreData)
    const EnvironmentControler = environmentControl(CoreData)
    const ShadowControler = shadowControl(CoreData)

    const init = async (
      settingData = {},
      mappingData = [],
      name = '',
      templateId = ''
    ) => {
      const envSettings = deepClone(settingData)
      const modSettings = deepClone(settingData)
      const camSettings = deepClone(settingData)
      const shaSettings = deepClone(settingData)
      EnvironmentControler.init(envSettings)
      ModuleControler.init(modSettings, mappingData)
      CameraControler.init(camSettings)
      ShadowControler.init(shaSettings)
    }
    bus.on('initDesignPage', init)
    onMounted(async () => {
      init()
    })
    return {
      threeDom: CoreData.threeDom,
      ...ModuleControler,
      ...CameraControler,
      ...EnvironmentControler,
      ...ShadowControler
    }
  }
}
</script>
<style scoped>
</style>
