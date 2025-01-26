<template>
  <view class="pages">
    <u-subsection style="margin: 0 16rpx;" @change="sectionChange" :list="list" :bold='false' :height='76'
                  font-size='28rpx' :current="current"></u-subsection>
    <my v-show="current===1" :currentD='current'/>
    <jiaohuan v-show='current===0' :currentD='current'></jiaohuan>
  </view>
</template>

<script>
import my from './components/my.vue'
import jiaohuan from './components/jiaohuan.vue'

export default {
  components: {
    my,
    jiaohuan
  },
  methods: {
    sectionChange(index) {
      this.current = index;
    }
  },
  data() {
    return {
      list: [{
        name: '我的奖品'
      },
        {
          name: '奖品交换'
        }
      ],
      current: 0
    };
  }
}
</script>

<style lang="scss">
page {
  position: relative;
}
</style>
