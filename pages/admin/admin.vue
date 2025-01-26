<template>
  <admin-layout>
    <router-view></router-view>
  </admin-layout>
</template>

<script>
import AdminLayout from '@/views/admin/Admin.vue'

export default {
  components: {
    AdminLayout
  }
}
</script>