<template>
  <div class="">
    <color-control :current-module="currentModule"></color-control>
    <material></material>
    <geometry-control></geometry-control>
    <text-control></text-control>
    <div v-show="showUploadImg"
         class="control-item">
      <div class="item-name">上传贴图</div>
      <el-popover v-model:visible="visibleUpload"
                  placement="bottom"
                  :width="300">
        <template #reference>
          <el-button class="upload-btn"
                     type="info"
                     size="small"
                     @click="visibleUpload = !visibleUpload">
            <el-icon class="el-icon--center">
              <i class="ri ri-upload-cloud-2-line ri-lg"></i>
            </el-icon>
          </el-button>
        </template>
        <div v-for="(item, index) in modules"
             :key="'imgControl' + index"
             class="load-img"
             :class="{showcanvas: currentIndex === index}">
          <el-upload v-show="!imageData[currentIndex]"
                     class="upload-pic draw-img-upload"
                     drag
                     action=""
                     :auto-upload="false"
                     :show-file-list="false"
                     :before-upload="beforeAvatarUpload">
            <el-icon class="avatar-uploader-icon">
              <i class="ri ri-upload-cloud-2-line ri-lg"></i>
            </el-icon>
          </el-upload>
          <div v-show="imageData[currentIndex]"
               id="canvas-container"
               class="canvas-container">
            <svg viewBox="0 0 1024 1024"
                 version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink"
                 width="27"
                 height="27"
                 class="icon icon-remove"
                 style=""
                 @click="clearImg">
              <path d="M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z"
                    fill="#dee5ed"></path>
            </svg>
            <canvas v-if="item.settings && item.settings.canvasWidth"
                    :id="'imgControl' + index"
                    class="imgControl"
                    :width="item.settings.canvasWidth * canvasRate"
                    :height="item.settings.canvasHeight * canvasRate"
                    :style="{width: item.settings.canvasWidth + 'px', height: item.settings.canvasHeight + 'px'}"></canvas>
          </div>
          <img-control-bar v-show="imageData[currentIndex]"
                           @rotate="onRotate"
                           @flip="onFlip"
                           @upsideDown="onUpsideDown"
                           @changeZoom="onChangeZoom"
                           @changeColor="onChangeColor"></img-control-bar>
        </div>

      </el-popover>
    </div>

    <position-control></position-control>

    <rotation-control></rotation-control>

    <scale-control></scale-control>

  </div>
</template>
<script>
import ColorControl from '@/components/color-control/color-control.vue'
import PositionControl from '@/components/position-control/position-control.vue'
import RotationControl from '@/components/rotation-control/rotation-control.vue'
import ScaleControl from '@/components/scale-control/scale-control.vue'
import ImgControlBar from './components/img-control-bar.vue'
import Material from './components/material.vue'
import geometryControl from './components/geometry-control.vue'
import textControl from './components/text-control.vue'

