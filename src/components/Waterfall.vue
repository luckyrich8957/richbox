<template>
  <view class="u-waterfall">
    <view id="u-left-column" class="u-column">
      <slot name="left" :leftList="leftList"></slot>
    </view>
    <view id="u-right-column" class="u-column">
      <slot name="right" :rightList="rightList"></slot>
    </view>
  </view>
</template>

<script>
/**
 * waterfall 瀑布流
 * @description 這是一個瀑布流形式的組件，內容分為左右兩列，結合uView的懶加載組件效果更佳。相較於某些只是奇偶數左右分別，或者沒有利用vue作用域插槽的做法，uView的瀑布流實現了真正的 組件化，搭配LazyLoad 懶加載和loadMore 加載更多組件，讓您開箱即用，眼前一亮。
 * @tutorial https://www.uviewui.com/components/waterfall.html
 * @property {Array} flow-list 用於渲染的數據
 * @property {String Number} add-time 單條數據添加到隊列的時間間隔，單位ms，見上方注意事項說明（預設200）
 * @example <u-waterfall :flowList="flowList"></u-waterfall>
 */
export default {
  name: "Waterfall",
  props: {
    value: {
      // 瀑布流數據
      type: Array,
      required: true,
    },
    addTime: {
      // 每次向結構插入數據的時間間隔，間隔越長，越能保證兩列高度相近，但是對用戶體驗越不好
      type: [String, Number],
      default: 200,
    },
    idKey: {
      // id值，用於清除某一條數據時，根據此idKey名稱找到並移除，如數據為{idx: 22, name: 'lisa'}
      type: String,
      default: 'id',
    },
  },
  data() {
    return {
      leftList: [],
      rightList: [],
      tempList: [],
    };
  },
  watch: {
    value: {
      handler(nVal, oVal) {
        this.copyFlowList(nVal, oVal);
      },
      immediate: true,
    },
  },
  methods: {
    async copyFlowList(nVal, oVal) {
      // 取差值，即這一次數組變化的新增部分
      let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
      // 拼接上原有數據
      this.tempList = this.tempList.concat(this.cloneData(nVal.slice(startIndex)));
      // 開始處理數據
      this.processData();
    },
    async processData() {
      while (this.tempList.length > 0) {
        let leftRect = await this.$uGetRect('#u-left-column');
        let rightRect = await this.$uGetRect('#u-right-column');
        
        // 如果左邊小於或等於右邊，就添加到左邊，否則添加到右邊
        let item = this.tempList[0];
        if (!item) return;
        
        if (leftRect.height <= rightRect.height) {
          this.leftList.push(item);
        } else {
          this.rightList.push(item);
        }
        
        // 移除臨時列表的第一項
        this.tempList.splice(0, 1);
        
        // 等待指定的時間間隔
        await new Promise(resolve => setTimeout(resolve, this.addTime));
      }
    },
    cloneData(data) {
      return JSON.parse(JSON.stringify(data));
    },
    clear() {
      this.leftList = [];
      this.rightList = [];
      this.$emit('input', []);
    },
    remove(id) {
      let index = this.leftList.findIndex(val => val[this.idKey] == id);
      if (index != -1) {
        this.leftList.splice(index, 1);
      } else {
        index = this.rightList.findIndex(val => val[this.idKey] == id);
        if (index != -1) {
          this.rightList.splice(index, 1);
        }
      }
      index = this.value.findIndex(val => val[this.idKey] == id);
      if (index != -1) {
        this.$emit('input', this.value.filter(val => val[this.idKey] != id));
      }
    },
    modify(id, key, value) {
      let index = this.leftList.findIndex(val => val[this.idKey] == id);
      if (index != -1) {
        this.leftList[index][key] = value;
      } else {
        index = this.rightList.findIndex(val => val[this.idKey] == id);
        if (index != -1) {
          this.rightList[index][key] = value;
        }
      }
      index = this.value.findIndex(val => val[this.idKey] == id);
      if (index != -1) {
        let data = this.cloneData(this.value);
        data[index][key] = value;
        this.$emit('input', data);
      }
    },
  },
};
</script>

<style scoped>
.u-waterfall {
  display: flex;
  justify-content: space-between;
}

.u-column {
  width: 49%;
}
</style>