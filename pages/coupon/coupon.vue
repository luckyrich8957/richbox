<template>
  <view>
    <mescroll-body ref="mescrollRef" :up="upOption" @down="downCallback" @emptyclick="emptyClick" @init="mescrollInit"
                   @up="upCallback">
      <view v-for="(item,index) in goods" :key='index' class="coupon u-m-b-40">
        <view class="coupon-item">
          <view v-if='item.coupon_type==1' class="item-left">
            <view class="top">
              <text>{{ item.coupon_rate|price }}</text>
              折
            </view>
            <view class="label">
              满{{ item.min_price }}可用
            </view>
          </view>
          <view v-else class="item-left">
            <view class="top">
              <u-icon name='https://manghe.jikechaowan.com/image/img_11.png' size='26rpx'></u-icon>
              <text>{{ item.coupon_price }}</text>
            </view>
            <view class="label">
              满{{ item.min_price }}可用
            </view>
          </view>
          <view class="item-right">
            <view class="top u-border-bottom" @click.stop="selectCoupon(item)">
              <view class="left">
                <view class="title">
                  {{ item.coupon_name }}
                </view>
                <view v-if="item.use_type === 2" class="tag">
                  {{ item.end_date }}到期
                </view>
                <view v-if="item.use_type === 1" class="tag">
                  {{ item.start_date }} 至 {{ item.end_date }}
                </view>
              </view>
              <view class="btn">
                去使用
              </view>
            </view>
            <view class="bottom" @click='bottomClick(index)'>
              <view class="text">
                使用规则
              </view>
              <view :class="{showicon:!item.flag,icont:true}">
                <u-icon color='#B8B8BA' name='arrow-down'></u-icon>
              </view>
            </view>
          </view>
        </view>
        <view :class="{show:!item.flag}" class="coll">
          <view v-for="(text,i) in item.use_rules_arr" class="coll-item">
            {{ text }}
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import {apiGoods} from "@/common/mock.js"

export default {
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      upOption: {
        // page: {
        // 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
        // 	size: 10 // 每页数据的数量
        // },
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          icon: 'https://manghe.jikechaowan.com/image/e-coupon.png',
          top: '28%',
          tip: '',
          fixed: true, 
        }
      },
      goods: [],
      num: 0,
      pageParams: {
        blind_box_id: '',
        total_price: '',
        blind_type: 0,
        from: ''
      }
    };
  },
  onLoad(p) {
    this.num = p.num || 1
    if (p.num) this.pageParams = p
  },
  filters: {
    price(val) {
      return parseFloat(val)
    }
  },

  methods: {
    bottomClick(item) {
      this.goods[item].flag = !this.goods[item].flag
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      //联网加载数据
      this.pageParams.num = page.num
      this.$store.dispatch('my_getUserCouponList', this.pageParams).then(res => {
        let obj = JSON.parse(JSON.stringify(res.data.list))
        obj = obj.map(item => {
          item.flag = false
          return item
        })
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(res.data.list.length);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(obj);
      }).catch(() => {
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
    //点击空布局按钮的回调
    emptyClick() {
      uni.showToast({
        title: '点击了按钮,具体逻辑自行实现'
      })
    },

    // 切换菜单
    tabChange() {
      this.goods = []// 先置空列表,显示加载进度
      this.mescroll.resetUpScroll() // 再刷新列表数据
    },
    selectCoupon(item) {
      if (!this.pageParams.total_price) {
        return this.$authRoute({url: '/pages/tabbar/goods/goods'})
      }
      let coupon_type = item.coupon_type
      let price = item.coupon_price
      if (coupon_type === 1) { //
        price = this.pageParams.total_price - item.coupon_rate / 10 * this.pageParams.total_price
      }
      let pages = '/pages/good/ordinary';
      if (this.pageParams.blind_type == 1) pages = '/pages/good/wireless';
      else if (this.pageParams.blind_type == 2) pages = '/pages/good/Twistedegg';
      this.pageParams.coupon_user_id = item.id
      if (this.pageParams.from == 'one') {
        this.pageParams.id = this.pageParams.blind_goods_id
      } else {
        this.pageParams.id = this.pageParams.blind_box_id
      }
      this.pageParams.price = price
      this.pageParams.num = this.num
	  uni.$emit('coupon',this.pageParams)
	  uni.navigateBack()
  //     this.$authRoute({
  //       url: pages,
		// type:'redirect',
  //       params: this.pageParams
  //     })
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  background-color: #fafafa;
  padding: 26rpx 16rpx 0;

  /deep/ .empty-icon {
    height: 180rpx !important;
    width: 140rpx !important;
  }
}

.showicon {

  transform: rotate(180deg);
}

.icont {
  transition: .5s all;
}

.coupon-item {
  z-index: 9;
  position: relative;
  padding-top: 40rpx;
  background-color: #fff;
  border-radius: 32rpx;
  display: flex;

  .item-left {
    width: 206rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text {
      font-size: 52rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      padding-left: 5rpx;
      font-weight: 600;
      color: #0C0C0C
    }

    .label {
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #333333;
    }
  }

  .item-right {
    flex: 1;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 30rpx;
        font-weight: 550;
        color: #333333;
        margin-bottom: 15rpx;

      }

      .tag {
        margin-bottom: 12rpx;
        display: inline-block;
        font-size: 22rpx;
        color: #EB555B;
        background-color: #fef5f5;
        padding: 10rpx;
      }

      .btn {
        flex-shrink: 0;
        width: 116rpx;
        height: 52rpx;
        background: #323232;
        border-radius: 12rpx;
        line-height: 52rpx;
        text-align: center;
        margin-right: 30rpx;
        font-size: 24rpx;
        color: #FFFFFF;
        margin-left: 10rpx;
      }
    }

    .bottom {
      padding-right: 50rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;

      .text {
        font-size: 22rpx;
        font-family: PingFangSC;
        font-weight: 400;
        color: #B8B8BA;
      }
    }
  }
}

.coll {
  overflow: hidden;
  transition: all .5s;
  margin-left: 10rpx;
  bottom: 20rpx;
  width: 698rpx;
  background-color: #eeeeee;
  padding: 50rpx 20rpx 20rpx;
  margin-top: -20rpx;
  border-radius: 20rpx;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.show {
  // display: none;
  transform: translateY(-100%);
  padding: 0;
  height: 0;
}
</style>
