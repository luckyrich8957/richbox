<template>
  <view class="u-p-t-20">
    <view class="label">
      * 问题类型
    </view>
    <view class="tags">
      <view v-for="(item,index) in tags" :key='index' :class="{tag:true,on:currentOn === item.id}"
            @click="currentOn = item.id">
        {{ item.tag }}
      </view>
    </view>
    <view class="label">
      * 问题描述
    </view>
    <view class="textarea1">
      <u-input v-model="content"
               :auto-height="false"
               :clearable='false' :height="248" placeholder="请详细描述问题" placeholderStyle="font-size: 24rpx;font-family: PingFangSC;font-weight: 400;color: #B8B8BA;" type="textarea"/>
    </view>
    <view class="label">
      上传图片
    </view>
    <view class="upload">
      <u-upload ref="uUpload" :action="action" :custom-btn="true" :header="header" :max-count='3'
                :show-progress="false" :show-upload-list="showUploadList">
        <view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
          <u-icon color="#c0c4cc" name="plus" size="77"></u-icon>
        </view>
      </u-upload>
    </view>

    <view class="fixed safe-area-inset-bottom" @click="submit">
      <view class='btn'>
        提交
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showUploadList: true,
      // 如果将某个ref的组件实例赋值给data中的变量，在小程序中会因为循环引用而报错
      // 这里直接获取内部的lists变量即可
      lists: [],
      tags: [],
      content: '',
      currentOn: '',
    };
  },
  onShow() {
    this.getTagList()
  },
  computed: {
    action() {
      return this.$Config.APP_CONFIG.UPLOAD
    },
    header() {
      return {
        Authorization: "Bearer " + this.$store.state.token
      }
    }
  },
  onReady() {
    // 得到整个组件对象，内部图片列表变量为"lists"
    this.lists = this.$refs.uUpload.lists;
  },
  methods: {
    submit() {
      if (!this.currentOn) return this.$toast('请选择反馈的类型!')
      let params = {
        content: this.content,
        feed_type: 'complaint',
        tag_ids: JSON.stringify([this.currentOn])
      }
      if (this.lists.length) {
        params.images = this.lists.reduce((result, item, index) => {
          if (item.response && item.response.code === 200) {
            result.push(item.response.data.url)
          }
          return result;
        }, [])
        params.images = JSON.stringify(params.images)
      }
      this.$store.dispatch('my_createFeedBack', params).then((res) => {
        this.$t('感谢您的反馈，我们将竭尽全力改善的服务', () => {
          uni.navigateBack();
        })
      }).catch((res) => {
        this.$toast(res.msg)
      })

    },
    getTagList() {
      this.$store.dispatch('my_getTagListByGroupId', {id: 1}).then((res) => {
        this.tags = res.data.list.map(item => ({
          tag: item.tag_name,
          id: item.id
        }))

      })
    }
  }

}
</script>

<style>
page {
  background-color: #fafafa;
  padding-top: 45 rpx;
  padding-bottom: 120 rpx;
}
</style>
<style lang="scss" scoped>
.label {
  margin-bottom: 35rpx;
  padding: 0 15rpx;
  line-height: 1;
  font-size: 32rpx;
  font-family: PingFangSC;
  font-weight: 500;
  color: #333333;
}

.tags {
  padding: 0 16rpx;
  display: grid;
  grid-template-columns: 166rpx 166rpx 166rpx 166rpx;
  grid-gap: 18rpx;
  margin-bottom: 68rpx;

  // grid-column-gap: 18rpx;
  .tag {
    width: 166rpx;
    height: 80rpx;
    border: 2rpx solid #EEEEEE;
    border-radius: 12rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333
  }

  .on {
    background-color: #333;
    color: #fff;
    border: none;
  }
}

.upload {
  margin: 0 16rpx;

  /deep/ .u-list-item {
    margin: 10rpx;
  }
}

.textarea1 {
  width: 718rpx;
  height: 300rpx;
  background: #EEEEEE;
  border-radius: 16rpx;
  margin: 0 16rpx 67rpx;
  padding: 15rpx 26rpx;
}

.slot-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200rpx;
  height: 200rpx;
  background: #FAFAFA;
  border: 2rpx dashed #C7C7CB;
  border-radius: 16rpx;
}

.slot-btn__hover {
  background-color: rgb(235, 236, 238);
}

.pre-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.pre-item {
  flex: 0 0 48.5%;
  border-radius: 10rpx;
  height: 140rpx;
  overflow: hidden;
  position: relative;
  margin-bottom: 20rpx;
}

.pre-item-image {
  width: 100%;
  height: 140rpx;
}

.fixed {
  background-color: #fafafa;
  position: fixed;
  z-index: 99;
  height: 110rpx;
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
</style>
