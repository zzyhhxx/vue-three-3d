<template>
  <div>
    <div class="model-card"
         :style="{backgroundColor: backgroundColor, backgroundImage: backgroundImage}">
      <div class="model-img">
        <img v-lazy="imgUrl" />
      </div>
      <div class="mask-bg"
           :class="{active: showBtn}"
           @mouseover="onMouseOver"
           @mouseleave="onMouseLeave">
      </div>
      <div class="mask">
        <div class="change"
             :class="{active: showBtn}"
             @mouseover="onMouseOver"
             @mouseleave="onMouseLeave"
             @click="onChange()">
          <i class="ri ri-arrow-left-right-line ri-lg"></i>
        </div>
        <div class="new-add"
             :class="{active: showBtn}"
             @mouseover="onMouseOver"
             @mouseleave="onMouseLeave"
             @click="onNewAdd()">
          <i class="ri ri-add-line ri-lg"></i>
        </div>
      </div>
    </div>
    <div class="item-name">{{ itemData.title || itemData.name }}</div>
  </div>

</template>

<script>
import bus from '@/libs/mitt/mitt'
import { deepClone } from '@/utils/common'
const config = require('@/config/config')
export default {
  props: {
    itemData: {
      type: Object,
      default() {
        return {
          style: {}
        }
      }
    }
  },
  computed: {
    backgroundColor() {
      if (this.itemData.style) {
        return this.itemData.style.backgroundColor
      } else {
        return ''
      }
    },
    backgroundImage() {
      if (this.itemData.style) {
        return this.itemData.style.backgroundImage
      } else {
        return ''
      }
    },
    imgUrl() {
      return `${config.baseUrl}${this.itemData.image}`
    }
  },
  data() {
    return {
      showBtn: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    onMouseOver() {
      this.showBtn = true
    },
    onMouseLeave() {
      this.showBtn = false
    },
    onChange() {
      bus.emit('replaceModule', deepClone(this.itemData))
    },
    onNewAdd() {
      bus.emit('loadModule', deepClone(this.itemData))
    }
  }
}
</script>

<style scoped>
.model-card {
  width: 1.09rem;
  height: 1rem;
  border-radius: 0.15rem;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  align-content: center;
  position: relative;
}
.model-img,
.model-img img {
  width: 1.09rem;
  height: 1rem;
}
.model-name {
  font-size: 0.18rem;
  padding-top: 0.1rem;
  padding-right: 0.1rem;
}
.mask-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: transparent;
  color: transparent;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 0.18rem;
  transition: all ease-in-out 0.3s;
}
.mask .change,
.mask .new-add {
  width: 0.42rem;
  height: 0.35rem;
  border-radius: 0.5rem;
  background-color: #000000;
  color: #ffffff;
  position: absolute;
  opacity: 0;
  transition: all ease-in-out 0.3s;
}
.mask .change {
  top: 50%;
  transform: translateY(-50%);
  left: 0.1rem;
}
.mask .new-add {
  top: 50%;
  transform: translateY(-50%);
  right: 0.1rem;
}
.mask .change.active,
.mask .new-add.active {
  opacity: 1;
}
.mask .change i,
.mask .new-add i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.mask-bg.active {
  background-color: #000000;
  color: #ffffff;
  opacity: 0.3;
}
.item-name {
  color: #616161;
  font-size: 0.12rem;
  line-height: 0.24rem;
}
</style>
