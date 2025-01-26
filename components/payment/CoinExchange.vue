<template>
  <view class="coin-exchange">
    <view class="exchange-options">
      <view 
        class="option" 
        v-for="(option, index) in exchangeOptions" 
        :key="index"
      >
        <view class="option-content">
          <view class="coin-amount">
            <u-icon name="coin" size="40"></u-icon>
            <text>{{option.coins}} {{ '潮幣' | zh }}</text>
          </view>
          <text class="price">NT$ {{option.price | zh}}</text>
          <image 
            :src="option.qrCode" 
            mode="widthFix" 
            class="qr-code"
            @tap="previewQR(option.qrCode)"
          />
          <button
            type="button"
            class="exchange-btn"
            @tap="requestExchange(option)"
          >{{ '購買' | zh }}</button>
          
          <button
            v-if="canUseTideCoin(option)"
            class="tide-coin-btn"
            @tap="useTideCoin(option)"
          >
            <u-icon name="coin" size="20" color="#FFD700"></u-icon>
            使用潮幣支付
          </button>
        </view>
      </view>
    </view>
    
    <view class="exchange-records">
      <view class="record-header">
        <text>{{ '兌換記錄' | zh }}</text>
      </view>
      <view 
        class="record-item" 
        v-for="record in exchangeRecords" 
        :key="record.id"
      >
        <view class="record-info">
          <text>{{record.coins}} {{ '潮幣' | zh }}</text>
          <text>NT$ {{record.price | zh}}</text>
          <text v-if="record.bonus > 0">+{{record.bonus}} 贈送潮幣</text>
          <text :class="['status', record.status]">{{statusMap[record.status]}}</text>
        </view>
        <text class="time">{{formatTime(record.createTime)}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CoinExchange',
  data() {
    return {
      exchangeOptions: [
        {
          coins: 500,
          price: 500,
          qrCode: '/static/qr/500.png',
          bonus: 0
        },
        {
          coins: 1100,
          price: 1000,
          qrCode: '/static/qr/1000.png',
          bonus: 100
        }
      ],
      exchangeRecords: []
    };
  },
  methods: {
    canUseTideCoin(option) {
      return this.$store.state.userInfo.tideCoin >= option.coins
    },
    
    useTideCoin(option) {
      uni.showModal({
        title: this.$toTraditional('確認使用潮幣支付'),
        content: this.$toTraditional(`確定要使用 ${option.coins} 潮幣支付嗎？`),
        success: (res) => {
          if (res.confirm) {
            this.$store.dispatch('useTideCoin', option)
              .then(() => {
                uni.showToast({
                  title: this.$toTraditional('支付成功'),
                  icon: 'success'
                })
              })
              .catch(() => {
                uni.showToast({
                  title: this.$toTraditional('支付失敗'),
                  icon: 'none'
                })
              })
          }
        }
      })
    },
    
    requestExchange(option) {
      uni.showModal({
        title: this.$toTraditional('確認兌換'),
        content: this.$toTraditional(`確定要購買 ${option.coins} 遊戲幣嗎？費用：NT$ ${option.price}`),
        success: (res) => {
          if (res.confirm) {
            this.createExchangeOrder(option);
          }
        }
      });
    },
    
    async createExchangeOrder(option) {
      try {
        // TODO: 調用後端 API 創建兌換訂單
        const order = {
          id: Date.now(),
          coins: option.coins,
          price: option.price,
          bonus: option.bonus,
          status: 'pending',
          createTime: new Date().toISOString()
        };
        
        this.exchangeRecords.unshift(order);
        
        uni.showToast({
          title: this.$toTraditional('訂單已創建，請掃碼支付'),
          icon: 'none'
        });
      } catch (error) {
        uni.showToast({
          title: this.$toTraditional('創建訂單失敗'),
          icon: 'none'
        });
      }
    },
    
    previewQR(url) {
      uni.previewImage({
        urls: [url]
      });
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString();
    }
  },
  
  computed: {
    statusMap() {
      return {
        pending: this.$toTraditional('待支付'),
        processing: this.$toTraditional('處理中'), 
        completed: this.$toTraditional('已完成'),
        failed: this.$toTraditional('失敗')
      };
    }
  },
  
  created() {
    // TODO: 載入用戶的兌換記錄
  }
};
</script>

<style lang="scss" scoped>
.coin-exchange {
  padding: 30rpx;
  
  .exchange-options {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 40rpx;
    
    .option {
      width: 48%;
      margin-bottom: 30rpx;
      
      .option-content {
        background-color: #fff;
        border-radius: 16rpx;
        padding: 30rpx;
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .coin-amount {
          display: flex;
          align-items: center;
          margin-bottom: 20rpx;
          
          text {
            margin-left: 10rpx;
            font-size: 32rpx;
            font-weight: bold;
          }
        }
        
        .price {
          color: #ff4d4f;
          font-size: 36rpx;
          font-weight: bold;
          margin-bottom: 30rpx;
        }
        
        .qr-code {
          width: 300rpx;
          height: 300rpx;
          margin-bottom: 30rpx;
        }
        
        .exchange-btn {
          width: 100%;
          height: 80rpx;
          font: inherit;
          background-color: #f0f0f0;
          border: 0;
          color: #242424;
          border-radius: 0.5em;
          font-size: 1.35rem;
          padding: 0.375em 1em;
          font-weight: 600;
          text-shadow: 0 0.0625em 0 #fff;
          box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
            0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
            0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
          transition: 0.15s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .exchange-btn:active {
          translate: 0 0.225em;
          box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
            0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
            0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece;
        }
      }
    }
  }
  
  .exchange-records {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    
    .record-header {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 30rpx;
    }
    
    .record-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #eee;
      
      .record-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;
        
        .status {
          &.pending {
            color: #faad14;
          }
          &.processing {
            color: #1890ff;
          }
          &.completed {
            color: #52c41a;
          }
          &.failed {
            color: #ff4d4f;
          }
        }
      }
      
      .time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}
</style>
