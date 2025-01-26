<template>
  <view class="">
    <u-tabs v-if="currentD===1" class="tabs" :list="list" :bar-width="30" :bar-height="8"
            :active-item-style='{fontSize:"30rpx",color:"#333"}' :bar-style='{backgroundColor:"#eb555b"}'
            :font-size='28' :height='60' :current="current" bg-color='#fafafa' @change="change"></u-tabs>
    <swiper :style="{height: height}" :current="current" @change="swiperChange">
      <swiper-item v-for="(tab,i) in list" :key="i">
        <mescroll-item ref="mescrollItem" :i="i" :index="current" :tabs="list" :height="height"></mescroll-item>
      </swiper-item>
    </swiper>

  </view>
</template>

<script>
import mescrollItem from './mescroll-more-item.vue'

export default {
  props: ['currentD'],
  components: {
    mescrollItem
  },
  mounted() {
    console.log(this.current);
    // 需要固定swiper的高度 (需减去悬浮tabs的高度64rpx)
    this.height = uni.getSystemInfoSync().windowHeight - uni.upx2px(182) + 'px'
    console.log(this.height);
  },
  watch: {
    current() {
      console.log(this.current);
    }
  },
  data() {
    return {
      height: 0,
      list: [{
        name: '全部'
      }, {
        name: '待使用'
      }, {
        name: '发货中',
      }, {
        name: '发货中',
      }, {
        name: '发货中',
      }, {
        name: '发货中',
      }],
      current: 0
    }
  },
  methods: {
    change(index) {
      this.current = index;
    },

    // 轮播菜单
    swiperChange(e) {
      this.current = e.detail.current
    },
    // 获取指定下标的mescroll对象
    // getMescroll(i){
    // 	let mescrollItems = this.$refs.mescrollItem;
    // 	if(mescrollItems){
    // 		let item = mescrollItems[i]
    // 		if(item) return item.mescroll
    // 	}
    // 	return null
    // }

  }
}
</script>

<style>
page {
  background-color: #FAFAFA;
}
</style>
<style lang="scss" scoped>
.tabs {
  margin: 20rpx 0;
}
</style>