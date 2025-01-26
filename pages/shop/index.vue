<template>
  <div class="shop-page">
    <div class="shop-header">
      <h1>Shopee Style Store</h1>
      <NotificationList />
    </div>
    
    <ProductGrid :products="products" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ProductGrid from '@/components/product/ProductGrid.vue';
import NotificationList from '@/components/notifications/NotificationList.vue';

export default defineComponent({
  name: 'ShopPage',
  
  components: {
    ProductGrid,
    NotificationList
  },

  data() {
    return {
      products: [
        {
          id: 1,
          name: 'Product 1',
          image: 'https://via.placeholder.com/200',
          price: 19.99,
          originalPrice: 29.99,
          discount: 33
        },
        {
          id: 2,
          name: 'Product 2',
          image: 'https://via.placeholder.com/200',
          price: 49.99
        },
        // Add more products as needed
      ]
    }
  }
});
</script>

<style scoped>
.shop-page {
  padding: 20px;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  color: #333;
}
</style>