<template>
  <view class="">
    <view class="sort-icon">
      <myDropdown ref="dropdown" @itemClick="itemClick">
        <myDropdownItem v-model="value1" title="距离" :options="options1"></myDropdownItem>
      </myDropdown>
    </view>
    <mescroll-uni ref="mescrollRef" @init="mescrollInit" top="165" @down="downCallback" :up="upOption" @up="upCallback"
                  @emptyclick="emptyClick">
      <view class="item-content">
        <view class="item" v-for="(item,index) in goods">
          <u-image width='350rpx' border-radius='16rpx' height='350rpx'
                   src='https://cdn.uviewui.com/uview/common/logo.png'></u-image>
          <text class="u-line-2">F:NEX x| POPPRO 初音未来2022春节手办预售</text>
        </view>
      </view>
    </mescroll-uni>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import {apiGoods} from "@/common/mock.js"
import myDropdownItem from "@/components/my-dropdown-item/my-dropdown-item";
import myDropdown from "@/components/my-dropdown/u-dropdown";

export default {
  mixins: [MescrollMixin],
  components: {
    myDropdownItem,
    myDropdown
  },
  props: ['currentD'],
  watch: {
    currentD(newVal, oldVal) {
      if (newVal !== 1) {
        this.$refs.dropdown.close()
      }
    }
  },
  data() {
    return {
      value1: 1,
      options1: [{
        label: '默认排序',
        value: 1,
      },
        {
          label: '价格从高到低',
          value: 2,
        },
        {
          label: '价格从低到高',
          value: 3,
        }
      ],
      downOption: {
        auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
      },
      goods: [],
      upOption: {
        auto: false, // 不自动加载
        // page: {
        // 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
        // 	size: 10 // 每页数据的数量
        // },
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: '~ 空空如也 ~', // 提示
          btnText: '去看看'
        }
      },

    }
  },
  methods: {
    screening() {

    },
    itemClick(e) {
      if (this.$refs.dropdown.active) {
        return this.$refs.dropdown.close()
      }
      if (e === 2) {
        console.log(this.$refs.dropdown)
        this.$refs.dropdown.open(0);
      }
    },


    downCallback() {
      // 这里加载你想下拉刷新的数据, 比如刷新轮播数据
      // loadSwiper();
      // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
      this.mescroll.resetUpScroll()
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      //联网加载数据

      apiGoods().then(res => {
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(res);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(res); //追加新数据
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
    }
  }
}
</script>

<style lang="scss" scoped>
.sort-icon {
  //padding: 0 40rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon-right {
    width: 220rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.item-content {
  padding: 16rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    width: 350rpx;
    height: 473rpx;
    display: flex;
    flex-direction: column;

    text {
      flex: 1;
      margin-top: 19rpx;
      font-size: 28rpx;
      color: #333;
      font-family: PingFangSC;
    }
  }
}
</style>
