<template>
  <view>
    <view class="card">
      <view class="title">
        我的K币
      </view>
      <view class="num">
        <u-icon class="u-p-b-10 u-p-r-5" name='https://manghe.jikechaowan.com/image/img_11.png'
                size='26'></u-icon>
        <text class='money'>{{ pageConfig.coins }}</text>
      </view>
      <view class="btns">
        <view class="btn" @click="exchangeShow=true">
          晶石兑换K币
        </view>
        <view class="btn t1" @click="Kshow=true">
          充值
        </view>
      </view>
    </view>
    <view class="tabs">
      <u-tabs :active-item-style="{fontSize:'34rpx',fontweight:'600',color:'#333'}"
              :bar-style="{backgroundColor:'#eb555b',width:'30rpx' ,height:'8rpx',borderRadius:'4rpx'}"
              :current="tabIndex" :is-scroll="false"
              :list='tabs'
              bg-color="#fafafa" font-size='28'
              height="94" inactive-color='#333' @change="change"></u-tabs>
    </view>
    <list-item :height='height' :index='tabIndex' :tabs="pageConfig.exchange_coins_info" :type='0'/>
    <!-- 充值K币的弹窗 -->
    <u-popup v-model="Kshow" :closeable='true' border-radius='40' close-icon-color='#000' mode="bottom">
      <view class="k-content">
        <view class="title">
          充值K币
        </view>
        <view class="choose-title u-m-t-56">
          选择支付方式
        </view>
        <view v-for="(item,index) in payList" :key='index' class="choose-item u-border-bottom"
              @click="value=item.type">
          <u-icon :label="item.name" :name='item.icon' label-size="26" margin-left="25rpx" size='40rpx'></u-icon>
          <u-checkbox :value='value==item.type' active-color='#333' @input="()=>value=item.type"></u-checkbox>
        </view>
        <view class="choose-title u-m-t-66">
          选择充值金额
        </view>
        <view class="num-box">
          <view v-for="(item,index) in numList" :key='index'
                :class="{'num-item':true,on:index===num}" @click="num=index;customNum1='';">
            {{ '¥' + item.amount }}
          </view>
          <view class="num-item u-p-20">
            <u-input v-model='customNum1' :clearable='false' maxlength="4" placeholder="自定义金额" type='number'
                     @focus="num=-1"/>
          </view>
        </view>

        <view class="btn" @click="sureCharge">
          确认充值
        </view>
      </view>
    </u-popup>

    <!-- 晶石兑换K币弹窗 -->
    <u-popup v-model="exchangeShow" :closeable='true' border-radius='40' close-icon-color='#000' mode="bottom">
      <view class="ex-content">
        <view class="title">
          晶石兑换K币
        </view>
        <view class="rate ">
          兑换汇率：10晶石 = 1K币
        </view>
        <view class="new u-flex u-col-center">
          现有晶石：
          <u-image height='35rpx' src='@/static/material/crystal.png' width='26rpx'></u-image>
          <text class='money u-p-l-10'>{{ money(pageConfig.balance) }}</text>
        </view>
        <view class="num-box">
          <view v-for="(item,index) in exList" :key='index' :class="{'num-item':true,on:index===ex}"
                @click="ex=index;customNum=''">
            {{ '兑换' + money(item.amount) + '晶石' }}
          </view>
          <view :class="{'num-item':true,on:ex===-2}" @click="all">
            全部兑换
          </view>
          <view class="num-item u-p-20">
            <u-input v-model='customNum' :clearable='false' maxlength="6" placeholder="自定义金额" type='number'
                     @focus="ex=-1"/>
          </view>
        </view>
        <view v-if='error1' class="error-tip u-font-24 u-p-t-20 u-type-warning">
          * 您的晶石不够，请选择对应晶石数量或输入自定义数量
        </view>
        <view class="btn" @click="sureEx">
          确认兑换
        </view>
      </view>
    </u-popup>
    <u-modal v-model="showEx" :content="content" :showCancelButton="true" @confirm="confirmEx"></u-modal>
    <!-- #ifndef MP-ALIPAY -->
    <chackstand ref="chackstand" @fail="fail" @success="success"/>
    <!-- #endif -->
    <!-- #ifdef MP-ALIPAY -->
    <chackstand ref="chackstand" @fail="fail" @success="success" @throwFn='changeFn'/>
    <!-- #endif -->

  </view>
