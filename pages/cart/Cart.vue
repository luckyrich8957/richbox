<template>
  <view class="cart-page">
    <view class="cart-items">
      <view 
        class="cart-item"
        v-for="item in cart"
        :key="item.id"
      >
        <image 
          :src="item.image" 
          class="product-image"
        />
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <text class="product-price">${{ item.price }}</text>
          <view class="quantity-control">
            <button
              class="quantity-btn"
              @click="decreaseQuantity(item)"
            >-</button>
            <text class="quantity">{{ item.quantity }}</text>
            <button
              class="quantity-btn"
              @click="increaseQuantity(item)"
            >+</button>
          </view>
        </view>
        <button
          class="remove-btn"
          @click="removeFromCart(item.id)"
        >
          <u-icon name="trash" size="20"></u-icon>
        </button>
      </view>
    </view>

    <view class="checkout-section">
      <text class="total">總金額: ${{ total }}</text>
      <button
        class="checkout-btn"
        @click="checkout"
      >
        結帳
      </button>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal'])
  },
  methods: {
    ...mapMutations([
      'INCREASE_QUANTITY',
      'DECREASE_QUANTITY', 
      'REMOVE_FROM_CART'
    ]),
    
    increaseQuantity(item) {
      this.INCREASE_QUANTITY(item.id)
    },
    
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        this.DECREASE_QUANTITY(item.id)
      } else {
        this.removeFromCart(item.id)
      }
    },
    
    removeFromCart(productId) {
      uni.showModal({
        title: '確認刪除',
        content: '確定要從購物車移除該商品嗎？',
        success: (res) => {
          if (res.confirm) {
            this.REMOVE_FROM_CART(productId)
          }
        }
      })
    },
    
    checkout() {
      this.$store.dispatch('createOrder', this.cart)
        .then(() => {
          this.$router.push('/checkout')
        })
    }
  }
}
</script>

<style scoped>
.cart-page {
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.product-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 16px;
  margin-bottom: 5px;
}

.product-price {
  color: #ff4444;
  font-weight: bold;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.quantity {
  margin: 0 10px;
  font-size: 16px;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
}

.checkout-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 15px 20px;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-size: 18px;
  font-weight: bold;
}

.checkout-btn {
  background: #ff4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>