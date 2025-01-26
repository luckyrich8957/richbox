<template>
  <view>
    <view class="title">
      请选择确认赠送的好友
      <view class="line">
      </view>
    </view>
    <mescroll-uni ref="mescrollRef" :up="upOption" top='94' @down="downCallback" @emptyclick="emptyClick" @init="mescrollInit"
                  @up="upCallback">
      <view class="goods-box">
        <view v-for='(item) in goods' class="card">
          <view class="card-top u-border-bottom">
            <view class="left">
              <u-image :src='item.avatar' height="80rpx" shape='circle' width="80rpx"></u-image>
              <view class="info">
                <view class="name">
                  {{ item.nickname }}
                </view>
                <view class="code">
                  ID ： {{ item.account_id }}
                </view>
              </view>
            </view>
              <view :class="{btn:true,'in-active':item.status !== 0}" @click="goGive(item)"  v-if="[0,1,2].includes(item.status)">
                {{ btnMsg(item) }}
              </view>

          </view>
          <view class="time">
            {{ item.create_time }}
          </view>
        </view>
        <view v-if='empty' class="empty">
          <u-image height="129rpx" src='https://manghe.jikechaowan.com/image/img_20.png' width="140rpx"></u-image>
          <text class="t">还没有人申请领取哦</text>
          <view class="btn" @click="showShare=true">
            分享给好友
          </view>
        </view>
      </view>
      <u-modal v-model="show" :content="content" :show-cancel-button="true" :title="title"
               @confirm="sureGive"></u-modal>
    </mescroll-uni>
    <share v-if='shareInfo' ref='share' v-model='showShare' :goodInfo="shareInfo" :page='page'/>
  </view>
</template>

<script>
import shareMixin from "@/common/shareMixin";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import {apiGoods} from "@/common/mock.js"
import share from "@/components/share"

export default {
  components: {
    share
  },

  mixins: [MescrollMixin, shareMixin], // 使用mixin
  data() {
    return {
      share: [],
      empty: false,
      showShare: false,
      upOption: {
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          use: false,
          icon: 'https://manghe.jikechaowan.com/image/img_20.png',
    tip: '', // 提示
        btnText
  :
    '去看看'
  }
  },
    goods: [], //列表数据
        order_id
  :
    '', //列表数据
        show
  :
    false,
        title
  :
    '确定赠送',
        content
  :
    '确定要赠送给该好友吗？',
        currentOrder
  :
    {
    }
  }
    ;
  },
  onLoad(P) {
    this.order_id = P.order_id
    console.log(this.share.length, 'lenght');
  },
  computed: {
    shareInfo() {
      if (this.share.length == 0) return false
      return {
        share_info: '你的好友送你' + this.share.length + '个礼物\n快去看看吧',
        img1: this.share[0].img,
      }
    },
    page() {
      if (this.order_id.length == 0) return false
      return `/pages/good/receive?order_id=${this.order_id}`
    },
    btnMsg() {
      return (item) => {
        let flag = this.goods.find((item) => {
          return item.status === 2
        })
        if (item.status === 2) return '已赠送';
        if (item.status === 3) return '已领取';
        if (item.status === 1) return '已撤销';
        if (item.status === 0 && !flag) {
          return '赠送给Ta';
        }
        return '';
      }
    }
  },
  methods: {
    goGive(item) {
      if (item.status === 0) {
        this.currentOrder = item
        this.show = true
      }
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      this.$store.dispatch('order_applyOrderList', {page: page.num, over_order_id: this.order_id}).then(res => {
        // res=[]
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(res.data.list.length);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(res.data.list); //追加新数据
        if (this.goods.length == 0) {
          this.$store.dispatch('order_giveGoodsInfo', {order_id: this.order_id}).then(({data}) => {
            this.share = data.info.order_list || []
            console.log(this.share);
          })
          this.empty = true
        }
      }).catch(() => {
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
    sureGive() {
      this.$store.dispatch('order_sureGiveGoods', {id: this.currentOrder.id}).then((res) => {
        this.$t(res.msg, () => {
          this.goods = this.goods.map((item) => {
            if (item.id === this.currentOrder.id) {
              item.status = 2;
            } else {
              item.status = 4
            }
            return item
          })
        })
      }).catch((res) => {
        this.$toast(res.msg)
      })
    }
  }
}
</script>
<style>
page {
  background-color: #fafafa;
}
</style>
<style lang="scss" scoped>
.title {

  position: relative;
  height: 94rpx;
  display: flex;
  align-items: center;
  padding-left: 32rpx;
  font-size: 28rpx;

  .line {
    position: absolute;
    width: 30rpx;
    height: 8rpx;
    background: #EB555B;
    border-radius: 4rpx;
    left: 32rpx;
    bottom: 12rpx;
  }
}

.goods-box {
  // padding-top: 26rpx;
  padding: 26rpx 16rpx 0;

  .card {
    background: #FFFFFF;
    border-radius: 16rpx;
    margin-bottom: 26rpx;

    .card-top {
      height: 144rpx;
      padding: 0 40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;

        .info {
          margin-left: 30rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .name {
            font-size: 28rpx;
            font-weight: 500;
          }

          .code {
            font-size: 22rpx;
            font-family: PingFangSC;
            font-weight: 300;
          }
        }
      }

      .btn {
        width: 140rpx;
        height: 64rpx;
        background: #323232;
        border-radius: 12rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 24rpx;
      }

      .in-active {
        background-color: #aaaaaa;
      }
    }

    .time {
      display: flex;
      padding-right: 40rpx;
      flex-direction: row-reverse;
      align-items: center;
      height: 59rpx;
      font-size: 22rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #B8B8BA;
    }
  }
}

.empty {
  margin-top: 300rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .t {
    font-size: 24rpx;
    color: #B8B8BA;
    margin-top: 24rpx;
  }

  .btn {
    width: 164rpx;
    height: 64rpx;
    background: #EB555B;
    border-radius: 12rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    color: #fff;
    margin-top: 56rpx;
  }
}
</style>
