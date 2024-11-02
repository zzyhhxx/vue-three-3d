import { computed } from 'vue'
export function filters() {
  // 保留两位小数
  const formatFix2 = computed(() => {
    return function(index){
      return parseFloat(index).toFixed(2);
    }
  })
  return {
    formatFix2
  }
}
