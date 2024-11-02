<template>
  <div v-if="effectData.length"
       class="header-item">
    <div class="item-list">
      <div class="list-title">模版中心</div>
      <div class="list-detail">
        <div v-for="(item, index) in effectData"
             :key="item.name"
             class="list-item"
             :class="{activeitem: index === currentIndex}"
             @click="chooseItem(index)">{{item.name}}</div>
      </div>
    </div>
    <div class="item-detail">
      <div class="detail-top">
        <div class="search">
          <input v-model="keyword"
                 type="text"
                 placeholder="请输入关键词">
        </div>
      </div>
      <div class="module-list scroll">
        <model-card class="module-card"
                    v-for="(item) in currentData"
                    :key="item.url"
                    :item-data="item"></model-card>
        <template v-if="currentData.length % 3 > 0">
          <model-card v-for="item in (3 - currentData.length % 3)"
                      :key="item"
                      class="module-card"
                      style="opacity: 0"></model-card>
        </template>

      </div>
    </div>
  </div>
</template>
<script>
import modelCard from './model-card.vue'
export default {
  components: {
    modelCard
  },
  props: {
    itemData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    // 有详情数据的列表
    effectData() {
      return this.itemData.filter((item) => item.data)
    },
    // 当前选中的数据
    currentData() {
      let data = this.effectData[this.currentIndex].data
      if (this.keyword) {
        data = data.filter(
          (item) =>
            (item.name || '').toLowerCase().indexOf(this.keyword) !== -1 ||
            (item.title || '').toLowerCase().indexOf(this.keyword) !== -1
        )
      }
      return data
    }
  },
  data() {
    return {
      currentIndex: 0,
      keyword: ''
    }
  },
  mounted() {},
  methods: {
    chooseItem(index) {
      this.currentIndex = index
    }
  }
}
</script>
<style scoped>
.header-item {
  width: 100%;
  height: 100%;
  display: flex;
  /* background: rgba(255, 255, 255, 0.1) !important;
  filter: drop- shadow(0px 20px 10px rgba(0, 0, 0, 0.5)); */
}
.detail-top {
  display: flex;
  justify-content: space-between;
  margin-top: 0.04rem;
  align-items: center;
}
.item-list {
  width: 1.4rem;
  padding-left: 0.24rem;
}
.item-detail {
  flex: 1;
}
.list-title {
  font-size: 0.16rem;
  font-weight: bold;
  color: #616161;
  margin-top: 0.1rem;
}
.list-detail {
  margin-top: 0.32rem;
  font-size: 0.12rem;
  color: #616161;
}
.list-item {
  cursor: pointer;
}
.list-item:nth-child(n + 2) {
  margin-top: 0.1rem;
}
.detail-top input {
  border: none;
  background: #e9e9e9;
  width: 2.5rem;
  height: 0.32rem;
  border-radius: 0.1rem;
  font-size: 0.12rem;
  padding-left: 0.18rem;
  color: #616161;
}
.close {
  font-size: 0.18rem;
}
.module-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-height: 5rem;
  overflow-y: scroll;
}
.module-card {
  margin-top: 0.16rem;
  margin-left: 0.2rem;
}
.module-card:nth-child(n + 4) {
  margin-top: 0.06rem;
}
.module-card:nth-child(3n + 1) {
  margin-left: 0;
}
.list-item.activeitem {
  color: #1c6ee8;
}
</style>
