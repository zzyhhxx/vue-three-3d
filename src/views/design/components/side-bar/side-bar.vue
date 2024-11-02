<template>
  <div class="side-bar" :class="{ showfullscreen: showFullScreen }">
    <div class="side-bar-label">图层</div>
    <ele-control :modules="modules" :current-index="currentIndex"></ele-control>
  </div>
</template>
<script>
import EleControl from './components/element-control/element-control.vue'
export default {
  components: {
    EleControl
  },
  data() {
    return {
      drawer: true
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
    }
  }
}
</script>
<style scoped>
.side-bar {
  position: fixed;
  left: 0;
  top: 0.4rem;
  width: 2.32rem;
  height: calc(100% - 0.4rem);
  background-color: #f1f3f3;
  transition: all ease-in-out 0.3s;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  /* box-shadow: 0 2px 0 0 #f5f5f5; */
}
.side-bar-label {
  font-size: 0.14rem;
  color: #616161;
  text-align: left;
  margin-top: 0.1rem;
  padding-left: 0.08rem;
}
.join-vip {
  font-size: 0.12rem;
  color: #616161;
  position: absolute;
  bottom: 0.34rem;
  left: 50%;
  transform: translateX(-50%);
}
.showfullscreen {
  transform: translateX(-100%);
}
</style>
