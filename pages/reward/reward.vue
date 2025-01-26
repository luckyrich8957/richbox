<template>
  <view>
    <u-tabs :active-item-style="{fontSize:'34rpx',fontweight:'600',color:'#333'}"
            :bar-style="{backgroundColor:'#eb555b',width:'30rpx' ,height:'8rpx',borderRadius:'4rpx'}"
            :current="tabIndex" :is-scroll="false"
            :list='tabs'
            bg-color="#fafafa" font-size='28'
            height="90" inactive-color='#333' @change="change"></u-tabs>
    <prize-item :index="tabIndex" :tabs="tabs"/>

  </view>
</template>

<script>
import prizeItem from './components/prize-item.vue'
import shareMixin from "@/common/shareMixin";

export default {
  components: {
    prizeItem
  },
  mixins: [shareMixin],
  provide() {
    return {
      isEdit: () => {
        return this.isEdit
      },
      changeEdit: () => {
        this.isEdit = !this.isEdit
      }
    }
  },
  data() {
    return {
      tabs: [{name: '待发货'}, {name: '已发货'}, {name: '已赠送'}, {name: '已分解'}],
      tabIndex: 0,
      isEdit: false
    };
  },
  methods: {
    change(index) {
      this.tabIndex = index;
    },
    goLock() {

    }
  }
}
</script>
<style>
page {
  background-color: #fafafa;
}
</style>
<style lang="scss" scoped>
page {
  background-color: #fafafa;
}
</style>
