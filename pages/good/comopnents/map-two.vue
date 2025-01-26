<template>
  <mescroll-uni ref="mescrollRef" @init="mescrollInit" top="248" @down="downCallback" :up="upOption" @up="upCallback">
    <view class="goods-box">
      <map-two-item v-for="(item,index) in goods" :key='index' :goods="item"/>
      <view v-if='goods.length%2!==0' style='width: 350rpx;'>
      </view>
    </view>
  </mescroll-uni>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

import mapTwoItem from './map-two-item.vue'
import {
  apiGoods
} from "@/common/mock.js"

export default {
  mixins: [MescrollMixin],
  components: {
    mapTwoItem
  },
  data() {
    return {
      num: 0,
      upOption: {
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: '~ 暂无无数据 ~', // 提示
        }
      },
      goods: [],
    };

  },
  mounted() {
  },
  methods: {
    upCallback(page) {
      //联网加载数据// 具体项目中,您可能取的是tab中的type,status等字段
      this.$store.dispatch('mapAuth_getRewardList', {page: page.num}).then(res => {
        this.mescroll.endSuccess(res.data.list.length);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(res.data.list); //追加新数据
      }).catch(() => {
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
  },

};
</script>

<style lang="scss" scoped>

.goods-box {
  padding: 0rpx 16rpx 40rpx;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>

