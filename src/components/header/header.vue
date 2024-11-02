<template>
  <div class="header">
    <div class="header-left">
      <div class="logo">
        <div class="logo-img"></div>
        <div class="logo-text">vue3d</div>
        <div class="logo-option"></div>
      </div>
    </div>
    <div
         class="header-center">
      <el-popover placement="bottom"
                  :width="200"
                  trigger="hover">
        <template #reference>
          <div class="item-desc">
            <span class="button-text">几何形状</span>
            <i class="ri-arrow-down-s-line"></i>
          </div>
        </template>
        <div class="geo-center">
          <div v-for="(item, index) in geometryCenterData"
               :key="index"
               class="geo-item"
               @click="loadGeometry(index)">
            <img v-if="item.icon"
                 :src="item.icon"
                 class="geo-item-icon" />
            <div>{{ item.name }}</div>

          </div>

        </div>
      </el-popover>
      <el-popover placement="bottom"
                  :width="600"
                  trigger="hover"
                  popper-class="header-pop">
        <template #reference>
          <div class="item-desc">
            <span class="button-text">模型中心</span>
            <i class="ri-arrow-down-s-line"></i>
          </div>
        </template>
        <header-item :item-data="moduleCenterData"></header-item>
      </el-popover>
      <el-popover placement="bottom"
                  :width="236"
                  trigger="hover">
        <template #reference>
          <div class="item-desc">
            <span class="button-text">灯光</span>
            <i class="ri-arrow-down-s-line"></i>
          </div>
        </template>
        <div class="light-box">
          <div class="light-item"
               @click="addLight('point')">
            <div class="light-icon">
              <i class="ri-sun-line"></i>
            </div>
            <div class="light-text">
              点光源
            </div>
          </div>
          <div class="light-item"
               @click="addLight('direct')">
            <div class="light-icon">
              <i class="ri-sun-line"></i>
            </div>
            <div class="light-text">
              平行光
            </div>
          </div>
          <div class="light-item"
               @click="addLight('spot')">
            <div class="light-icon">
              <i class="ri-sun-line"></i>
            </div>
            <div class="light-text">
              聚光灯
            </div>
          </div>
        </div>
      </el-popover>
    </div>
    <div class="header-right">
      <div class="right-option"
           :style="{width: '2.32rem'}">
        <div
             class="full-screen"
             @click="fullScreen">
          <i v-if="showFullScreen"
             class="ri-fullscreen-exit-line"></i>
          <i v-else
             class="ri-fullscreen-line"></i>

        </div>
        <div class="avatar-download">
          <el-popover placement="bottom"
                      :width="200"
                      trigger="click">
            <template #reference>
              <div class="down-desc">
                导出
              </div>
            </template>
            <div class="geo-item"
                  @click="download(IMAGETYPE.JPG)">JPG</div>
            <div class="geo-item"
                  @click="download(IMAGETYPE.PNG)">PNG</div>
        </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modelCard from './components/model-card.vue'
import headerItem from './components/header-item.vue'

