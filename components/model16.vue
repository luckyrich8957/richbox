<template>
  <u-popup v-model='_show' :closeable="true" border-radius="40" mode='bottom'>
    <view class="content">
      <view class="title">
        全部奖品详情
      </view>
      <view class="scroll-view" style='flex-shrink: 0'>
        <view v-for="(item,index) in total_goods" :key="item.id" :class="{item2:true,more:total_goods.length<=5}">
          <u-image :src="item.img" height="34rpx" mode='aspectFit' width="102rpx"></u-image>
          <text>{{ item.reward_rate }}%</text>
        </view>
        <!--		  <u-icon v-for="(item,index) in list" :class="{item2:true,more:list.length<=5}" :key="index" size='120rpx' label-pos='bottom' :name='item.img' :label='item.rate+"%"'></u-icon>-->
      </view>

      <scroll-view v-if='one' :scroll-y="true" class="scroll" @scrolltolower="scrolltolower">
        <view v-for="(item) in imgsList" :key="item.id" class="scroll-item"
              @click="$emit('itemClick',item)"
        >
          <u-image :src="item.img" border-radius="12rpx" height="180rpx" width="180rpx"></u-image>
          <view class="item-r">
            <view class="item-title u-line-2">
              {{ item.reward_name }}
            </view>
            <view class="u-p-t-10">
              <u-image :src="item.reward_type_info.img" border-radius="12rpx" height="34rpx" mode='aspectFit'
                       width="102rpx"></u-image>
            </view>
            <view class="num">
              参考价
              <u-image :src="icon" class="u-m-l-15 u-m-r-10"
                       height="26rpx"
                       width="26rpx"></u-image>
              <text>{{ money(item.rececle_price) }}</text>
            </view>
          </view>
        </view>
        <u-loadmore :status="status"/>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script>
import UImage from "../uview-ui/components/u-image/u-image";

export default {
  components: {UImage},
  data() {
    return {
      status: 'loadmore',
      one: false,
      curPage: 1,
      total_page: 1,
      imgsList: [],
    };
  },
  methods: {
    async scrolltolower() {
      if (this.status != 'loadmore') return;
      this.curPage++;
      const {data} = await this.$store.dispatch('blind_selectRewardList', {
        page: this.curPage,
        id: this.uid, //商品ID
        type: this.type === 'integral' ? 3 : 1,
        page_size: 10,
      })
      if (this.curPage) {
        if (data.list.length < 10) {
          this.status = 'nomore';
        } else {
          this.status = 'loadmore'
        }
        this.imgsList = [...this.imgsList, ...data.list];
      }

    },
  },
  props: {
    total_goods: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'coins',
    },
    uid: {
      type: String,
      default: ''
    },
  },
  mounted() {
  },
  watch: {
    value() {
      if (this.value) {
        this.one = true;
      }
    },
    async one() {
      if (this.one) {
        const {data} = await this.$store.dispatch('blind_selectRewardList', {
          page: this.curPage,
          id: this.uid, //商品ID
          type: this.type === 'integral' ? 3 : 1,
          page_size: 10,
        })
        this.imgsList = data.list;
      }
    },
  },
  computed: {
    icon() {
      switch (this.type) {
        case "coins":
          return "https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/img_11.png";
        case "integral":
          return "https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/img_24.png";
        default:
          return "https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/img_11.png";
      }
    },

    _show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.content {
  height: 1000rpx;
  padding: 80rpx 56rpx 20rpx;
  display: flex;
  flex-direction: column;

  .scroll {
    flex: 1;
    height: 567rpx;

    &-item {
      display: flex;
      margin-bottom: 26rpx;

      .item-r {
        padding: 10rpx 0 10rpx 20rpx;

        .item-title {
          font-size: 28rpx;
          height: 70rpx;
          font-family: PingFangSC;
          font-weight: 300;
          color: #333333;
          line-height: 38rpx;
        }

        .item-tag {
          margin-top: 10rpx;

          padding: 20rpx;
          height: 32rpx;
          font-size: 22rpx;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          font-family: PingFangSC;
          font-weight: 400;
          color: #FFFFFF;
          background: #DDA822;
          border-radius: 4rpx;
        }

        .num {
          display: flex;
          margin-top: 10rpx;
          align-items: center;
          font-size: 22rpx;
          font-family: PingFangSC;
          font-weight: 400;
          color: #B8B8BA;

          text {
            font-size: 30rpx;
            font-family: HelveticaNeue;
            font-weight: normal;
            color: #0C0C0C;
          }
        }
      }
    }
  }

  .scroll-view {
    padding: 30rpx 0;
    width: 100%;
    border-radius: 12rpx;
    display: flex;
    margin: 40rpx 0;
    gap: 30rpx 0rpx;
    flex-wrap: wrap;
    border: 1px solid #eee;
    // padding-bottom:20rpx;
    box-shadow: 0 16rpx 16rpx rgba(10, 16, 20, 0.24), 0 0 16rpx rgba(10, 16, 20, 0.12);

    .more {
      flex: 1 !important;
    }

    .border {
      border-left: 1px solid #eee;
    }

    .item2 {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 20%;

      text {
        margin-top: 20rpx;
      }
    }

    .item {

      height: 180rpx;

      &-top {
        padding: 0 10rpx;
        height: 70rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1A184C;
        font-size: 28rpx;
        font-family: YouSheBiaoTiHei;
        font-weight: 400;
        color: #FFFFFF;
      }

      &-bottom {
        padding: 0 10rpx;
        height: 110rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        font-family: PingFangSC;
        font-weight: 400;
        color: #333333;
        background-color: #fafafa;
      }
    }
  }

  .title {
    font-size: 36rpx;
    line-height: 1;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
    text-align: center;
  }

}
</style>
