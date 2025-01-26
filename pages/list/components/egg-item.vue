<template>
  <!-- 不能用v-if (i: 每个tab页的专属下标;  index: 当前tab的下标; 申明在 MescrollMoreItemMixin )-->
  <view v-show="i === index">
    <!-- top="120"下拉布局往下偏移,防止被悬浮菜单遮住 -->
    <!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
    <mescroll-body :ref="'mescrollRef'+i" :down="downOption" bottom='100' :up="upOption" top="100" @down="downCallback"
                   @init="mescrollInit" @up="upCallback">
      <!-- 数据列表 -->
      <view class="goods-box">
        <view v-for="(item,index) in goods" class="box-item"
              @click="jumpUrl(item)">
          <view class="good-index">
            第
            <text>{{ item.box_num }}</text>
            箱
          </view>
          <view class="good" v-if='item.state'>
            <u-image height="206rpx" bg-color='#212024' src="https://manghe.jikechaowan.com/image/egg-3.png" width="180rpx"></u-image>
          </view>
          <view class="goods-empty" v-else>
            <u-image height="176rpx" bg-color='#212024' src="https://manghe.jikechaowan.com/image/egg-2.png" width="150rpx"></u-image>
          </view>
          <view class="tip" v-if='!item.state'>
            已售罄
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
import {apiGoods} from "@/common/mock.js"
import UImage from "../../../uview-ui/components/u-image/u-image";

export default {
  components: {UImage},
  mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
  props: {

    i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
    index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
      type: Number,
      default() {
        return 0
      }
    },
	type:[String],
    jifen_id:{
      type:[String,Number],
      default(){
        return 0
      }
    },
    uid: {
      type: [Number, String],
      default() {
        return 0
      }
    },
    tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      downOption: {
        auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
      },
      upOption: {
        textColor: '#fff',
        auto: false, // 不自动加载
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 10 // 每页数据的数量
        },
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: '~ 空空如也 ~', // 提示
        }
      },
      goods: [] //列表数据
    }
  },
  methods: {
	  jumpUrl(item) {
      if(this.jifen_id) item.jifen_id = this.jifen_id
	    const params={...item}
	    if(this.type.length>0){
	  	  params.type=this.type
	    }
	    this.$authRoute({
	      url: '/pages/good/Twistedegg',
	      params,
		  type:'redirectTo'
	    });
	  },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */

    upCallback(page) {
      // this.i: 每个tab页的专属下标
      // this.index: 当前tab的下标
      this.$store.dispatch('blind_getBlindBoxList', {id: this.uid, page: page.num, current: this.i}).then(res => {
        res = res.data.list.map(item => {
          item.state = item.reward_goods_num > item.winning_num
          return item
        })
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(res.length);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(res); //追加新数据
        if (this.goods.length === 10&&page.num==1) {
          // 防止一屏不满多加载一页
          this.mescroll.triggerUpScroll()
        }
      }).catch((err) => {
        console.log('chufa', err);
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.goods-box {
  padding: 16rpx;
  background-color: #212024;
  display: grid;
  grid-template-columns: 226rpx 226rpx 226rpx;
  grid-gap: 20rpx;

  .box-item {
    position: relative;
    background-image: url('https://manghe.jikechaowan.com/image/egg-1.png');
    background-size: 100% 100%;
    width: 226rpx;
    height: 286rpx;
    padding: 8rpx;

    .good-index {
      line-height: 1;
      margin-top: 26rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #FFFFFF;
      text-align: center;

      text {
        padding: 0 5rpx;
        font-size: 30rpx;
        font-family: PingFangSC-Regular;

      }
    }

    .goods-empty {
      width: 150rpx;
      height: 176rpx;
      margin: 20rpx auto 0;
    }

    .good {
      width: 180rpx;
      height: 206rpx;
      margin: 4rpx auto 0;
    }

    .tip {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 210rpx;
      height: 48rpx;
      background: rgba(0, 0, 0, .5);
      bottom: 8rpx;
      border-radius: 0px 0px 10px 10px;
      font-size: 22rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #B8B8BA;
      text-align: center;
      line-height: 48rpx;
    }
  }
}

</style>