import bus from '@/libs/mitt/mitt'
import { getModulesData, getElementsData, getGeometryData } from '@/utils/data'
import { ElMessage } from 'element-plus'
import { deepClone } from '@/utils/common'
const IMAGETYPE = {
  PNG: 'image/png',
  JPG: 'image/jpeg'
}
const moduleDatas = getModulesData()
const elementDatas = getElementsData()
const geometryCenterData = getGeometryData()
export default {
  components: {
    modelCard,
    headerItem
  },
  data() {
    return {
      moduleDatas,
      elementDatas,
      showFullScreen: false,
      moduleCenterData: [
        {
          name: '全部',
          data: [
            ...elementDatas.icons,
            ...moduleDatas,
            ...elementDatas.hands,
            ...elementDatas.morflax
          ]
        },
        {
          name: '3D图标',
          data: elementDatas.icons
        },
        {
          name: '设备样机',
          data: moduleDatas
        },
        {
          name: '品牌样机'
        },
        {
          name: '几何图形'
        },
        {
          name: '手势动作',
          data: elementDatas.hands
        },
        {
          name: '立体图标',
          data: elementDatas.morflax
        },
        {
          name: '人物形象'
        }
      ],
      geometryCenterData,
      IMAGETYPE,
      projectName: '',
      templateId: ''
    }
  },
  computed: {
    realModules() {
      return this.moduleDatas.filter((item) => item.category === 'realistic')
    },
    simpleModeles() {
      return this.moduleDatas.filter((item) => item.category === 'simple')
    },
  },
  mounted() {
  },
  methods: {
    fullScreen() {
      this.showFullScreen = !this.showFullScreen
      bus.emit('showFullScreen')
    },
    addLight(type) {
      bus.emit('addLight', type)
    },
    loadGeometry(index) {
      const geo = deepClone(this.geometryCenterData[index])
      console.log('loadGeometry:', geo, this.geometryCenterData)
      bus.emit('loadModule', geo)
    },
    download(imgType) {
      bus.emit('download', imgType)
    },
    async saveProject() {
      if (!this.projectName) {
        ElMessage.error('项目名称未填写')
        return
      }

      const { coverImg, modules } = await this.$store.state.getModulesData()
      const light = this.$store.state.getLightData()
      const environment = this.$store.state.getEnvironmentData()
      const shadow = this.$store.state.getShadowData()
      const camera = this.$store.state.getCameraData()
      const mappingImg = []
      const projectData = {
        environment,
        light,
        shadow,
        camera
      }
      // 整理模型数据
      projectData.modules = modules.map((item, index) => {
        delete item.materialConfig
        if (item.settings.mappingImg) {
          mappingImg.push({
            index,
            img: document
              .getElementById(item.settings.mappingImg)
              .toDataURL('image/png', 1)
          })
        }
        return item
      })
    },
    toProfile() {
      this.$router.push('/profile.html')
    },
    toHome() {
      this.$router.push('/')
    },
  }
}
</script>
<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 0.4rem;
  background: #ffffff;
  white-space: nowrap;
  z-index: 9;
  box-shadow: 0 2px 0 0 #f5f5f5;
}
.download {
  align-self: center;
  position: absolute;
  right: 0;
  font-size: 0.18rem;
}
.download .el-icon--left {
  font-size: 0.14rem;
}
.list-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.model-card {
  margin-top: 0.05rem;
}
.header-left {
  position: relative;
  padding: 0;
  padding-left: 0.08rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.logo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.12rem;
  line-height: 0.4rem;
  color: #040404;
  width: 2.32rem;
  cursor: pointer;
}
.logo-img {
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  background: linear-gradient(141deg, #3eefa5 0%, #1a5db2 100%);
}
.logo-text {
  margin-left: 0.06rem;
  font-weight: bold;
}
.project-name {
  width: 1.6rem;
  height: 0.3rem;
  border-radius: 0.1rem;
  border: none;
  background: #e9e9e9;
  padding-left: 0.1rem;
  font-size: 0.14rem;
}
.header-center .el-sub-menu__title {
  padding: 0;
}
.project-save {
  font-size: 0.18rem;
  display: flex;
  align-items: center;
  margin-left: 0.08rem;
  cursor: pointer;
}
.project-save span {
  font-size: 0.12rem;
  margin-left: 0.04rem;
}
.header-center {
  font-size: 0.14rem;
  line-height: 0.4rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.item-desc {
  display: flex;
  cursor: pointer;
}
.item-desc:nth-child(n + 2) {
  margin-left: 0.2rem;
}
.header i {
  transition: all ease-in-out 0.3s;
}
.el-tooltip__trigger[aria-describedby] i {
  transform-origin: 50% 50%;
  transform: rotate(180deg);
}
.down-desc {
  width: 0.8rem;
  height: 0.28rem;
  background: #2a2b2c;
  border-radius: 0.1rem;
  font-size: 0.14rem;
  color: #ffffff;
  line-height: 0.28rem;
  text-align: center;
  margin-right: 0.16rem;
  cursor: pointer;
}
.header-right {
  width: 33.33%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.right-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.full-screen {
  font-size: 0.18rem;
  cursor: pointer;
}
.avatar-img {
  height: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 0.16rem;
  cursor: pointer;
}
.avatar-img img {
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 50%;
}
.avatar-download {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.light-box {
  display: flex;
  width: 100%;
  height: 0.82rem;
  justify-content: space-around;
  text-align: center;
  align-items: center;
}
.light-item {
  cursor: pointer;
}
.export-item {
  cursor: pointer;
}
.user-login,
.to-design {
  font-size: 0.14rem;
  cursor: pointer;
  margin-right: 0.1rem;
}
.geo-item {
  line-height: 0.3rem;
  cursor: pointer;
  border-radius: 0.05rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 0.05rem;
}
.geo-item img {
  margin-right: 0.1rem;
}
.geo-item:hover {
  background-color: #e9e9e9;
}
.geo-item-icon {
  width: 0.2rem;
  height: 0.2rem;
  vertical-align: middle;
}
</style>
