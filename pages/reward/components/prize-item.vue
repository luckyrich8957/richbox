<template>
  <view>
    <item-one :index='index' v-if='index===0'/>
    <item-two v-if='index===1'/>
    <item-three v-if='index===2'/>
    <item-four v-if='index===3'/>
  </view>
  <!-- 不能用v-if (i: 每个tab页的专属下标;  index: 当前tab的下标; 申明在 MescrollMoreItemMixin )-->


  <!-- top="120"下拉布局往下偏移,防止被悬浮菜单遮住 -->
  <!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->


</template>

<script>
import itemOne from "./itemOne.vue"
import itemTwo from './itemTwo.vue'
import itemThree from './itemThree.vue'
import itemFour from './itemFour.vue'

export default {
  components: {
    itemOne,
    itemTwo,
    itemThree,
    itemFour
  },
  mounted() {
    console.log(this.index);
  },
  props: {
    index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
      type: Number,
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
    return {}
  },
  methods: {}

}
</script>
