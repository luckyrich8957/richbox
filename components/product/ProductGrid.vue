<template>
  <div class="product-grid">
    <div
      class="product-item"
      v-for="product in products"
      :key="product.id"
      @click="goToProductDetail(product)"
    >
      <div class="product-image">
        <img :src="product.image" :alt="product.name">
        <div v-if="product.discount" class="discount-badge">
          -{{ product.discount }}%
        </div>
      </div>
      
      <div class="product-info">
        <div class="product-name">{{ product.name }}</div>
        <div class="product-price">
          <span class="current-price">${{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">
            ${{ product.originalPrice }}
          </span>
        </div>
        <div class="product-actions">
          <HoverButton
            class="add-to-cart"
            @click="addToCart(product)"
            tooltip="Add to your shopping cart"
          >
            Add to Cart
            <template #icon>
              <i class="fas fa-cart-plus"></i>
            </template>
          </HoverButton>
          
          <HoverButton
            class="buy-now"
            @click="buyNow(product)"
            tooltip="Proceed to checkout"
          >
            Buy Now
            <template #icon>
              <i class="fas fa-wallet"></i>
            </template>
          </HoverButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'ProductGrid',
  
  props: {
    products: {
      type: Array,
      required: true
    }
  },

  methods: {
    ...mapActions('shop', ['addToCart']),
    
    buyNow(product: any) {
      // 創建單一商品訂單
      const order = {
        product,
        quantity: 1,
        paymentMethod: 'qrcode', // 默認使用QR碼支付
        useTideCoin: false // 是否使用潮幣支付
      }
      
      this.$store.dispatch('createOrder', order)
        .then(() => {
          this.$router.push('/checkout')
        })
    }
  }
});
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 16px;
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 20px;
  }
}

.product-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.product-item:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.product-info {
  padding: 12px;
}

.product-name {
  font-size: 14px;
  margin-bottom: 8px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-bottom: 12px;
}

.current-price {
  color: #ff4444;
  font-size: 16px;
  font-weight: bold;
  margin-right: 8px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.add-to-cart,
.buy-now {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-to-cart {
  background: #f0f0f0;
}

.add-to-cart:hover {
  background: #e0e0e0;
}

.buy-now {
  background: #ff4444;
  color: white;
}

.buy-now:hover {
  background: #cc0000;
}
</style>