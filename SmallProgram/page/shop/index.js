var app = getApp();
var util = require('../../utils/util');
var Bmob = require('../../utils/bmob.js')
Page({
    data: {
        allgoods: [],
        goodsList: [],
        classifyList: [],
        cart: {
            count: 0,
            total: 0,
        },
        height_list: '20',
    },
    onLoad: function(options) {
        var that = this;
        that.getClassIfy();
        that.getGoodsList();
	},
	//跳转搜索页面
	onScearhTap: function (e) {
		wx.navigateTo({
			url: '/page/search/index',
		})
	},
    getClassIfy: function() {
        var that = this;
        util.showLoading();
        var query = Bmob.Query('classify');
        query.find().then(function(results) {
            util.hideLoading();
            that.setData({
                classifyList: results,
            });
            if (that.data.classifySeleted == undefined) {
                console.log(results[0]['objectId']);
                that.setData({
                    classifySeleted: results[0]['objectId']
                });
            }
            that.getClassGoods();
        }, function() {
            util.hideLoading();
        });
    },
    getClassGoods: function() {
        console.log('getClassGoods');
        util.showLoading();
        var that = this;
        var classifySeleted = that.data.classifySeleted;
        var query = Bmob.Query("goods");
        query.equalTo("classify", "==", classifySeleted);
        query.find().then(function(results) {
            util.hideLoading();
            that.setData({
                classgoods: results,
            });
            that.countCart(); //制作钱
        }, function() {
            util.hideLoading();
        });
    },
    getGoodsList: function() {
        var that = this;
        var query = Bmob.Query("goods");
        query.find().then(function(results) {
            util.hideLoading();
            that.setData({
                allgoods: results,
            });
        }, function() {
            util.hideLoading();
        });
    },
    onShow: function() {
        // this.setData({
        // 	classifySeleted: this.data.goodsList[0].id
        // });
        var that = this;
        that.getClassIfy();
        that.getGoodsList();
    },
    tapAddCart: function(e) {
        var that = this;
        var goods_id = e.currentTarget.dataset.id;
        console.log(goods_id);
        var cart_list = wx.getStorageSync('cart_list') || [];
        if (cart_list.indexOf(goods_id) !== -1) {
            //有值，直接添加
            that.addCart(e.currentTarget.dataset.id);
        } else {
            //无值，直接添加
            that.chooseOk(e);
        }
    },
    tapDelCart: function(e) {
        var that = this;
        var goods_id = e.currentTarget.dataset.id;

        var goods = wx.getStorageSync('cart_goods_' + goods_id);
        var nowNum = parseInt(goods.num) - parseInt(1);
        console.log(nowNum);
        if (nowNum < 1) {
            //减没了，相当于清空。
            //执行清空此商品操作。
            var cart_list = wx.getStorageSync('cart_list') || [];
            for (var i = 0; i < cart_list.length; i++) {
                if (cart_list[i] == goods_id) {
                    cart_list.splice(i, 1);
                    break;
                }
            }
            wx.setStorageSync('cart_list', cart_list)
            wx.removeStorageSync('cart_goods_' + goods_id);
        } else {
            goods.num = nowNum;
            console.log(goods);
            wx.setStorageSync('cart_goods_' + goods_id, goods);
        }
        that.countCart();
    },
	makeNavigate: function (e) {
		wx.navigateTo({
			url: e.currentTarget.dataset.url
		});
	},
    chooseOk: function(e) {
        var that = this;
        var goods_id = e.currentTarget.dataset.id;
        console.log(goods_id);
        //加入购物车统计
        var cart_list = wx.getStorageSync('cart_list') || [];
        cart_list.push(goods_id);
        wx.setStorageSync('cart_list', cart_list);
        //加入购物车统计
        //查询详情加入本地缓存
        var goods_list = that.data.allgoods;
        console.log(goods_list);
        for (var i = 0; i < goods_list.length; i++) {
            console.log(goods_list[i]);
            if (goods_list[i].objectId == goods_id) {
                var nowGoods = goods_list[i];
            }
        };
        var detail;
        var num = 1;
        var goods_name = nowGoods.name;
        if (wx.getStorageSync('vip') == 1) {
            var goods_price = parseFloat(nowGoods.vip_price).toFixed(2);
        } else {
            var goods_price = parseFloat(nowGoods.price).toFixed(2);
        }
        var goods_image = nowGoods.image;
        var goods_id = goods_id;
        var buyer_id = wx.getStorageSync('userId');
        var detail = {
            'goods_id': goods_id,
            'buyer_id': buyer_id,
            'goods_name': goods_name,
            'goods_price': goods_price,
            'goods_image': goods_image,
            'num': num
        };
        wx.setStorageSync('cart_goods_' + goods_id, detail);

        that.countCart();
    },
    tapReduceCart: function(e) {
        var that = this;
        that.tapDelCart(e);
        var index = e.currentTarget.dataset.key;
        var showCartList = that.data.showCartList;
        showCartList[index].num = parseInt(showCartList[index].num) - parseInt(1);
        if (showCartList[index].num < 1) {
            for (var i = 0; i < showCartList.length; i++) {
                if (i == index) {
                    showCartList.splice(i, 1);
                    break;
                }
            }
        }
        var now_height = showCartList.length * 51;
        if (now_height > 250) {
            that.setData({
                height_list: 280
            });
        } else {
            that.setData({
                height_list: parseInt(now_height) + parseInt(30)
            });
        }
        that.setData({
            showCartList: showCartList,
        });
    },
    tapAdduceCart: function(e) {
        var that = this;
        that.tapAddCart(e);
        var index = e.currentTarget.dataset.key;
        var showCartList = that.data.showCartList;
        showCartList[index].num = parseInt(showCartList[index].num) + parseInt(1);
        that.setData({
            showCartList: showCartList,
        });
    },
    addCart: function(goods_id) {
        var goods = wx.getStorageSync('cart_goods_' + goods_id);
        var nowNum = parseInt(goods.num) + parseInt(1);
        goods.num = nowNum;
        console.log(goods);
        wx.setStorageSync('cart_goods_' + goods_id, goods);
        this.countCart();
    },
    countCart: function() {
        var that = this;
        //制作商品列表
        var goods_list = that.data.classgoods;
        var cart_list = wx.getStorageSync('cart_list');
        for (var i = 0; i < goods_list.length; i++) {
            var goods_id = goods_list[i].objectId;
            console.log(goods_id);
            if (cart_list.indexOf(goods_id) !== -1) {
                // 购物车中有值
                // 重新制作列表
                var nowGoods = wx.getStorageSync('cart_goods_' + goods_id);
                console.log(parseInt(nowGoods.num));
                goods_list[i]['cart_num'] = parseInt(nowGoods.num);
            } else {
                goods_list[i]['cart_num'] = 0;
            }
        };
        that.setData({
            classgoods: goods_list,
        });
        //制作购物车总数
        var count = 0,
            total = parseFloat(0);
        console.log(cart_list);
        for (var i = 0; i < cart_list.length; i++) {
            var nowGoods = wx.getStorageSync('cart_goods_' + cart_list[i]);
            count += nowGoods.num;
            total += nowGoods.goods_price * nowGoods.num;
        };
        var cart = {
            count: parseInt(count),
            total: total.toFixed(2),
        };
        that.setData({
            cart: cart
        });
        if (parseInt(count) == 0) {
            that.hideCartDetail();
        }
    },
    tapClassify: function(e) {
        console.log(this.data.classgoods);
        var id = e.target.dataset.id;
        var that = this;
        that.setData({
            classifySeleted: id
        });
        that.getClassGoods();
    },
    showCartDetail: function() {
        var that = this;
        console.log(111);
        var showCartList = [];
        if (that.data.showCartDetail == false) {
            //制作显示购物车的数据
            var cart_list = wx.getStorageSync('cart_list') || [];
            for (var i = 0; i < cart_list.length; i++) {
                showCartList.push(wx.getStorageSync('cart_goods_' + cart_list[i]));
            }
        }
        console.log(showCartList);
        if (showCartList.length > 0) {
            var now_height = showCartList.length * 51;
            console.log(showCartList.length);
            if (now_height > 250) {
                that.setData({
                    height_list: 280
                });
            } else {
                that.setData({
                    height_list: parseInt(now_height) + parseInt(30)
                });
            }
            that.setData({
                showCartList: showCartList,
                showCartDetail: !that.data.showCartDetail
            });
        } else {
            that.hideCartDetail();
        }
    },
    hideCartDetail: function() {
        this.setData({
            showCartDetail: false
        });
    },
    pay_now: function() {
		wx.navigateTo({
			url: '/page/order_pay_address/index'
		});
    },
    MakeCollection: function(e) {
        var goods_id = e.currentTarget.dataset.id;
        var goods_name = e.currentTarget.dataset.name;
        var goods_thumb = e.currentTarget.dataset.thumb;
        var that = this;
        var u = Bmob.Object.extend("collection");
        var query = new Bmob.Query(u);
        query.equalTo("goods_id", goods_id);
        query.equalTo("member_id", wx.getStorageSync('userId'));
        query.first({
            success: function(result) {
                if (result) {
                    var objectId = result.id;
                    //取消收藏
                    wx.showModal({
                        title: '操作提示',
                        content: '确定要取消收藏吗？',
                        success: function(res) {
                            if (res.confirm) {
                                var Diary = Bmob.Object.extend("collection");
                                //创建查询对象，入口参数是对象类的实例
                                var query = new Bmob.Query(Diary);
                                query.get(objectId, {
                                    success: function(object) {
                                        // The object was retrieved successfully.
                                        object.destroy({
                                            success: function(deleteObject) {
                                                // that.onLoad();
                                                util.showSuccess('取消成功');
                                            },
                                            error: function(object, error) {
                                                // that.onLoad();
                                            }
                                        });
                                    },
                                    error: function(object, error) {
                                        console.log("query object fail");
                                    }
                                });
                            }
                        }
                    })
                } else {
                    //添加收藏
                    var Diary = Bmob.Object.extend("collection");
                    var diary = new Diary();
                    diary.set("member_id", wx.getStorageSync('userId'));
                    diary.set("goods_id", goods_id);
                    diary.set("goods_name", goods_name);
                    diary.set("goods_thumb", goods_thumb);
                    //添加数据，第一个入口参数是null
                    diary.save(null, {
                        success: function(result) {
                            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                            util.showSuccess('收藏成功');
                        },
                        error: function(result, error) {
                            // 添加失败
                            util.message('收藏失败，请稍候再试');

                        }
                    });
                }
            }
        });
    }
});