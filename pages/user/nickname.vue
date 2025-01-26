<template>
  <view>
    <view class="input">
      <u-input :clearable="false" class='u-flex-1' :focus='true' v-model='nikename' maxlength="16"/>
    </view>
    <view class="tip">
      <view>
        1、昵称要求为1-16个字
      </view>
      <view>
        2、昵称要与客户端默认的昵称格式不一样
      </view>
    </view>
    <view class="btn" @click="updateNickname">
      提交
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      nikename: '',
    }
  },
  onLoad(P) {
  	if(P.name){
		this.nikename=P.name
	}
  },
  methods: {
    updateNickname() {
      if (!this.nikename) return this.$toast('昵称不能为空!')
      if (this.nikename == this.$store.state.userInfo.nickname) {
        return this.$toast('昵称不能与默认昵称一样!')
      }
      this.$store.dispatch('user_editUserInfo', {
        field: 'nickname',
        value: this.nikename,
      }).then((res) => {
		  this.$store.commit('setUserInfo',{...this.$store.state.userInfo,nickname:this.nikename})
        this.$toast('修改成功!')
		this.$authRoute({url:'/pages/user/setting'})
      }).catch((res) => {
        this.$toast(res.msg)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  background-color: #fafafa;
  padding-top: 26rpx;
}

.input {
  height: 112rpx;
  background: #EEEEEE;
  border-radius: 16rpx;
  margin: 0 16rpx;
  padding: 0 36rpx;
  display: flex;
  align-items: center;
}

.tip {
  margin-top: 36rpx;
  padding-left: 51rpx;

  view {
    font-family: PingFangSC;
    font-size: 22rpx;
    font-weight: 300;
    color: #B8B8BA;
    line-height: 30rpx;
  }
}

.btn {
  margin: 109rpx auto 0;
  width: 80%;
  height: 100rpx;
  background: #EB555B;
  border-radius: 16rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: PingFangSC;
  font-weight: 500;
  color: #FFFFFF;
}
</style>
