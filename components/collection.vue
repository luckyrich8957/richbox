<template>
  <view>

    <image :animation="animationData" :src="name" :style="style" style="display: block;width:40rpx;height:40rpx"
           @click.stop="imageClick"></image>
  </view>
</template>

<script>
export default {
  name: "collection",
  props: {
    size: {
      type: [String, Number],
      default: '49rpx'
    },
    i_s: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.animation = uni.createAnimation({
      duration: 1000,
    })
    this.animation.scale(0.5).step({duration: 400})

    this.animation.scale(1).step({duration: 400})

  },
  data() {
    return {
      animationData: {},
      animation: null
    };
  },
  methods: {
    imageClick(e) {
      console.log(e)
      e.stopPropagation()
      this.$emit('click')
    }
  },
  watch: {
    i_s() {
      this.animationData = this.animation
      setTimeout(() => {
        this.animationData = {}
      })
    }
  },
  computed: {
    name() {
      return this.i_s ? 'https://manghe.jikechaowan.com/image/img_14.png' :'https://manghe.jikechaowan.com/image/img_15.png'
    },
    style() {
      return {
        width: this.size,
        height: this.size
      }
    }
  }
}
</script>

<style lang="scss">

</style>
