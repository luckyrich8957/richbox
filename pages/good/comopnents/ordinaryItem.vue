<template>
	<view :style='{height:swiperHeight}'>
		
	
  <mescroll-uni ref="'mescrollRef'"  :disable-scroll="disableScroll" :down="downOption"
                :height="swiperHeight" :up="upOption" @init="mescrollInit" @up="upCallback">
    <!-- 数据列表 -->
    <view class="goods-box" :style='{paddingBottom:bottom+"rpx" }'>
      <view v-for="(item,index) in goods" class="item" :key='index'>
        <view class="left">
          <view class="title">
            {{ item.user_info.nickname }}
          </view>
		  <view class="u-flex">
		  	<view class="tip u-line-1">
		  	  {{ item.reward_goods_info&&item.reward_goods_info.reward_name }}
		  	</view>
			<text class="num" v-if='item.box_win_num'>第{{item.box_win_num}}发</text>
		  </view>
          
        </view>
        <view class="right">
          <view class="type">
            <u-image :src='item.reward_name_info.img' width='121rpx' height='40rpx'></u-image>
          </view>
          <view class="time">
            {{ item.create_time }}
          </view>
        </view>
      </view>
    </view>

  </mescroll-uni>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
import {apiGoods} from "@/common/mock.js"

export default {
  mixins: [MescrollMixin, MescrollMoreItemMixin],
  name: "ordinaryItem",
  props: {
    swiperHeight: {
      type: [Number, String],
      default: 0
    },
    disableScroll: {
      type: Boolean,
      default: false
    },
	iscomplete:{
		type:Boolean,
		default:false,
	},
    uid: [String, Number],
    bottom: {
      type: [Number, String],
      default: 50
    }
  },
  watch: {
    swiperHeight(val) {
      console.log(val);
    }
  },
  data() {
    return {
      downOption: {
        use: false // 禁用
      },
      upOption: {
        auto: true, // 不自动加载
        noMoreSize: 100, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: '~ 空空如也 ~', // 提示
        }
      },
      goods: [] //列表数据
    }
  },
  methods: {
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      //联网加载数据
      this.$store.dispatch('blind_blindRewardRecord', {id: this.uid, page: page.num, is_scoller: 0}).then(({data}) => {
        // res.length = 9
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(data.length);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(data); //追加新数据

      }).catch((err) => {
        console.log(err);
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.btn {
  width: 699rpx;
  height: 110rpx;
  margin: 31rpx auto 0;
  //background: #D0F0FF;
  background-image: url('https://manghe.jikechaowan.com/image/img-13.png');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .btn-top {
    margin-top: 14rpx;
    font-size: 36rpx;
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 1;
  }

  .btn-bottom {
    display: flex;
    align-items: flex-end;

    .t1 {
      font-size: 33rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #FFE230;
      line-height: 1;
      margin-left: 10rpx;
      margin-right: 20rpx;
    }

    .t2 {
      font-size: 20rpx;
      line-height: 1;
      font-family: PingFangSC;
      font-weight: 400;
      text-decoration: line-through;
      color: #FFFFFF;
      opacity: 0.6;
    }
  }
}
.num{
	padding-left: 15rpx;
	color: #FFE230;
}
.goods-box {
  padding: 24rpx;

  .item {
    background-image: url('https://manghe.jikechaowan.com/image/img-19.png');
    background-size: 100% 100%;
    width: 699rpx;
    height: 130rpx;
    margin-bottom: 11rpx;
    display: flex;
    padding: 29rpx 36rpx;
    justify-content: space-between;

    .left {
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .title {
        font-size: 25rpx;
        font-family: PingFangSC;
        font-weight: 400;
        color: #FFFFFF;
      }

      .tip {
        font-size: 22rpx;
        font-family: PingFangSC;
        font-weight: 300;
        color: #B8B8BA;
		width: 320rpx;
      }
    }

    .right {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-end;

      .type {
        font-size: 32rpx;
        font-family: YouSheBiaoTiHei;
        font-weight: 400;
        color: #FFE230;
      }

      .time {
        font-size: 16rpx;
        font-family: PingFangSC;
        font-weight: 300;
        color: #fff;
      }
    }
  }
}
</style>