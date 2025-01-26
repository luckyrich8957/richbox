// 随机数据
const rom = (list) => {
  let len = list.length - 1
  let index = parseInt(Math.random() * len + 1)
  return list[index]
}
const  mock= [{
      src: "https://gtd.alicdn.com/sns_logo/i1/TB124_3NXXXXXasXVXXSutbFXXX.jpg_240x240xz.jpg",
    },
    {
      src: "https://gtd.alicdn.com/sns_logo/i7/TB1IWtgQFXXXXcmXFXXSutbFXXX.jpg_240x240xz.jpg",
    },
    {
      src: "https://gtd.alicdn.com/sns_logo/i1/TB1_f_PLXXXXXbVXpXXSutbFXXX.jpg_240x240xz.jpg",
    },
    {
      // 这里图片不存在，会加载失败，显示错误的占位图
      src: "xxx",
    },
  ]
  export const apiGoods = (list) => {
    list=list?list:mock
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const arr = new Array(10)
        resolve(arr.fill(1).map(item => rom(list)))
      }, 1000)
    });
  }
