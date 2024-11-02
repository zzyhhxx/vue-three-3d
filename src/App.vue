<template>
  <top-header></top-header>
  <router-view />
</template>
<script setup>
import TopHeader from './components/header/header.vue';
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}
a {
  text-decoration: none;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
input:focus {
  outline: none;
}
.scroll {
  -webkit-overflow-scrolling: touch;
}
/* ::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  color: transparent !important;
} */
::-webkit-scrollbar {
  width: 7px;
}
::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
::-webkit-scrollbar-button {
  background-color: #eee;
  display: none;
}
::-webkit-scrollbar-corner {
  background-color: black;
}
.el-popper {
  border-radius: 0.15rem !important;
}
.el-slider {
  --el-slider-button-size: 0.16rem !important;
}
.el-dialog {
  border-radius: 0.1rem !important;
}
.el-dialog__body img[alt='Preview Image'] {
  max-width: 100%;
}
</style>
