<template>
  <u-popup v-model='_show' :closeable="true" border-radius="40" mode='bottom'>
    	<zero-loading v-if="loading" type="circle"></zero-loading>
	<view class="image-div">
				   <image @click="loadData" class="img-s" src="https://manghe.jikechaowan.com/image/img/refesh.png"  mode="aspectFit" ></image>
	</view>
	<view class="content">
      <view class="title">
        <image @click="loadData" class="img-title" src="https://manghe.jikechaowan.com/image/img/title.png"  mode="aspectFit" ></image>
      </view>
	  <view class="info">
		  <view class="info-center">
			  <text class="num-title">当前进行至</text>
			  <text class="num-info">NO.{{totalCount}}</text>
		  </view>
	  </view>
	  <scroll-view  :scrollTop="scrollTop" :scroll-y="true" :class="{'scroll':true,'divh1':true}" @scrolltolower="scrolltoGetMore" @scroll="onscroll">
	     <view class="box-list">
			 <view class="box-list-item box-list-item-img"  v-for="(record,index2) in recordList">
				 <view class="box-list-item-box">
					 <view class="box-list-item-box-left">
						  <text class="box-list-item-box-left-topmsg  box-msg box-title">{{record.nickname}}</text>
						  <image class="rimg" :src="record.reward_name_info.img" style="width: 50rpx;height: 50rpx;"></image>
						  <!-- <text class="box-list-item-box-left-bmsg   box-msg box-info">限量新年可爱小兔子摆件一个</text> -->
					 </view>
					 <view class="box-list-item-box-left">
					 						  <text class="box-list-item-box-left-bmsg   box-msg box-info">获得：<text style="color: black;">{{getRecordName(record.reward_name)}}</text></text>
					 						  <text class="box-info">{{record.create_time}}</text>
					 						  <!--  -->
					 </view>
					 <view class="box-list-item-box-left">
					 						  <text style="width: 1px;"></text>
											  <text class="box-info" v-if="record.box_win_num > 0">第{{record.box_win_num}}发</text>
					 						  <!--  -->
					 </view>
					
				 </view>
			 </view>
		 </view>
	    <u-loadmore :status="recordStatus"/>
	  </scroll-view>
	  </swiper-item>
	  </swiper>
    </view>
     
  </u-popup>
</template>

<script>
import UImage from "../uview-ui/components/u-image/u-image";

