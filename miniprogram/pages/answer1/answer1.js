
Page({
 

  data: {
   type:"",
   price:"",
   count:[],
  num:"",
  id:"",
  wangyi:[],

  },
 
  buttonListener:function(e){
    
    var that = this
    
    
     let id= e.currentTarget.id

    wx.navigateTo({
      url: '/pages/answer2/answer2?id='+ id
    })
    this.setData({
    num:e.currentTarget.id
  })
  
  },

  




  onShow:function(){
    var that=this;
    const db = wx.cloud.database()
    // 查询已经在数据中的所有数据
    db.collection('USER').where({}).get({
      
      success: res => {
      this.setData({
      count: res.data,
  })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      },
      
    })
    wx.request({
      url: 'http://api.tianapi.com/txapi/hotreview/index', //仅为示例，并非真实的接口地址
      method:"GET",
      data: {
       key:'0246cc057e4c5655fa185b42b1340fb0'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(self) {
        console.log(self.data.newslist[0].source)
        that.setData({
       wangyi:self.data.newslist
     })
      }
    })
  },
  onShareAppMessage: function (res) {
    if(res.from === 'button') {
    // 来自页面内转发按钮
    return {
      title: '好兄弟快来帮帮我',}
  }},
 
})
