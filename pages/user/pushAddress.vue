<template>
  <view>
    <view class="input-item">
      <view class="label">
        收货人
      </view>
      <u-field maxlength="6" placeholder-style="font-size: 28rpx;font-family: PingFangSC;font-weight: 400;color: #B8B8BA;" v-model="form.real_name" label-width="0" placeholder="名字"/>
    </view>
    <view class="input-item">
      <view class="label">
        手机号码
      </view>
      <u-field maxlength="11" v-model="form.phone" type='number' label-width="0" placeholder="手机号码"
               placeholder-style="font-size: 28rpx;font-family: PingFangSC;font-weight: 400;color: #B8B8BA;"/>
    </view>
    <view class="input-item">
      <view class="label">
        所在地区
      </view>
      <view @click="show=true" class="region u-border-bottom">
        <view class="placeholder" v-if='!form.region'>
          省、市、区
        </view>
        <view class="region1" v-else>
          {{ form.region }}
        </view>
        <u-icon color="#aaa" name='arrow-right' label-size="28rpx" label-pos="left"
                :label="form.region.length===0?'请选择':''"></u-icon>
      </view>
    </view>
    <view class="input-item">
      <view class="label">
        详细地址
      </view>
      <u-field maxlength="20" placeholder-style="font-size: 28rpx;font-family: PingFangSC;font-weight: 400;color: #B8B8BA;" v-model="form.detail" label-width="0" placeholder="街道、小区、楼牌号、单元室等"/>
    </view>
    <view class="switch input-item">
      <view class="label">
        设为默认收货地址
      </view>
      <u-switch :active-value="1" @change="changeSwitch" :inactive-value="0" active-color='#333' inactive-color='#eee'
                v-model='form.is_default'></u-switch>
    </view>
    <u-picker mode="region" :default-region="arr" @confirm='confirm' v-model="show"></u-picker>
    <view class="fixed safe-area-inset-bottom">
      <view class="btn" v-if='!form.id' @click.stop="submit">
        保存
      </view>
      <view class="btns" v-else>
        <view class="t1 b" @click="delShow =  true">
          删除
        </view>
        <view class="t1" @click.stop="submit">
          保存
        </view>
      </view>
    </view>
    <u-modal v-model="delShow" :content="content" :show-cancel-button="true" @confirm="sureDel"></u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      delShow: false,
      content: '确定要删除该收货地址吗？',
      arr: [],
      form: {
        id: false,
        real_name: '',
        phone: '',
        region: '',
        detail: '',
        is_default: 1
      },
    }
  },
  onLoad(P) {
    if ('id' in P) {
      this.form.id = P.id
      uni.setNavigationBarTitle({
        title: '编辑收货地址'
      })
      this.getUserAddressInfo()
    }
  },
  methods: {
    sureDel() {
      if (this.form.id) {
        this.$store.dispatch('my_delUserAddress', {id: this.form.id}).then((res) => {
          this.$t(res.msg, () => {
            this.$authRoute({
              type: 'redirectTo',
              url: '/pages/user/address',
            })
          })
        }).catch((res) => {
          this.$toast(res.msg)
        })
      }
    },
    getUserAddressInfo() {
      this.$store.dispatch('my_getUserAddressInfo', {id: this.form.id}).then((res) => {
        this.form = res.data.info
        this.form.region = res.data.info.province + " " + res.data.info.city + " " + res.data.info.district
      })
    },
    changeSwitch(val) {
      this.form.is_default = val
    },
    confirm(e) {
      console.log(this.arr)
      this.arr = Object.values(e).reduce((cur, item) => {
        cur.push(item.label)
        return cur
      }, []);
      this.form.region = Object.values(e).reduce((cur, item, index, arr) => {
        cur += item.label
        if (index !== arr.length - 1) {
          cur += ' '
        }
        return cur
      }, '');
    },
    submit() {
      if (!this.form.region) return this.$toast('请选择地区!')
      let arr = this.form.region.split(" ")
      let params = {}
      params.province = arr[0]
      params.city = arr[1]
      params.district = arr[2]
      params = Object.assign(this.form, params);
      if (!this.form.id) {
        this.$store.dispatch('my_addUserAddress', params).then((res) => {
          this.$t(res.msg, () => {
            uni.navigateBack()
          })
        }).catch((res) => {
          this.$toast(res.msg)
        })
      } else {
        this.$store.dispatch('my_editUserAddress', params).then((res) => {
          this.$t(res.msg, () => {
            uni.navigateBack()
          })
        }).catch((res) => {
          this.$toast(res.msg)
        })
      }
    }
  }
}
</script>

<style>
page {
	box-sizing: border-box;
  padding: 26rpx 32rpx 150rpx;
}
</style>
<style lang="scss" scoped>
.btns {
  width: 718rpx;
  height: 90rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .t1 {
    width: 350rpx;
    height: 90rpx;
    background: #333;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .b {
    background: #EEEEEE;
    color: #EB555B;
  }
}

.fixed {
  position: fixed;
  z-index: 99;
  height: 110rpx;
  background-color: #fafafa;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .btn {
    width: 718rpx;
    height: 90rpx;
    background: #323232;
    border-radius: 16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #FFFFFF;
  }
}

.input-item {
  margin-bottom: 56rpx;

  .label {
    font-size: 32rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
    line-height: 1;
    margin-bottom: 20rpx;
  }

  /deep/ .u-field {
    padding-left: 0;
  }

  .region {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0rpx 28rpx 0;

    .placeholder {
      font-size: 28rpx;
      font-family: PingFangSC;
      font-weight: 400;
      color: #B8B8BA;
    }
  }

}

.switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
