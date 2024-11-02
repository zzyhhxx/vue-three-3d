<template>
  <div v-if="moduleData.isText"
       class="text-control">
    <div class="item">
      <div class="label">语言</div>
      <div class="content">
        <div class="lang-select"
             :class="{active: currentLang === 'ch'}"
             @click="selectLang('ch')">中文</div>
        <div class="lang-select"
             :class="{active: currentLang === 'en'}"
             @click="selectLang('en')">英文</div>
      </div>
    </div>
    <div class="item">
      <div class="label">字体</div>
      <div class="content">
        <el-select v-model="font"
                   class="m-2"
                   placeholder=""
                   :popper-append-to-body="false"
                   size="small">
          <el-option v-for="item in currentFontConfg"
                     :key="item.type"
                     :label="item.name"
                     :value="item.name" />
        </el-select>
      </div>
    </div>
    <div class="item">
      <div class="label">文字</div>
      <div class="content">
        <el-input v-model="textInputValue"
                  class="w-50 m-2"
                  size="small"
                  placeholder="请输入文字"
                  clearable />
      </div>
    </div>
    <div class="item">
      <div class="label slider">厚度</div>
      <div class="item-value">{{ bevelThickness }}</div>
      <div class="content slider">
        <el-slider class="item-slider"
                   v-model="bevelThickness"
                   :min="0"
                   :max="20"
                   :step="0.1"></el-slider>
      </div>
    </div>
    <div class="item">
      <div class="label slider">圆角</div>
      <div class="item-value">{{ bevelSize }}</div>
      <div class="content slider">
        <el-slider class="item-slider"
                   v-model="bevelSize"
                   :min="0"
                   :max="1"
                   :step="0.01"></el-slider>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, ref } from 'vue'
import bus from '@/libs/mitt/mitt'
const enFontConfig = require('@/config/font-config')
const settingData = inject('currentModuleSetting')
const currentLang = ref('en')
const moduleData = computed({
  get: () => {
    const settings = settingData && settingData.value ? settingData.value : {}
    return settings
  }
})
const textInputValue = computed({
  get: () => {
    let text = ''
    if (
      moduleData.value &&
      moduleData.value.settings &&
      moduleData.value.settings.text
    ) {
      text = moduleData.value.settings.text
    }
    return text
  },
  set: (text) => {
    bus.emit('changeText', text)
  }
})

const font = computed({
  get: () => {
    let font = enFontConfig.defaultFont
    if (
      moduleData.value &&
      moduleData.value.settings &&
      moduleData.value.settings.font
    ) {
      font = moduleData.value.settings.font
    }
    return font
  },
  set: (font) => {
    bus.emit('changeFont', font)
  }
})

const bevelThickness = computed({
  get: () => {
    let thickness = 0
    if (
      moduleData.value &&
      moduleData.value.settings &&
      moduleData.value.settings.fontConfig &&
      moduleData.value.settings.fontConfig.bevelThickness !== undefined
    ) {
      thickness = moduleData.value.settings.fontConfig.bevelThickness
    }
    return thickness
  },
  set: (thickness) => {
    bus.emit('changeFontConfig', { bevelThickness: thickness })
  }
})
const bevelSize = computed({
  get: () => {
    let bevelSize = 0
    if (
      moduleData.value &&
      moduleData.value.settings &&
      moduleData.value.settings.fontConfig &&
      moduleData.value.settings.fontConfig.bevelSize !== undefined
    ) {
      bevelSize = moduleData.value.settings.fontConfig.bevelSize
    }
    return bevelSize
  },
  set: (bevelSize) => {
    bus.emit('changeFontConfig', { bevelSize })
  }
})

const selectLang = (lang) => {
  currentLang.value = lang
}
const currentFontConfg = computed({
  get: () => {
    return currentLang.value === 'en'
      ? enFontConfig.fonts.enFonts
      : enFontConfig.fonts.chFonts
  }
})
</script>
<style scoped>
.text-control {
  font-size: 0.12rem;
  color: #616161;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.1rem;
}
.label {
  width: 0.6rem;
  text-align: left;
}
.content {
  display: flex;
}
.content.slider {
  flex: 1;
}
.lang-select {
  width: 0.32rem;
  height: 0.18rem;
  border-radius: 0.05rem;
  background: #999999;
  color: #ffffff;
  line-height: 0.18rem;
  text-align: center;
  cursor: pointer;
}
.lang-select.active {
  background: #616161;
}
.lang-select:nth-child(n + 2) {
  margin-left: 0.1rem;
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
.item-slider {
  flex: 1;
}
</style>
