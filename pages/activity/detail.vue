<template>
  <view class="u-p-20">
	<u-parse :html="content"></u-parse>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				id:0,
				content:'',
			}
		},
		onLoad(e) {
			if('id' in e){
				this.id=e.id
				this.init()
			}
			else{
				this.$t('活动已结束',()=>{
					uni.navigateBack()
				})
			}
		},
		methods: {
			async init(){
				  const {
				    data
				  } = await this.$store.dispatch('blind_getAdDetail', {
				    id:this.id
				  })
				  console.log(data)
				  const info = data.info
				  this.content = info.content;
				  uni.setNavigationBarTitle({
				    title: info.ad_name
				  })
				}	
		}
	}
</script>

<style>

</style>
