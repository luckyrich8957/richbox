<template>
  <view class="u-p-20">
	<u-parse :html="content"></u-parse>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: '',
    }
  },
  onLoad(P) {

    if (!P.id) {
      this.$t('未知协议', () => {
        uni.navigateBack()
      })
    }
    this.init(P.id)
  },
  methods: {
    async init(id) {
      const {
        data
      } = await this.$store.dispatch('user_getAgrementById', {
        id
      })
      console.log(data)
      const info = data.info
      this.content = info.val;
      uni.setNavigationBarTitle({
        title: info.key
      })
    }
  }
}
</script>

<style>
</style>