import { ref, toRefs, reactive, watch, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import bus from '@/libs/mitt/mitt'
import { getImageWithChange } from '@/utils/common'
const TYPES = {
  COLOR: 0,
  POSITION: 1,
  ROTATION: 2,
  SCALE: 3
}
export default {
  components: {
    ColorControl,
    PositionControl,
    RotationControl,
    ScaleControl,
    ImgControlBar,
    Material,
    geometryControl,
    textControl
  },
  props: {
    currentModule: {
      type: Object,
      default() {
        return {}
      }
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    modules: {
      type: Array,
      default() {
        return []
      }
    },
    showStyleDrawer: {
      type: Boolean,
      default: true
    },
    mappingData: {
      type: [Array, Object],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      visibleUpload: false
    }
  },
  computed: {
    showUploadImg() {
      return (
        this.currentModule &&
        this.currentModule.settings &&
        this.currentModule.settings.canvasWidth
      )
    }
  },
  watch: {
    showStyleDrawer(v) {
      if (!v) {
        this.visibleUpload = false
      }
    }
  },
  setup(props, context) {
    const currentType = ref(TYPES.COLOR)
    const typeClick = (index) => {
      currentType.value = Number(index)
    }
    const imageData = reactive({})
    const { currentIndex, modules, currentModule, mappingData } = toRefs(props)
    const canvasRate = 12
    let modulseLength = -1
    const canvasCtxs = {}
    let isHasInitMapping = false
    watch(
      modules,
      (newModule) => {
        let initFlag = false
        if (
          newModule &&
          newModule.length &&
          newModule.length !== modulseLength
        ) {
          modulseLength = newModule.length
          nextTick(() => {
            const uploadInput =
              window.document.getElementsByClassName('el-upload__input')
            if (!uploadInput) {
              return
            }
            for (let i = 0; i < uploadInput.length; i++) {
              const thisUpload = uploadInput[i]
              const parentClassName = thisUpload.parentNode.parentNode.className
              const thisClassName = thisUpload.className
              if (
                !parentClassName ||
                parentClassName.indexOf('draw-img-upload') === -1 ||
                thisClassName.indexOf('is-draw') !== -1
              ) {
                continue
              }
              thisUpload.onchange = () => {
                imageData[i] = imageHandler(thisUpload.files[0])
                let ctx = drawImageToCanvas(
                  imageData[i],
                  i,
                  newModule[i].settings.canvasWidth * canvasRate,
                  newModule[i].settings.canvasHeight * canvasRate
                )
                canvasCtxs[i] = ctx
              }
              thisUpload.className += ' is-draw'
              if (isHasInitMapping) {
                return
              }
              console.log('mappingData.value', mappingData.value)
              initFlag = true
              if (mappingData.value && Object.keys(mappingData.value).length) {
                const thisMapping = mappingData.value.find(
                  (item) => item.index == i
                )
                if (!thisMapping) {
                  continue
                }
                let ctx = drawImageToCanvas(
                  thisMapping.img,
                  i,
                  newModule[i].settings.canvasWidth * canvasRate,
                  newModule[i].settings.canvasHeight * canvasRate
                )
                canvasCtxs[i] = ctx
              }
            }
          })
        }
        isHasInitMapping = initFlag
      },
      { deep: true }
    )
    // el-upload__input
    const imageHandler = (file) => {
      var url = null
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }

    const beforeAvatarUpload = (file) => {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      // const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        ElMessage.error('只能使用jpg和png格式图片')
      }
      // if (!isLt2M) {
      //   ElMessage.error('Avatar picture size can not exceed 2MB!')
      // }
      return isImg
    }

    const drawImageToCanvas = (imgUrl, idx, cWidth, cHeight) => {
      console.log('draw options', imgUrl, idx, cWidth, cHeight)
      let canvasId = `imgControl${idx}`
      let mycanvas = document.getElementById(canvasId)

      if (!mycanvas) {
        return
      }
      const ctx = mycanvas.getContext('2d')
      let imgWidth = 0
      let imgHeight = 0
      let x = 0
      let y = 0
      let rotate = 0 // 旋转角度
      let flip = 1 // 左右翻转
      let upsideDown = 1 // 上下翻转
      let fillStyle = '#ffffff' // 背景颜色
      let sizeRatio = 1 // 图片比例
      let doDrawImg = () => {}

      const loadImage = function (loadImgUrl, isFlip = false) {
        var img = new Image()
        img.src = loadImgUrl
        img.onload = function () {
          let mouseFlag = false
          let imgInterval = ''

          if (isVertical(rotate)) {
            // 翻转操作不需要交换长宽
            if (!isFlip) {
              let imgSize = imgWidth
              imgWidth = imgHeight
              imgHeight = imgSize
            }
          } else {
            imgWidth = img.width
            imgHeight = img.height
            if (imgWidth > cWidth) {
              imgHeight = (imgHeight / imgWidth) * cWidth
              imgWidth = cWidth
            }
            if (imgHeight > cHeight) {
              imgWidth = (imgWidth / imgHeight) * cHeight
              imgHeight = cHeight
            }
          }
          bus.emit('moduleMappingImage', { img: canvasId })

          doDrawImg = function () {
            let realX = x * canvasRate
            let realY = y * canvasRate
            ctx.clearRect(0, 0, cWidth, cHeight)
            ctx.globalCompositeOperation = 'destination-over'
            ctx.drawImage(
              img,
              realX,
              realY,
              imgWidth * sizeRatio,
              imgHeight * sizeRatio
            )
            ctx.fillStyle = fillStyle
            ctx.fillRect(0, 0, cWidth, cHeight)
            currentModule.value.imgTexture.needsUpdate = true
            // bus.emit('render')
          }
          // 监听鼠标在画布上方移动事件
          mycanvas.onmousemove = function (e) {
            if (mouseFlag) {
              // e.offsetX为事件相对事件源的坐标
              x = e.offsetX - (imgWidth * sizeRatio) / canvasRate / 2
              // e.offsetY为事件相对事件源的坐标
              y = e.offsetY - (imgHeight * sizeRatio) / canvasRate / 2
            }
          }
          mycanvas.onmousedown = function () {
            mouseFlag = true
            imgInterval = setInterval(doDrawImg)
          }
          mycanvas.onmouseup = function () {
            mouseFlag = false
            clearInterval(imgInterval)
            doDrawImg()
          }
          mycanvas.onmouseleave = function () {
            mouseFlag = false
            clearInterval(imgInterval)
            doDrawImg()
          }
          doDrawImg()
        }
      }
      loadImage(imgUrl)
      // 是否是竖的方向
      const isVertical = function (r) {
        return r % 360 === 90 || r % 360 === 270
      }
      // 角度
      const onRotate = async function () {
        rotate += 90
        let imgData = await getImageWithChange(imgUrl, rotate, flip, upsideDown)
        loadImage(imgData)
      }
      // 左右翻转
      const onFlip = async function () {
        if (isVertical(rotate)) {
          upsideDown = -upsideDown
        } else {
          flip = -flip
        }
        let imgData = await getImageWithChange(imgUrl, rotate, flip, upsideDown)
        loadImage(imgData, true)
      }
      // 上下翻转
      const onUpsideDown = async function () {
        if (isVertical(rotate)) {
          flip = -flip
        } else {
          upsideDown = -upsideDown
        }
        let imgData = await getImageWithChange(imgUrl, rotate, flip, upsideDown)
        loadImage(imgData, true)
      }
      // 变更背景颜色
      const changeBgColor = function (e) {
        fillStyle = e || '#ffffff'
        doDrawImg()
      }
      // 变更图片大小
      const zoom = function (e) {
        sizeRatio = e || 1
        doDrawImg()
      }
      return { onRotate, onFlip, onUpsideDown, changeBgColor, zoom, ctx }
    }
    const clearImg = () => {
      imageData[currentIndex.value] = ''
      const ctx = canvasCtxs[currentIndex.value].ctx
      const canvasInstance = ctx.canvas
      const { width, height } = canvasInstance
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)
      currentModule.value.imgTexture.needsUpdate = true
    }
    const onRotate = (e) => {
      canvasCtxs[currentIndex.value].onRotate()
    }
    const onFlip = (e) => {
      canvasCtxs[currentIndex.value].onFlip()
    }
    const onUpsideDown = (e) => {
      canvasCtxs[currentIndex.value].onUpsideDown()
    }
    const onChangeZoom = (e) => {
      canvasCtxs[currentIndex.value].zoom(e)
    }
    const onChangeColor = (e) => {
      canvasCtxs[currentIndex.value].changeBgColor(e)
    }
    return {
      TYPES,
      currentType,
      imageData,
      typeClick,
      beforeAvatarUpload,
      clearImg,
      canvasRate,
      onRotate,
      onFlip,
      onUpsideDown,
      onChangeZoom,
      onChangeColor
    }
  }
}
</script>
<style>
.el-upload.el-upload--text,
.el-upload-dragger {
  width: 100% !important;
}
</style>
<style>
.el-slider__bar {
  background-color: #666666 !important;
}
.el-slider__button.el-tooltip__trigger.el-tooltip__trigger {
  border-color: #666666 !important;
}
</style>
<style scoped>
.box-card {
  position: relative;
  margin-top: 0.76rem;
  width: 3.2rem;
  height: 2.3rem;
  border: none;
  border-radius: 0.15rem;
  overflow: hidden;
}
.upload-pic {
  font-size: 0.4rem;
  position: relative;
}
.avatar-uploader-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.canvas-container {
  display: flex;
  justify-content: center;
  background-color: rgb(178, 178, 178);
  position: relative;
}
.canvas-container .icon-remove {
  position: absolute;
  position: absolute;
  right: 0.3rem;
  top: 0.1rem;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.imgControl {
  background-color: #ffffff;
  cursor: pointer;
}
.load-img {
  display: none;
}
.load-img.showcanvas {
  display: block;
}
.control-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.12rem;
  color: #616161;
  margin-top: 0.1rem;
}
.upload-btn {
  width: 0.72rem;
  height: 0.18rem;
}
</style>
