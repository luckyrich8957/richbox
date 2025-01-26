<template>
  <u-popup v-model='_show' :closeable='true'  border-radius="40" mode='bottom' width="800rpx">
    <view class="content">
      <view class="title">
        {{ title }}
      </view>
      <scroll-view scroll-y="true" style="height: 875rpx;">
        <view class="u-p-16">
          <u-parse :html="content"></u-parse>
        </view>

      </scroll-view>
      <view v-if='showBtn' class="bottom u-border-top safe-area-inset-bottom">
        <view class="item1" @click="btnClick(false)">不同意</view>
        <view class="item1 border" @click="btnClick(true)">同意</view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  data() {
    return {
      showModel: true,
      content: '1111',
      title: '',
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
	showBtn:{
		type:Boolean,
		default:true
	},
    uid: {
      type: [String, Number],
      default: 1
    },
  },
  mounted() {
    console.log(this.id);
    this.$nextTick(async () => {
      const {data} = await this.$store.dispatch('user_getAgrementById', {
        id: this.uid
      })
      const info = data.info
      this.content = info.val;
      this.title = info.key;
	  this.$emit('xieyi',this.content)
    })

  },
  methods: {
    btnClick(val) {
      this._show = false;
      this.$emit('submit', val)
    }
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
.content {
  height: 1106rpx;
  display: flex;
  flex-direction: column;

  .title {
    height: 130rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }

  .bottom {
    flex: 1;
    display: flex;
    width: 100%;
    padding: 14rpx 0;

    .item1 {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #B8B8BA;
    }

    .border {
      border-left: 1rpx solid #C7C7CB;
      color: #448EF6;
    }
  }
}
</style>
