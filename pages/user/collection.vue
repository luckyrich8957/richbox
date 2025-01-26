<template>
  <mescroll-body
      ref="mescrollRef"
      :up="upOption"
      @down="downCallback"
      @emptyclick="emptyClick"
      @init="mescrollInit"
      @up="upCallback"
  >
    <view>
      <view v-for="(item, index) in goods" class="card" @click="jumpInfo(item)">
        <u-image
            :src="item.blindGoodsInfo.img1"
            border-radius="24rpx"
            height="140rpx"
            width="140rpx"
        ></u-image>
        <view class="content">
          <view class="top">
            {{ item.blindGoodsInfo.blind_name }}
          </view>
          <view class="bottom">
            <view class="left">
              <view class="num">
                <u-icon
                    :name="
                    item.jump_info.type === 'integral'
                      ? 'https://manghe.jikechaowan.com/image/img_24.png'
                      : 'https://manghe.jikechaowan.com/image/img_11.png'
                  "
                    size="26rpx"
                ></u-icon>
                <text class="t1">{{ item.blindGoodsInfo.market_price }}</text>
                <text class="t2">{{ item.blindGoodsInfo.price }}</text>
              </view>
            </view>
            <collection
                :i_s="true"
                size="33rpx"
                @click="
                showModal = true;
                index1 = index;
              "
            />
          </view>
        </view>
      </view>
    </view>
    <u-modal
        ref="uModal"
        v-model="showModal"
        :async-close="true"
        :show-cancel-button="true"
        content="是否取消收藏？"
        @cancel="showModal = false" 
        @confirm="confirm"
    ></u-modal>
  </mescroll-body>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import {apiGoods} from "@/common/mock.js";
import collection from "@/components/collection";
import UModal from "../../uview-ui/components/u-modal/u-modal";

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    UModal,
    collection,
  },
  data() {
    return {
      showModal: false,
      index1: -1,
      flag: true,
      upOption: {
        // page: {
        // 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
        // 	size: 10 // 每页数据的数量
        // },
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
      },
      empty: {
        tip: "暂无收藏",
      },
      goods: [],
    };
  },

  methods: {
    jumpInfo({jump_info}) {
      const item = {...jump_info};
      let url = "/pages/list/box";
      if (item.blind_type === 1) {
        url = "/pages/good/wireless";
      }
      if (item.blind_type === 2) {
        //扭蛋机
        url = "/pages/list/egg";
      }
      //item 去除blind_type
      if (!item.jifen_id) {
        delete item.jifen_id;
      }
      delete item.blind_type;
      this.$authRoute({
        url: url,
        params: item,
      });
    },
    upCallback(page) {
      //联网加载数据
      this.$store
          .dispatch("blind_getCollectList", {page: page.num})
          .then((res) => {
            let obj = res.data.list;
            obj = obj.map((item) => {
              item.is_collect = item.is_collect == 1;
              return item;
            });
			console.log(obj);
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            this.mescroll.endSuccess(obj.length);
            //设置列表数据
            if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
            this.goods = this.goods.concat(obj);
          })
          .catch((err) => {
			  console.log(err);
            //联网失败, 结束加载
            this.mescroll.endErr();
          });
    },
    //点击空布局按钮的回调
    emptyClick() {
      uni.showToast({
        title: "点击了按钮,具体逻辑自行实现",
      });
    },
    confirm() {
      uni.showLoading({
        title: "操作中",
      });
      const item = this.goods[this.index1];
      this.$store
          .dispatch("blind_collect", {
            do: "off",
            id: item.id,
          })
          .then((res) => {
            uni.hideLoading();
            this.showModal = false;
            this.goods.splice(this.index, 1);
            if (this.goods.length === 0) {
              this.mescroll.showEmpty();
            }
          })
          .catch((item) => {
            this.$refs.uModal.clearLoading();
            this.$toast(item.msg);
          });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #fafafa;
  padding-top: 26rpx;
}

.card {
  margin: 0 16rpx 26rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  display: flex;

  .content {
    flex: 1;
    margin-left: 27rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        .num {
          // margin-top: 20rpx;
          // padding: 0 32rpx;
          display: flex;

          .t1 {
            font-size: 34rpx;
            font-family: HelveticaNeue;
            font-weight: normal;
            color: #0c0c0c;
            margin-left: 10rpx;
            line-height: 1;
          }

          .t2 {
            font-size: 24rpx;
            font-family: PingFangSC;
            font-weight: 400;
            text-decoration: line-through;
            color: #b8b8ba;
            margin-left: 15rpx;
            align-self: flex-end;
            line-height: 1;
          }
        }
      }
    }

    .top {
      font-size: 28rpx;
      font-family: PingFangSC;
      font-weight: 300;
      color: #333333;
      line-height: 38rpx;
    }
  }
}
</style>
