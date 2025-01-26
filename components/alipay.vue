<template>
  <u-popup
      v-model="_show"
      :closeable="true"
      border-radius="16"
      mode="center"
      width="650rpx"
  >
    <view class="content">
      <view class="title"> 支付宝扫码付款</view>
      <u-image :src="img" height="500rpx" width="500rpx"></u-image>
      <view class="save" @click="save"> 保存图片</view>
      <view class="tip"> *请在
        <u-count-down ref="uCountDown" :show-hours='false' :autoplay="false" :timestamp="timestamp" separator="zh"></u-count-down>
        内，用支付宝扫码付款，超时无效
      </view>
      <view class="btn" @click="_show=false"> 我已付款</view>
    </view>
  </u-popup>
</template>

<script>

export default {
  data() {
    return {
      timestamp: 3 * 60
    };
  },
  components: {
  
  },

  watch: {
    value(val) {
      this.timestamp = 3 * 60
      this.$refs.uCountDown.start()
    }
  },
  props: ["value", 'img'],
  methods: {
    save() {
      let url = this.img
      uni.getImageInfo({
        src: url,
        success: function (image) {
          // console.log('图片信息：', JSON.stringify(image));
          uni.saveImageToPhotosAlbum({
            filePath: image.path,
            success: function () {
              uni.showToast({
                title: '图片保存成功'
              });
            },
            fail: (err) => {
              console.log(err);
              // #ifdef APP
              this.$u.toast('保存失败，请开启权限')
              // #endif
              // #ifdef MP
              if (err['errMsg'] === 'saveImageToPhotosAlbum:fail auth deny') {
                uni.showModal({
                  content: '你还未开启权限是否去开启？',
                  success: (res) => {
                    if (res.confirm) {
                      uni.openSetting({
                        success(res1) {
                          if (!res1.authSetting[
                              'scope.writePhotosAlbum'
                              ]) {
                            this.$u.toast(
                                '授权失败')
                          } else {
                            uni.saveImageToPhotosAlbum({
                              filePath: path,
                              success: () => {
                                this.$u
                                    .toast(
                                        '保存成功'
                                    )
                              },
                            })
                          }
                        }
                      });
                    }
                  }
                })
              }
              // #endif
            }
          });
        },
        fail(e) {
          uni.showToast({
            title: '图片失败'
          });
        }
      });
    },
  },
  mounted() {
    console.log("常见了", this.value);
  },

  computed: {
    _show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.btn {
  width: 85%;
  height: 80rpx;
  color: #fff;
  border-radius: 10rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #169bd5;
}

.tip {
  font-size: 24rpx;
  font-family: PingFangSC;
  color: orangered;
  margin-top: 20rpx;
  margin-bottom: 30rpx;
  padding: 0 30rpx;
  text-align: center;
}

.title {
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 32rpx;
  color: #555;
}

.save {
  margin-top: 20rpx;
  height: 70rpx;

  padding: 0rpx 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26rpx;
  color: #fff;
  background-color: #52f3f9;
  border-radius: 10rpx;
  font-weight: 600;
}
</style>
