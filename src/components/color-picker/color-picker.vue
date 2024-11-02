<template>
  <input class="input-color"
         type="color"
         v-model="color">
</template>
<script setup>
import { toRefs, computed } from 'vue'
const props = defineProps({
  initColor: {
    type: String,
    default: ''
  },
  extraData: {
    type: [Object, String],
    default() {
      return {}
    }
  }
})
const { initColor, extraData } = toRefs(props)
const emit = defineEmits(['changeColor'])
const color = computed({
  get: () => {
    return initColor.value
  },
  set: (newVal) => {
    let data = newVal
    if (extraData.value && Object.keys(extraData.value).length) {
      data = {
        color: newVal,
        extra: extraData.value
      }
    }
    emit('changeColor', data)
  }
})
</script>
<style scoped>
.input-color {
  width: 0.32rem;
  height: 0.18rem;
  padding: 0;
  border: 0;
  outline: 0;
  border-radius: 0.05rem;
  background-color: transparent !important;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #999999;
}
input[type='color']::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type='color']::-webkit-color-swatch {
  border: 0;
}
.input-color:focus {
  outline: none;
}
</style>
