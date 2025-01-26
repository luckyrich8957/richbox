<template>
  <view>
    <view class="top-warp">
      <!-- 当设置tab-width,指定每个tab宽度时,则不使用flex布局,改用水平滑动 -->
      <u-subsection bg-color='#323232' height='64' font-size='24' active-color='#fff' inactive-color='#B8B8BA'
                    :bold='false' button-color='#464646' :list="list" :current="tabIndex" @change="sectionChange">
      </u-subsection>
    </view>
    <box-item :jifen_id="jifen_id" ref="mescrollItem" :type='type' v-if='id' v-for="(tab,i) in list" :uid="id" :key="i" :i="i" :index="tabIndex" :tabs="list">

    </box-item>
    <view class="fixed" @click="back" v-if='isshow'>
      返回盲盒
    </view>
  </view>
</template>

<script>
import MescrollMoreMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more.js";
import boxItem from './components/box-item.vue'

export default {
  mixins: [MescrollMoreMixin], // 多个mescroll-body写在子组件时, 则使用mescroll-more.js补充子组件的页面生命周期
  components: {
    boxItem
  },
  data() {
    return {
		type:'',
      tabIndex: 0,
	  isshow:false,
      list: [{
        name: '全部'
      },
        {
          name: '进行中'
        },
        {
          name: '已售罄'
        },
        {
          name: '我参与的'
        }
      ],
      id: 0,
      jifen_id:0
    }
  },
  methods: {
    sectionChange(index) {
      this.tabIndex = index;
    },
	back(){
		uni.navigateBack()
	}
  },
  onLoad(p) {
	  this.type=p.type||''
	  this.isshow=!!p.show
	  this.id = p.id
    this.jifen_id = p.jifen_id || 0
  },
}
</script>

<style>
	page {
	  background-color: #212024 !important;
	}
.top-warp {
  z-index: 9990;
  position: fixed;
  top: --window-top;
  /* css变量 */
  margin-top: -1px;
  left: 0;
  width: 100%;
  height: 100rpx;
  padding: 26rpx 16rpx 0rpx;
  background-color: #212024;
}
</style>
<style lang="scss" scoped>

.fixed {
  height: 98rpx;
  background: #0C0C0C;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 30rpx;
  font-family: PingFangSC;
  font-weight: 500;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