</template>

<script>
import listItem from './components/listItem.vue'
import chackstand from '@/pages/order/checkstand.vue'

export default {
  components: {
    listItem,
    chackstand
  },
  computed: {
    error1() {
      if (this.ex == -1 || this.ex == -2) return false
      let id = this.exList[this.ex].id
      let selectAmount = this.exList[this.ex].amount
      return parseFloat(selectAmount) > parseFloat(this.pageConfig.balance)
    },
    payList() {
      return this.$store.state.payList
    },
  },
  data() {
    return {
      customNum1: '',
      error: '',
      showEx: false,
      content: '确定兑换成K币吗？',
      exchangeShow: false,
      customNum: '',
      // 支付方式
      value: '',
      // 充值金额下标
      num: 0,
      numList: [50, 100, 200, 500, 1000],
      // 兑换列表
      exList: [50, 100, 200, 500, 1000],
      ex: 0,
      Kshow: false,
      tabIndex: 0,
      height: 0,
      pageConfig: {pageInfo: []},
      tabs: [{name: 'K币'}, {name: '获得记录'}, {name: '消费明细'}],
      formData: {},
      payFn: null,
    }
  },
  onShow() {
    console.log(this.$store.state.payList)
    this.getPageInfo()
    this.getPageInfo2()
  },
  methods: {
    changeFn(init) {
      this.payFn = init
    },
    all() {
      if (this.pageConfig.balance < 10) {
        return this.$toast('最低兑换数量为10晶石')
      }
      this.customNum = ''
      this.ex = -2
    },
    success(res) {
      this.$u.toast('充值成功')
      this.getPageInfo()
      this.getPageInfo2()
      this.showEx = false
      this.exchangeShow = false
      this.Kshow = false
    },
    fail(res) {
      this.$u.toast(res.msg || '支付失败')
      this.showEx = false
      this.exchangeShow = false
    },
    confirmEx() {
      this.$store.dispatch('order_createTransferCoinsOrder', this.formData).then((res) => {
        this.$t(res.msg, () => {
          this.showEx = false
          this.customNum = ''
          this.ex = 0
          this.exchangeShow = false
          this.pageConfig.balance = res.data.balance
          this.pageConfig.coins = res.data.coins
        })
      }).catch((res) => {
        this.$toast(res.msg)
      })
    },
    sureCharge() {
      if (this.value === '') {
        return this.$toast('请选择支付方式')
      }
      let amount;
      let id;
      if (this.num == -1) {
        amount = this.customNum1;
        if (amount && amount.length > 0) {
          id = 0;
        } else {
          return this.$toast('请输入充值的金额')
        }
      } else {
        id = this.numList[this.num].id
        amount = this.numList[this.num].amount
      }
      this.$store.dispatch('order_createRechargeOrder', {
        id: id,
        amount: amount,
      }).then((res) => {
        this.customNum1 = ''
        // #ifdef MP-ALIPAY
        return this.payFn({
          order_id: res.data.order_id,
          trade_type: this.value,
          order_type: 'rechargeOrder'
        })
        // #endif
        // #ifndef MP-ALIPAY
        return this.$refs.chackstand.init({
          order_id: res.data.order_id,
          trade_type: this.value,
          order_type: 'rechargeOrder'
        })
        // #endif
      }).catch((res) => {
        this.$toast(res.msg)
      })
    },
    sureEx() {
      let amount;
      let selectAmount;
      let id;
      if (this.ex == -1) {
        amount = this.customNum;
        if (amount && amount.length > 0) {
          id = 0;
        } else {
          return this.$toast('请输入兑换金额')
        }
      } else if (this.ex == -2) {
        amount = parseInt(this.pageConfig.balance / 10) * 10
        id = 0
      } else {
        id = this.exList[this.ex].id
        selectAmount = this.exList[this.ex].amount
      }

      if (parseFloat(amount) > parseFloat(this.pageConfig.balance) || parseFloat(selectAmount) > parseFloat(this.pageConfig.balance)) return this.$t('账户晶石不足!')
      this.formData = {
        id: id,
        amount: amount,
        selectAmount: selectAmount,
      }
      this.showEx = true
    },
    change(index) {
      this.tabIndex = index;
    },
    getPageInfo() {  //K币充值
      this.$store.dispatch('coins_getChargeConfigList').then((res) => {
        this.numList = res.data.list
      })
    },
    getPageInfo2() {  //K币兑换
      this.$store.dispatch('recharge_getCoinsExchangeConfig').then((res) => {
        this.exList = res.data.list
        this.pageConfig = res.data.page_config
      })
    }
  },

  onReady() {
    this.$nextTick(function () {

      // #ifndef MP-ALIPAY
      this.$u.getRect('.tabs').then(res => {
        this.height = res.bottom + 15 + 'px'
      })
      // #endif
      // #ifdef MP-ALIPAY
      my.createSelectorQuery().select('.tabs').boundingClientRect().exec(res => {
        this.height = res[0].bottom + 15 + 'px'
        console.log(this.height);
      })
      // #endif
    })
  }
}
</script>

