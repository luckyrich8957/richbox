<template>
  <view>
    <u-popup v-model='_show' :closeable="true" border-radius="40" mode='bottom'>
      <view class="content">
        <view class="title">确认支付</view>
        <view class="good-box">
          <u-image :src='blindInfo.img1' border-radius='16rpx' height='140rpx' width='140rpx'></u-image>
          <view class="good-right">
            <view class="name u-line-1">
              {{ blindInfo.blind_name }}
            </view>
            <view class="num">
              数量 x {{ blindInfo.num|| num }}
            </view>
            <view class="price">
              <view class="price-left">
                <u-icon v-if='type=="coins"' name="https://manghe.jikechaowan.com/image/img_11.png" size="26rpx"></u-icon>
				<u-icon v-else name="https://manghe.jikechaowan.com/image/img_24.png" size="26rpx"></u-icon>
                <text class="t1">{{ parseFloat(blindInfo.price * (blindInfo.num || num)) }}</text>
                <text class="t2">{{ parseFloat(blindInfo.market_price * (blindInfo.num || num)) }}</text>
              </view>
              <view v-if="blindInfo.give_integral" class="price-right">
                可得{{ parseFloat(blindInfo.price * (blindInfo.num || num)) }}积分
              </view>
            </view>
            <view class="tip">
              盲盒产品购买后不支持退换
            </view>
          </view>
        </view>
        <view class="preferential u-border-bottom u-border-top">
          <view v-if='type=="coins"' class="left">
            优惠券
          </view>
          <view v-if='type=="coins"' class="right" @click="$authRoute({url:'/pages/coupon/coupon',params:{
		        blind_box_id:blindInfo.crrent_box_num,
		        blind_type:blindInfo.blind_type,
		        blind_goods_id:blindInfo.id,
		        num:blindInfo.num||num,
				      from:from,
		        total_price:parseFloat(blindInfo.price * (blindInfo.num || num)),
						}})">
            <text class="u-p-r-15">已优惠</text>
            <u-icon name="https://manghe.jikechaowan.com/image/img_11.png" size="26rpx"></u-icon>
            <text class="t1">{{ parseFloat(coupon_price) }}</text>
            <u-icon color='#bbb' name="arrow-right" size="24rpx"></u-icon>
          </view>

        </view>
        <view class="bottom">
          <u-checkbox v-model="flag" class="checkbox" shape="circle" size='40rpx'></u-checkbox>
          <text @click="flag=!flag">我已满18周岁，已阅读并同意</text>
          <text style='color: #448EF6;' @click="showModel=true;_show=false">《极客潮玩盲盒须知》</text>
        </view>
		<scroll-view scroll-y="true" class="xieyi">
			<u-parse :html="xieyi"></u-parse>
		</scroll-view>
        <view class="btn" @click="submit">
          <u-icon name="https://manghe.jikechaowan.com/image/index/img.png" size="32rpx"></u-icon>
          <text class='t1'>{{ parseFloat(blindInfo.price * (blindInfo.num || num) - parseFloat(coupon_price)) }}</text>
          <text class='t2'>立即购买</text>
        </view>
      </view>
    </u-popup>
    <modal14 v-model="showModel" uid="2" @xieyi='(e)=>xieyi=e' @submit="submit1"/>
  </view>

</template>

<script>
import modal14 from './modal14.vue'

export default {
  data() {
	const flag =this.$cache('flag')?this.$cache('flag').flag:false
    return {
      flag: flag,
      showModel: false,
	  xieyi:'',
    };
  },
  components: {
    modal14
  },
  props: {
    value: {
      type: Boolean,
      default() {
        return false
      }
    },
    from: {
      type: String,
      default: '',
    },
    blindInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    type: [String],
    num: [Number, String],
    coupon_price: {
      type: [String, Number],
      default() {
        return 0
      }
    },
  },
  methods: {
    submit() {
      if (!this.flag) {
        return this.$u.toast('请先阅读并勾选服务协议')
      }
      this.$emit('submit')
    },
    submit1(e) {
      this.flag = e;
      this._show = true
    }
  },
  watch:{
	 flag(val){
		 console.log(val,'flag----');
		 this.$cache('flag',{flag:val})
	 }, 
  },
  computed: {
    _show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
	.xieyi{
		margin: 20rpx 0;
		height: 360rpx;
	}
.content {
  padding-top: 100rpx;
  height: 1166rpx;
  padding: 0 56rpx;
  padding-top: 80rpx;

  /deep/ .u-checkbox__label {
    margin-right: 0;
  }

  .btn {
    height: 90rpx;
    background: #323232;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 75rpx;

    .t1 {
      line-height: 1;
      font-size: 34rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #FFFFFF;
      margin: 0 10rpx 0 5rpx;
    }

    .t2 {
      line-height: 1;
      font-size: 30rpx;
      font-family: PingFangSC;
      font-weight: 500;
      color: #FFFFFF;
      margin-top: -5rpx;

    }
  }

  .bottom {
    margin-top: 33rpx;
    font-size: 22rpx;
    font-family: PingFangSC;
    font-weight: 300;
    color: #333333;
  }

  .title {
    font-size: 36rpx;
    line-height: 1;
    margin-bottom: 56rpx;
    font-family: PingFangSC;
    font-weight: 600;
    color: #333333;
  }

  .preferential {
    margin-top: 48rpx;
    height: 110rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      font-size: 26rpx;
      font-family: PingFangSC;
      font-weight: 500;
      color: #333333;
    }

    .right {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #B8B8BA;

      .t1 {
        font-size: 30rpx;
        font-family: HelveticaNeue;
        font-weight: normal;
        color: #0C0C0C;
        padding: 0 10rpx;
      }
    }
  }

  .good-box {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .good-right {
      width: 470rpx;

      .name {
        font-size: 28rpx;
        font-family: PingFangSC;
        font-weight: 300;
        color: #333333;
        line-height: 1;
        margin-bottom: 15rpx;
      }

      .num {
        font-size: 22rpx;
        font-family: PingFangSC;
        font-weight: 300;
        color: #B8B8BA;
        line-height: 1;
        margin-bottom: 20rpx;
      }

      .price {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price-left {
          .t1 {
            font-size: 30rpx;
            font-family: HelveticaNeue;
            font-weight: bold;
            color: #0C0C0C;
            padding: 0 15rpx 0 10rpx;
          }

          .t2 {
            font-size: 24rpx;
            font-family: PingFangSC;
            font-weight: 400;
            text-decoration: line-through;
            color: #B8B8BA;
          }
        }

        .price-right {
          font-size: 24rpx;
          font-family: PingFangSC;
          font-weight: 400;
          color: #DFAD4B
        }
      }

      .tip {
        width: 298rpx;
        text-align: center;
        height: 32rpx;
        background: #F4F4F4;
        border-radius: 4rpx;
        margin-top: 25rpx;
        font-size: 20rpx;
        font-family: PingFangSC;
		
        font-weight: 400;
        color: #B8B8BA;
        line-height: 32rpx;
      }
    }
  }
}
</style>
