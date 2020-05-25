var app = getApp();
var util = require('../../utils/util');
var Bmob = require('../../utils/bmob.js')
Page({
	data: {
		hiddenGoods:true,
	},
	onLoad: function () {
		var that = this;
		that.getOrder();
		that.setData({
			scroll_height:wx.getSystemInfoSync().windowHeight * 0.6 - 45
		})
	},
	getOrder:function(){
		var that = this;
		util.showLoading();
   		var query = Bmob.Query('order');
   		query.equalTo("member_id",'==', wx.getStorageSync('userId'));
   		query.order('-createdAt');
   		query.find().then(function (results) {
			util.hideLoading();
			that.setData({
					order_list : results
				});
		}, function () {
			util.hideLoading();
		});
	},
	showMenu:function(e){
		var that = this;
		wx.showActionSheet({
			itemList: ['我要评论', '查看详情'],
			success(res) {
				if(res.tapIndex == 0){
					wx.navigateTo({
						url:'/page/mine/comments/index'
					});
				}else{
					that.getOrderDetail(e);
				}
			},
			fail(res) {
				console.log(res.errMsg)
			}
		})
	},
	getOrderDetail:function(e){
		var objectId = e.currentTarget.dataset.id;
		var that = this;
   		var query_goods = Bmob.Query("order_goods");
   		query_goods.equalTo("order_id",'==', objectId);
   		query_goods.find().then(function (results) {
			util.hideLoading();
			that.setData({
				GoodsList : results,
			});
			that.SHGoods();
		}, function () {
			util.hideLoading();
		});
	},
	SHGoods:function(){
		this.setData({
			hiddenGoods : !this.data.hiddenGoods
		});
	},
	onShow: function() {}
});