<style>
page {
  background-color: #fafafa;
  padding-top: 26 rpx;
}
</style>
<style lang="scss" scoped>
.tabs {
  padding: 26rpx 50rpx 0;
}

.card {
  margin: 0 16rpx;
  background: #FFFFFF;
  border-radius: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    margin-top: 56rpx;
    line-height: 1;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #B8B8BA;
  }

  .num {
    margin-top: 30rpx;
    display: flex;
    align-items: flex-end;
    font-size: 28rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #0C0C0C;
    line-height: 1;

    .money {
      font-size: 76rpx;
      font-family: HelveticaNeue;
      font-weight: normal;
      color: #0C0C0C;
      line-height: 1;
    }
  }

  .btns {
    width: 100%;
    display: flex;
    padding: 57rpx 40rpx 36rpx;
    justify-content: space-between;

    .btn {
      width: 308rpx;
      height: 100rpx;
      background: #448EF6;
      border-radius: 20rpx;
      font-size: 30rpx;
      font-family: PingFangSC;
      font-weight: 500;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .t1 {
      background-color: #000000;
    }
  }
}

.k-content {
  padding: 80rpx 56rpx 32rpx;

  .title {
    font-size: 36rpx;
    text-align: center;
    line-height: 1;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }

  .choose-title {
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    line-height: 1;
    color: #B8B8BA;
  }

  .choose-item {
    height: 110rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .num-box {
    padding-top: 12rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .num-item {
      width: 200rpx;
      height: 80rpx;
      border: 1rpx solid #eee;
      border-radius: 12rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 19rpx;
    }

    .on {
      color: #fff;
      background-color: #000000;
      border: none;
    }
  }

  .btn {
    width: 638rpx;
    height: 90rpx;
    background: #448EF6;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80rpx;
  }

  .input {
    margin-top: 20rpx;
  }
}

.ex-content {
  padding: 80rpx 56rpx 32rpx;

  .title {
    font-size: 36rpx;
    text-align: center;
    line-height: 1;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }

  .rate {
    line-height: 1;
    margin-top: 56rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #333333;
  }

  .new {
    line-height: 1;
    margin-top: 24rpx;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 400;
    color: #EB555B;
  }

  .num-box {
    padding-top: 12rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .num-item {
      width: 200rpx;
      height: 80rpx;
      border: 1rpx solid #eee;
      border-radius: 12rpx;
      font-size: 24rpx;
      font-family: PingFangSC;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 19rpx;
    }

    .on {
      color: #fff;
      background-color: #000000;
      border: none;
    }
  }

  .btn {
    width: 638rpx;
    height: 90rpx;
    background: #448EF6;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80rpx;
  }

  .input {
    margin-top: 20rpx;
  }
}
</style>