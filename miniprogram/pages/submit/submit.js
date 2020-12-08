var app = getApp();
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
    productID: 0,
    category: [],
    categoryInd: -1, //类别
    checkUp: true, //判断从编辑页面进来是否需要上传图片
    chooseViewShowDetail: true,
    chooseViewShowBanner: true,
    params: {
      productID: 0,
      contentFile: "",
      bannerFile: "",
      check: false,
    },
    dis: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },
  /**
   * 获取标题
   */
  titleBlur(e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * 获取商品价格
   */
  priceBlur(e) {
    this.setData({
      price: e.detail.value
    })
  },
  /**
   * 获取商品信息
   */
  infoBlur(e) {
    this.setData({
      info: e.detail.value
    })
  },
  /**
   * 获取商品卖点
   */
  pointBlur(e) {
    this.setData({
      point: e.detail.value
    })
  },
  /** 
   * 商品价格
   */

  typeBlur(e) {
    console.log(e)
    this.setData({
      type:e.detail.value
    })
  },
 
  
 
  /**获取商品详情 */
  getProductDetail() {
    let params = {
      userID: app.globalData.userID,
      productID: this.data.productID
    }
    app.getReleaseProductDetail(params).then(res => {
      let product = res.data.productDetail[0]
      if (product.state) {
        this.setData({
          stateInd: 1
        })
      } else {
        this.setData({
          stateInd: 0
        })
      }
 
    
 
      if (product.bannerImages.length >= 2) {
        this.setData({
          chooseViewShowBanner: false
        })
      } else {
        this.setData({
          chooseViewShowBanner: true
        })
      }
 
      if (product.detailImages.length >= 3) {
        this.setData({
          chooseViewShowDetail: false
        })
      } else {
        this.setData({
          chooseViewShowDetail: true
        })
      }
      this.setData({
        title: product.title,
        info: product.info,
        point: product.point,
        typeInd: product.productType,
        price: product.currentPrice,
        banner: product.bannerImages,
        detail: product.detailImages,
      
      })
    })
  },
 
  /**发布提交 */
  formSubmit(e) {
    let that = this
    var priceTF = /^\d+(\.\d{1,2})?$/
    if (e.detail.value.title === "") {
      wx.showToast({
        title: '请输入商品名称',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.title.length > 60) {
      wx.showToast({
        title: '商品名称不得大于60字',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.title.length === "") {
      wx.showToast({
        title: '请输入商品价格',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (!priceTF.test(e.detail.value.price)) {
      wx.showToast({
        title: '商品价格精确到两位',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.info === "") {
      wx.showToast({
        title: '请输入商品信息',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.point === "") {
      wx.showToast({
        title: '请输入内容',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    
    } else if (that.data.typeInd === -1) {
      wx.showToast({
        title: '请选择商品类型',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.stateInd === -1) {
      wx.showToast({
        title: '请选择商品状态',
        icon: "none",
        duration: 1000,
        mask: true,
      })
   
    } else {
      let params = {
        userID: app.globalData.userID,
        productID: that.data.productID,
        title: e.detail.value.title,
        price: e.detail.value.price,
        info: e.detail.value.info,
        point: e.detail.value.point,
       

      }
      wx.showModal({
        title: '提示',
        content: '确定发布商品',
        success(res) {
          if (res.confirm) {
            if (that.data.productID != 0) {
              that.sureEdit(params); //编辑
            } else {
              that.sureRelease(params); //发布
            }
            that.setData({
              dis: true,
            })
          }
        }
      })
    }
  },
 
  /**确认发布 */
  sureRelease(params) {
    let that = this
    app.addProduct(params).then(res => {
      that.data.params.productID = res.data.productID;
      that.data.params.bannerFile = res.data.bannerFile;
      that.data.params.contentFile = res.data.contentFile;
      for (var i = 0; i < that.data.banner.length; i++) {
        wx.uploadFile({
          url: app.globalData.baseUrl + '/wechat/release/addProductPhoto',
          filePath: that.data.banner[i],
          name: 'banner',
          formData: {
            'parameters': JSON.stringify(that.data.params)
          },
        })
        if (that.data.banner.length === i + 1) {
          for (var j = 0; j < that.data.detail.length; j++) {
            if (that.data.detail.length === j + 1) {
              that.data.params.check = true
            }
            wx.uploadFile({
              url: app.globalData.baseUrl + '/wechat/release/addProductPhoto',
              filePath: that.data.detail[j],
              name: 'detail',
              formData: {
                'parameters': JSON.stringify(that.data.params)
              },
              success: function(res) {
                if (JSON.parse(res.data).state === 1) {
                  wx.showToast({
                    title: '商品发布成功',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                } else {
                  wx.showToast({
                    title: '商品发布失败，请稍后再试',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                }
              },
              fail: function(res) {
                if (JSON.parse(res.errMsg) === "request:fail socket time out timeout:6000") {
                  wx.showToast({
                    title: '请求超时，请稍后再试！',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                }
              }
            })
          }
        }
      }
    })
  },
 
  /**确认编辑 */
  sureEdit(params) {
    let that = this
    app.addProduct(params).then(res => {
      that.data.params.productID = res.data.productID;
      //判断编辑页面下是否只改变了文字数据，选择图片后checkUp为false
      if (that.data.checkUp && res.state === 1) {
        wx.showToast({
          title: '商品修改成功',
          icon: "none",
          duration: 2000,
          mask: true,
          success() {
            setTimeout(function() {
              wx.navigateBack({
                delta: 0,
              })
            }, 1000);
          }
        })
      }
      //判断编辑页面下是否改变了图片 改变了则uploadFile
      else {
        that.checkBanner();
        that.checkDetail();
        //如果没有添加直接删除图片的话
        if (that.data.bannerAll.length === 0 && that.data.detailAll.length === 0) {
          wx.showToast({
            title: '商品修改成功',
            icon: "none",
            duration: 2000,
            mask: true,
            success() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 0,
                })
              }, 1000);
            }
          })
        }
        //只改变bannerAll情况下,detailAll为空直接将bannerAll往数据库写入
        else if (that.data.detailAll.length === 0) {
          for (var i = 0; i < that.data.bannerAll.length; i++) {
            if (that.data.bannerAll.length === i + 1) {
              that.data.params.check = true
            }
            wx.uploadFile({
              url: app.globalData.baseUrl + '/wechat/release/addProductPhoto',
              filePath: that.data.bannerAll[i],
              name: 'banner',
              formData: {
                'parameters': JSON.stringify(that.data.params)
              },
              success: function(res) {
                if (JSON.parse(res.data).state === 1) {
                  wx.showToast({
                    title: '商品修改成功',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                } else {
                  wx.showToast({
                    title: '商品修改失败',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                }
              },
              fail(res) {
                if (JSON.parse(res.errMsg) === "request:fail socket time out timeout:6000") {
                  wx.showToast({
                    title: '请求超时，请稍后再试！',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                }
              }
            })
          }
        }
        //只改变detailAll，不改变bannerAll的情况下，直接将detailAll写入数据库
        else if (that.data.bannerAll.length === 0) {
          for (var j = 0; j < that.data.detailAll.length; j++) {
            if (that.data.detailAll.length === j + 1) {
              that.data.params.check = true
            }
            wx.uploadFile({
              url: app.globalData.baseUrl + '/wechat/release/addProductPhoto',
              filePath: that.data.detailAll[j],
              name: 'detail',
              formData: {
                'parameters': JSON.stringify(that.data.params)
              },
              success: function(res) {
                if (JSON.parse(res.data).state === 1) {
                  wx.showToast({
                    title: '商品修改成功',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                } else {
                  wx.showToast({
                    title: '商品修改失败',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                }
              },
              fail: function(res) {
                if (JSON.parse(res.errMsg) === "request:fail socket time out timeout:6000") {
                  wx.showToast({
                    title: '请求超时，请稍后再试！',
                    icon: "none",
                    duration: 2000,
                    mask: true,
                    success() {
                      setTimeout(function() {
                        wx.navigateBack({
                          delta: 0,
                        })
                      }, 1000);
                    }
                  })
                }
              }
            })
          }
        }
        //如果detailAll和bannerAll都改变的情况下
        else {
          for (var i = 0; i < that.data.bannerAll.length; i++) {
            wx.uploadFile({
              url: app.globalData.baseUrl + '/wechat/release/addProductPhoto',
              filePath: that.data.bannerAll[i],
              name: 'banner',
              formData: {
                'parameters': JSON.stringify(that.data.params)
              },
            })
            if (that.data.bannerAll.length === i + 1) {
              for (var j = 0; j < that.data.detailAll.length; j++) {
                if (that.data.detailAll.length === j + 1) {
                  that.data.params.check = true
                }
                wx.uploadFile({
                  url: app.globalData.baseUrl + '/wechat/release/addProductPhoto',
                  filePath: that.data.detailAll[j],
                  name: 'detail',
                  formData: {
                    'parameters': JSON.stringify(that.data.params)
                  },
                  success: function(res) {
                    if (JSON.parse(res.data).state === 1) {
                      wx.showToast({
                        title: '商品修改成功',
                        icon: "none",
                        duration: 2000,
                        mask: true,
                        success() {
                          setTimeout(function() {
                            wx.navigateBack({
                              delta: 0,
                            })
                          }, 1000);
                        }
                      })
                    } else {
                      wx.showToast({
                        title: '商品修改失败',
                        icon: "none",
                        duration: 2000,
                        mask: true,
                        success() {
                          setTimeout(function() {
                            wx.navigateBack({
                              delta: 0,
                            })
                          }, 1000);
                        }
                      })
                    }
                  },
                  fail: function(res) {
                    if (JSON.parse(res.errMsg) === "request:fail socket time out timeout:6000") {
                      wx.showToast({
                        title: '请求超时，请稍后再试！',
                        icon: "none",
                        duration: 2000,
                        mask: true,
                        success() {
                          setTimeout(function() {
                            wx.navigateBack({
                              delta: 0,
                            })
                          }, 1000);
                        }
                      })
                    }
                  }
                })
              }
            }
          }
        }
      }
    })
  },
 
  /**判断轮播新旧数组是否有相同值 */
  checkBanner() {
    let banner = this.data.banner
    let bannerNew = this.data.bannerNew
    let bannerAll = this.data.bannerAll
    for (var i = 0; i < banner.length; i++) {
      for (var j = 0; j < bannerNew.length; j++) {
        if (banner[i] === bannerNew[j]) {
          bannerAll = bannerAll.concat(bannerNew[j])
          this.setData({
            bannerAll: bannerAll
          })
        } else {
          console.log("banner无相同")
        }
      }
    }
  },
 
  /**判断详情新旧数组是否有相同值 */
  checkDetail() {
    let detail = this.data.detail
    let detailNew = this.data.detailNew
    let detailAll = this.data.detailAll
    for (var i = 0; i < detail.length; i++) {
      for (var j = 0; j < detailNew.length; j++) {
        if (detail[i] === detailNew[j]) {
          detailAll = detailAll.concat(detail[i])
          this.setData({
            detailAll: detailAll
          })
        } else {
          console.log("detail无相同")
        }
      }
    }
  },

 


  sureSubmit:function(e){
    console.log(e)
   var db=wx.cloud.database()
      db.collection("USER").add({
       data:{
    title:this.data.title,
    info:this.data.info,
    point:this.data.point,
    price:this.data.price,
    type:this.data.type,
    tag:"接受"
   }
 })
}

})
 