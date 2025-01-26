<template>
  <mescroll-uni ref="mescrollRef" :up="upOption" top="90" @down="downCallback" @init="mescrollInit" @up="upCallback">
    <view class="shipped-box">
      <view v-for='(item,index2) in goods' :key='index2' class="card-shipped">
        <u-image height="80rpx" src='https://manghe.jikechaowan.com/image/img_17.png'
                 width="80rpx"></u-image>
        <view class="card-left">
          <view class="card-top u-border-bottom">
            <view class="text">
              <view class="code">
                {{ item.over_order_id }}
              </view>
              <view class="time">
                {{ item.apply_delivery_time }}
              </view>
            </view>
            <view class="shipped-btn" @click="lookWuliu(item)">
              查看物流
            </view>
          </view>
          <view class="bottom">
            <view class="switch" @click="btnClick(index2)">
              <text>奖品明细</text>
              <u-icon :name="item.flag?'arrow-down':'arrow-up'" color="#B8B8BA" size="24rpx"></u-icon>
            </view>
            <view v-for='(item1,index) in item.order_list' v-if='item.flag' class="content">
              <u-image :src='item1.img' border-radius="16rpx" height="100rpx" width="100rpx">
              </u-image>

              <view class="content-right u-flex-1">
                <view class="name u-line-2">
                  {{ item1.reward_name }}
                </view>
                <view class="content-tip">
                  数量 x{{ item1.goods_num }}
                </view>
              </view>
            </view>
          </view>
        </view>


      </view>
    </view>
    <modal9 v-model="showDelivery" :delivery_order="delivery_order"/>
    <modal8 v-model="showAddress" :addressInfo="addressInfo"/>
  </mescroll-uni>
</template>

<script>
import modal9 from "@/components/modal9";
import modal8 from "@/components/modal8";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

export default {
  mixins: [MescrollMixin],
  components: {
    modal9,
    modal8
  },
  data() {
    return {
      upOption: {
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: '~ 暂无无数据 ~', // 提示
        }
      },
      goods: [],
      showDelivery: false,
      showAddress: false,
      delivery_order: {},
      addressInfo: {}
    };
  },
  mounted() {
    uni.$on('listChange', () => {
      this.mescroll.resetUpScroll()
    })
  },
  destroyed() {
    uni.$off('listChange')
  },
  methods: {
    upCallback(page) {
      console.log(111);
      //联网加载数据// 具体项目中,您可能取的是tab中的type,status等字段
      this.$store.dispatch('order_getOverOrderList', {
        page: page.num,
        status: 1
      }).then(res => {
        let res1 = res.data.list.map(item => {
          item.flag = false;
          return item
        })
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(res1.length);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(res1); //追加新数据
      }).catch(() => {
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
    btnClick(index) {
      this.goods[index].flag = !this.goods[index].flag
    },
    lookWuliu(item) {
      this.addressInfo = item
      let order_list = item.order_list
      let delivery_order = order_list.find((item) => {
        return item.status === 2 || item.status === 3
      })
      this.delivery_order = delivery_order
      if (!delivery_order) this.showAddress = true
      else this.showDelivery = true
    }
  },
};
</script>

<style lang="scss" scoped>
.shipped-box {
  padding-top: 26rpx;

  .card-shipped {
    background: #FFFFFF;
    border-radius: 16rpx;
    margin: 0 16rpx 26rpx;
    display: flex;
    padding: 36rpx 32rpx 0 40rpx;
  }

  .card-left {
    margin-left: 38rpx;
    flex: 1;

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 38rpx;

      .text {
        line-height: 1;
        padding: 10rpx 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .code {
          font-size: 28rpx;
          margin-bottom: 18rpx;
        }

        .time {
          font-size: 22rpx;
          color: #B8B8BA;
        }
      }

      .shipped-btn {
        width: 140rpx;
        height: 64rpx;
        background: #EEEEEE;
        border-radius: 12rpx;
        font-size: 24rpx;
        font-family: PingFangSC;
        font-weight: 500;
        color: #333333;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .bottom {
      .switch {
        display: flex;
        height: 60rpx;
        align-items: center;
        justify-content: space-between;

        > text {
          font-size: 22rpx;
          font-family: PingFangSC;
          font-weight: 400;
          color: #B8B8BA;
        }
      }

      .content {
        display: flex;
        justify-content: space-between;
        padding: 30rpx 0;
      }

      .content-right {
        margin-left: 26rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
          font-size: 24rpx;
        }

        .content-tip {
          color: #B8B8BA;
          font-size: 22rpx;
        }
      }
    }
  }
}
</style>
