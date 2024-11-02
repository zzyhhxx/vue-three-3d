<template>
  <div class="ele-bar">
    <div class="content">
      <div v-for="(item, index) in modules"
           :key="index"
           class="content-item"
           :class="{active: index === currentIndex}">
        <div class="ele-img"
             @click="changeModule(index)">
          <i :class="item.icon || 'ri-earth-line'"></i>
        </div>
        <div class="ele-name"
             @click="changeModule(index)">{{ item.title || item.name }}</div>
        <div class="ele-show"
             @click="switchModule(index)">
          <i v-if="item.visible"
             class="ri ri-eye-line ri-lg"></i>
          <i v-else
             class="ri ri-eye-off-line ri-lg"></i>
        </div>
        <div class="ele-copy"
             @click="copyModule(index)">
          <i class="ri ri-file-copy-line ri-lg"></i>
        </div>
        <div class="ele-delete"
             @click="removeModule(index)">
          <i class="ri ri-close-line ri-lg"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IconPhone from '@/assets/image/icon/phone.svg'

import { ref, toRefs, watch } from 'vue'
import bus from '@/libs/mitt/mitt'

export default {
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
    }
  },
  setup(props) {
    const clay = ref(true)

    const switchModule = (index) => {
      bus.emit('switchModule', index)
    }
    const copyModule = (index) => {
      bus.emit('copyModule', index)
    }
    const removeModule = (index) => {
      bus.emit('removeModule', index)
    }

    const changeModule = (index) => {
      bus.emit('changeModule', index)
    }
    return {
      clay,
      IconPhone,
      switchModule,
      copyModule,
      removeModule,
      changeModule
    }
  }
}
</script>
<style scoped>
.ele-bar {
  font-size: 0.16rem;
  max-height: 520px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.ele-bar-card {
  border: none;
  border-radius: 0.15rem;
  overflow: hidden;
  position: relative;
  height: 2.4rem;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(187, 190, 193, 0.25882);
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 0.52rem;
  line-height: 0.52rem;
}
.top-bar .title {
  margin-left: 0.2rem;
}
.top-bar .right-option {
  margin-right: 0.2rem;
}
.right-option {
  display: flex;
  align-items: center;
}
.other-options {
  width: 0.22rem;
  height: 0.22rem;
  position: relative;
}
.other-options i {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.switch-clay {
  display: flex;
  align-items: center;
  margin-right: 0.1rem;
}
.switch-clay .text {
  margin-right: 0.1rem;
}
.content {
  width: 100%;
  cursor: pointer;
  margin-top: 0.1rem;
}
.content-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 0.32rem;
  line-height: 0.32rem;
}
.content-item .ele-img {
  font-size: 0.14rem;
}
.ele-show,
.ele-copy,
.ele-delete {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.12rem;
}
.content-item.active {
  background: #1c6ee8;
  color: #ffffff;
}
.ele-name {
  width: 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
}
::-webkit-scrollbar {
  display: none;
}
</style>
