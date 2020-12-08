const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    info: "",
    point: "",
    price: "",
    type: "",
    id:"",
    count:[],
    num:"",
tag:"",
  },
  onLoad:function(e){
    
    var that=this;
    const db = wx.cloud.database()
    // 查询已经在数据中的所有数据
    db.collection('USER').where({}).get({
      success: res => {
      this.setData({
      count: res.data,
      id:e.id,
  })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    
  },
  complete:function(e){
    var that=this;
      
    const db = wx.cloud.database()
    db.collection('USER').doc(e.currentTarget.dataset.id).remove({
      success: function (res) {
        wx.showToast({
          title: '提交成功',
          duration:2000
        })
        console.log("提交成功")
      },
      fail:function(res){
          wx.showToast({
            title:"提交失败",
            duration:2000
          })
      },
  
    })
    wx.switchTab({
      url: '/pages/answer1/answer1'})
    
      
      
    

  },

 bindanswer:function(e){
  
   if(this.data.count[this.data.id].tag=="接受")
   {this.setData({
    
   });
   	const db = wx.cloud.database();
 	/**
     * 更新集合counters中的数据
     */
   	db.collection('USER').doc(this.data.count[this.data.id]._id).update({
  		data:{
  			tag:"取消"
    	}
   	}).then(res=>{
    	
   	})
}
   else{
     this.setData({
       
     }) 	
     const db = wx.cloud.database();
     /**
       * 更新集合counters中的数据
       */
       db.collection('USER').doc(this.data.count[this.data.id]._id).update({
        data:{
          tag:"接受"
        }
       }).then(res=>{
        
       })
   }
   

   wx.navigateTo({
     url: '/pages/answer2/answer2?id='+this.data.id
   })
  
 },


 back:function(){
  wx.switchTab({
    url: '/pages/answer1/answer1'
  })
 },

 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
      
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})