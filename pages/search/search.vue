<template>
  <view>
    <view class="input">
      <u-search style='flex:1' search-icon-color="#c2c2c3" v-model="keyWord" placeholder="搜搜看您感兴趣的商品" shape='square'
                :input-style='{fontSize:"26rpx"}' :show-action='false'></u-search>
      <view class="btn" @click="()=>{uid=0;btnClick()}">搜索</view>
    </view>
    <block v-if='!isSearch'>
      <view class='del'>
        <view class="title">
          历史搜索
        </view>
        <view class="icon" @click="del" v-if="tagList.length!==0">
          <u-icon class='u-m-r-20' name="https://manghe.jikechaowan.com/image/shape.png" size='30rpx'></u-icon>

        </view>
      </view>
      <view class="kong" v-if="tagList.length===0">
        暂无搜索记录
      </view>
      <view class="tag" v-else v-for="(item,index) in tagList" :key="index" @click="tagClick(item)">
        {{ item }}
      </view>
      <view class="title u-m-t-30">
        热门搜索
      </view>
      <view class="tag" @click="tagClick(item)" v-for="(item,index) in hotList" :key='item.id'>
        {{item.kewords}}
      </view>
    </block>
    <block v-else>
      <mescroll-uni ref="mescrollRef" @init="mescrollInit" top="110" @down="downCallback" :up="upOption"
                    @up="upCallback" @emptyclick="emptyClick">
        <view class="box">
          <good v-for="(item,index) in goods" :good='item' :index='index' :key='index'/>
          <view v-if='goods.length%2!==0'></view>
        </view>

      </mescroll-uni>
    </block>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import {apiGoods} from "@/common/mock.js"
import good from '@/components/good.vue'

export default {
  mixins: [MescrollMixin], // 使用mixin
  components: {
    good
  },
  
  data() {
    return {
      isSearch: false,
      keyWord: '',
	  uid:0,
      tagList: [],
      curKeyWord: '',
      upOption: {
        // page: {
        // 	size: 10 // 每页数据的数量
        // },
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: '~ 搜索无数据 ~', // 提示
          btnText: '去看看'
        }
      },
	  hotList:[],
      goods: [], //列表数据
    };
  },
  onLoad(P) {
    if (P.keyWord) {
      this.isSearch = true;
      this.curKeyWord = this.keyWord=P.keyWord;
    } else {
      this.isSearch = false;
    }
	this.init()
    this.tagList = this.$cache('seachList') || []
  },
  methods: {
	 async init(){
		const {data:{list}}= await this.$store.dispatch('blind_getHotSearch')
		this.hotList=list
	  },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
		
		const parmse={
			page:page.num,
			keywords:this.curKeyWord,
		}
		if(this.uid){
			parmse.keywords_id=this.uid
		}
		
      //联网加载数据
      this.$store.dispatch('blind_getBlindList',parmse).then(res => {
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(res.data.list.length);
		console.log(res.data.list);
        //设置列表数据
        if (page.num == 1) this.goods = []; //如果是第一页需手动制空列表
        this.goods = this.goods.concat(res.data.list); //追加新数据
      }).catch(() => {
        //联网失败, 结束加载
        this.mescroll.endErr();
      })
    },
    //点击空布局按钮的回调
    emptyClick() {
      uni.showToast({
        title: '点击了按钮,具体逻辑自行实现'
      })
    },
    del() {
      //  弹窗 询问是否删除
      uni.showModal({
        title: '提示',
        content: '确定要全部历史删除吗？',
        success: (res) => {
          if (res.confirm) {
            this.tagList = []
            this.$cache('seachList', this.tagList)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    },
    tagClick(item) {
		if(typeof item ==='object'){
			this.keyWord=item.kewords
			this.uid=item.id
		return this.btnClick()
		}else{
			this.id=0
		}
      this.keyWord = item.toString()
        this.btnClick()
    },
    btnClick() {
      if (this.keyWord.trim()) {
        //查询有没有这个关键字 有加入列表插到第一个 没有就插到第一个
        let index = this.tagList.indexOf(this.keyWord)
        if (index == -1) {
          this.tagList.unshift(this.keyWord)
        } else {
          this.tagList.splice(index, 1)
          this.tagList.unshift(this.keyWord)
        }
        this.$cache('seachList', this.tagList)
        this.curKeyWord = this.keyWord
        if (this.isSearch) {
          this.$nextTick(() => {
            this.mescroll.resetUpScroll()
          })
        } else {
          this.isSearch = true
        }
      } else {
        if (this.isSearch) {
          this.isSearch = false
        } else {
          uni.showToast({
            title: '请输入搜索内容',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  }
}
</script>

<style>
	page {
		box-sizing: border-box;
	  background-color: #fafafa;
	  padding: 10rpx 16rpx 0rpx;
	}
</style>
<style lang="scss" scoped>


.box {
  display: flex;
  margin: 0 16rpx;
  justify-content: space-between;
  flex-wrap: wrap;
}

.kong {
  //  空布局
  text-align: center;
  color: #999;
  font-size: 30rpx;
  margin-top: 50rpx;
}

.tag {
  display: inline-block;
  margin: 10rpx 10rpx 10rpx 0rpx;
  padding: 10rpx 15rpx;
  background: #EEEEEE;
  border-radius: 6rpx;
  font-size: 24rpx;
  font-family: PingFangSC;
  font-weight: 400;
  color: #333333;
}

.input {
  display: flex;
  align-items: center;
  height: 64rpx;
	padding-left: 20rpx;
  /deep/ .u-icon {
    margin: 0 10rpx;
  }

  .btn {
    font-size: 32rpx;
    width: 120rpx;
    text-align: center;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
  }
}

.title {
  font-size: 28rpx;
  margin: 10rpx 0;
  font-family: PingFangSC;
  font-weight: 600;
  color: #333333;
}

.del {
  margin: 50rpx 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon {
    width: 60rpx;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
