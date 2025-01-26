<template>
  <view class="wrap">
    <view class="list1" :style='{height:warpHeight}'  v-if='index===0'>
		<u-parse  :html="content"></u-parse>
    </view>
    <Item  :type='type' :i='1' :height='height' :index='index'/>
    <Item  :type='type' :i='2' :height='height' :index='index'/>
  </view>
</template>
<script>
import Item from './Item.vue'

export default {
  components: {
    Item
  },
  props: {
    // 0:K币 1:余额
    type: {
      type: Number,
    },
    index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
      type: Number,
      default() {
        return 0
      }
    },
    tabs: {
      type: Array,
      default() {
        return []
      }
    },
    height: {
      type: [Number, String]
    }
  },
  data() {
    return {
		content:'',
	}
  },
  computed:{
	 warpHeight(){
		let h=parseFloat(this.height) 
		 return this.$u.sys().windowHeight-h-15+'px'
	 } 
  },
 async mounted() {
	  let id;
  	if(this.type===0){
		id=5
	}else{
		id=7
	}
	const {data:{info}} =await this.$store.dispatch('user_getAgrementById',{id})
	if(info){
		this.content=info.val
	}
  },
  methods: {},
  watch: {
    index(val) {
      console.log(this.height);
    }
  }

}
</script>
<style lang="scss" scoped>
.list1 {
padding: 40rpx 50rpx;
overflow-y:auto;
}
</style>
