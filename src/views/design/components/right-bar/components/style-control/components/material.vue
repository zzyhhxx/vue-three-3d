<template>
  <div class="material">
    <div class="label">材质：</div>
    <div class="item-list">
      <div v-for="(item, index) in materialConfig"
           :key="item.type"
           class="item"
           @click="onClick(index)">
        <el-tooltip effect="dark"
                    :content="item.name"
                    placement="top">
          <img class="item-img"
               :class="{active: currentIndex === index}"
               :src="item.icon" />
        </el-tooltip>
      </div>
    </div>

  </div>
</template>
<script setup>
import bus from '@/libs/mitt/mitt'
import { computed, inject } from 'vue'
const materialConfig = [
  {
    name: '基础',
    type: 'basic',
    icon: require('@/assets/image/common/basic.jpeg')
  },
  {
    name: '金属',
    type: 'metalic',
    icon: require('@/assets/image/common/metalic.jpeg')
  },
  {
    name: '粘土',
    type: 'clay',
    icon: require('@/assets/image/common/clay.jpeg')
  },
  {
    name: '玻璃',
    type: 'glass',
    icon: require('@/assets/image/common/glass.jpeg')
  }
]
const settingData = inject('currentModuleSetting')
const currentIndex = computed({
  get: () => {
    const { settings } =
      settingData && settingData.value ? settingData.value : {}
    let currentIndex = 0
    if (settings && settings.materialType) {
      materialConfig.forEach((item, index) => {
        if (item.type === settings.materialType) {
          currentIndex = index
        }
      })
    }
    return currentIndex
  }
})
const onClick = (index) => {
  bus.emit('changeMaterial', materialConfig[index].type)
}
</script>
<style scoped>
.material {
  display: flex;
  font-size: 0.22rem;
  justify-content: space-between;
  align-items: center;
}
.label {
  font-size: 0.12rem;
  color: #616161;
}
.item-list .item {
  cursor: pointer;
}
.item-list {
  display: flex;
  align-items: center;
}
.item:nth-child(n + 2) {
  margin-left: 0.05rem;
}
.item-img {
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  vertical-align: middle;
  border: 1px solid transparent;
}
.item-img.active {
  border: 1px solid #000000;
}
.item-img:hover {
  border: 1px solid #000000;
}
</style>