export default {
  components: {UImage},
  data() {
    return {
      status: 'loadmore',
	  recordStatus: 'loadmore',
      one: false,
      curPage: 1,
	  recordPage: 100,
      total_page: 1,
      imgsList: [],
	  tabList:[{
					name: '奖品详情'
				}, {
					name: '中奖记录'
				}],
	  swiperCurrent:0,
	  current:1,
	  barStyle:{
		  backgroundColor:'#f45942',
		  height:'10rpx'
	  },
	  recordList:[],
	  loading:false,
	  totalCount:0,
	  scrollTop:0,			 
	  countTotal:0	
	};
  },
 
  methods: {
	
	  onscroll({target:{scrollTop}}){
		  this.scrollTop = scrollTop
	  },
	  loadData(){
		  this.loading = true
		  this.tabsChange(1).then(()=>{
			  this.scrollTop = 0
			  this.loading =  false
		  })
	  },
	  scrolltoGetMore(){
		  if (this.recordStatus != 'loadmore') return;
		  this.recordPage++
		  this.getRecord()
	  },
	tabsChange(index) {
				this.swiperCurrent = index;
				this.current = index
				this.recordPage = 1
				this.recordStatus = 'loadmore'
				return this.getRecord()
				
			},
			getRecord(){
			  return this.$store.dispatch('blind_getRecord',{
					 blind_goods_id:this.uid,
					 // page:72
					 page:this.recordPage
				}).then((res)=>{
					let {data} = res
					let list = data.list
					this.totalCount = data.total
					this.countTotal = data.total
					if (list.length < 10) {
					  this.recordStatus = 'nomore';
					} else {
					  this.recordStatus = 'loadmore'
					}
					if(this.recordPage > 1){
						this.recordList = [...this.recordList, ...list];
					}else {
						this.recordList = list
					}
					 
				})
			},
			transition(e) {
							let dx = e.detail.dx;
							this.$refs.uTabs.setDx(dx);
						},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		},
    async scrolltolower() {
      if (this.status != 'loadmore') return;
      this.curPage++;
      const {data} = await this.$store.dispatch('blind_selectRewardList', {
        page: this.curPage,
        id: this.uid, //商品ID
        type: this.type === 'integral' ? 3 : 1,
        page_size: 10,
      })
      if (this.curPage) {
        if (data.list.length < 10) {
          this.status = 'nomore';
        } else {
          this.status = 'loadmore'
        }
        this.imgsList = [...this.imgsList, ...data.list];
      }

    },
  },
  props: {
    total_goods: {
      type: Array,
      default: () => {
        return [];
      },
    },
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'coins',
    },
    uid: {
      type: String,
      default: ''
    },
	isTab:{
		type:Boolean,
		default:()=>{
			return true
		}
	}
  },
  onShow() {
	 
	  // this.$refs.uTabs.scrollByIndex();
  },
  watch: {
    value() {
      if (this.value) {
        this.one = true;
      }
    },
    async one() {
      
    },
	recordList:{
		handler(data,odata){
			//检测到重复的坐标，以及值
			let maxSize = data.length -1
			let info = data.reduce((result,item,index)=>{
				if(item.sort_field == 999999999999){
					result.push({box_win_num:item.box_win_num})
				}
				return result
			},[])
			console.log("info",info);
			this.countTotal = parseInt(JSON.parse(JSON.stringify(this.totalCount)))
			data = data.map((item,index)=>{
				console.log("item.sort_field",item.sort_field);
				if(item.sort_field != 999999999999){ //不是传说
				      //查找是否在传说的列表之内
					  let num = parseInt(JSON.parse(JSON.stringify(this.countTotal))) 
					  let exsit = info.find((item2,index2)=>{
						  return item2.box_win_num == num
					  })
					  
					  if(exsit){
						   //有则替换
						   this.countTotal = exsit.box_win_num -1
						   item.box_win_num = exsit.box_win_num -1
					  }else{ //如果没有则可以使用
						  item.box_win_num = num
					  }
					    this.countTotal--;
					  
				}
				return item;
			})
		},
		immediate:true,
		deep:true
	}
  },
  computed: {
	  checkDouble(){
	  		 return (index,data)=>{
				 let maxSize = this.recordList.length
				 if(index+1 <= maxSize - 1 &&  this.recordList[index+1].box_win_num == this.recordList[index].box_win_num){
					
					  return true;
				 }
				 return false
			 }
	  },
	  getRecordName(){
	  	return (record_name)=>{
	  		return record_name.length > 15 ? (record_name.substring(0,15)+ '...') : record_name
	  	}
	  } ,
    icon() {
      switch (this.type) {
        case "coins":
          return "https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/img_11.png";
        case "integral":
          return "https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/img_24.png";
        default:
          return "https://smiaoshen.oss-cn-hangzhou.aliyuncs.com/image/img_11.png";
      }
    },

    _show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
		if(val)this.tabsChange(1)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
	.img-s{
		height: 90rpx;
		width: 90rpx;
	}
	.img-title{
		height: 32rpx;
		width: 100%;
	}
	.info{
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
		padding: 20rpx 60rpx;
	}
	.info-center{
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
	}
	.box-title{
		font-size: 28rpx !important;
		font-weight: 600;
	}
	.box-info{
		color: #a7a7a7;
	}
	.rimg{
		width: 102rpx !important;
		height: 34rpx !important;
	}
	.box-list-item:not(:first-child){
		margin-top: 20rpx;
	}
	.divh0{
		height: 567rpx;
	}
	.divh1{
		height: 567rpx;
	}
	.image-div{
		position: absolute;
		top: 48%;
		left: 3%;
		z-index: 9999;
	}
	.num-info{
		font-size: 32rpx;
		margin-left: 15rpx;
		color: #c68273;
		font-weight: 500;
	}
	.num-title{
		color: #414141;
		font-size: 24rpx;
	}
.content {
  height: 1000rpx;
  padding: 80rpx 38rpx 20rpx;
  display: flex;
  flex-direction: column;
  position: relative;	
  .scroll {
    flex: 1;
    &-item {
      display: flex;
      margin-bottom: 26rpx;

      .item-r {
        padding: 10rpx 0 10rpx 20rpx;

        .item-title {
          font-size: 28rpx;
          height: 70rpx;
          font-family: PingFangSC;
          font-weight: 300;
          color: #333333;
          line-height: 38rpx;
        }

        .item-tag {
          margin-top: 10rpx;

          padding: 20rpx;
          height: 32rpx;
          font-size: 22rpx;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          font-family: PingFangSC;
          font-weight: 400;
          color: #FFFFFF;
          background: #DDA822;
          border-radius: 4rpx;
        }

        .num {
          display: flex;
          margin-top: 10rpx;
          align-items: center;
          font-size: 22rpx;
          font-family: PingFangSC;
          font-weight: 400;
          color: #B8B8BA;

          text {
            font-size: 30rpx;
            font-family: HelveticaNeue;
            font-weight: normal;
            color: #0C0C0C;
          }
        }
      }
    }
    .box-list{
		font-size: 24rpx;
		&-item{
			padding: 0 20rpx;
			&-img{
				background-image: url("https://manghe.jikechaowan.com/image/bk.png");
				height: 150rpx;
				width: 100%;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				
			}
			&-box{
				display: flex;
				justify-content: center;
				height: 100%;
				flex-direction: column;
				&-left{
					width: 100%;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					&-topmsg{
						
					}
					.box-msg{
						padding: 4rpx;
					}
				}
				
			}
		}
	}
  }

  .scroll-view {
    padding: 30rpx 0;
    width: 100%;
    border-radius: 12rpx;
    display: flex;
    margin: 40rpx 0;
    gap: 30rpx 0rpx;
    flex-wrap: wrap;
    border: 1px solid #eee;
    // padding-bottom:20rpx;
    box-shadow: 0 16rpx 16rpx rgba(10, 16, 20, 0.24), 0 0 16rpx rgba(10, 16, 20, 0.12);

    .more {
      flex: 1 !important;
    }

    .border {
      border-left: 1px solid #eee;
    }

    .item2 {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 20%;

      text {
        margin-top: 20rpx;
      }
    }

    .item {

      height: 180rpx;

      &-top {
        padding: 0 10rpx;
        height: 70rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1A184C;
        font-size: 28rpx;
        font-family: YouSheBiaoTiHei;
        font-weight: 400;
        color: #FFFFFF;
      }

      &-bottom {
        padding: 0 10rpx;
        height: 110rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24rpx;
        font-family: PingFangSC;
        font-weight: 400;
        color: #333333;
        background-color: #fafafa;
      }
    }
  }

  .title {
    font-size: 36rpx;
    line-height: 1;
    font-family: PingFangSC;
    font-weight: 500;
    color: #333333;
    text-align: center;
  }

}
</style>
