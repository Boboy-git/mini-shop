var app = getApp();
var util = require('../../../utils/util');
var Bmob = require('../../../utils/bmob.js')
var state_arr = {0:'全部',1:'待付款','2':'待发货',3:'待收货',4:'已完成'}
Page({
	data: {

	},
	onLoad: function (options) {
		var that = this;
		var objectId = options.objectId;
		console.log(objectId);
		that.setData({
			objectId : objectId
		});
		that.getOrder(objectId);
		that.getGoodsList(objectId);

		that.setData({
			scroll_height:wx.getSystemInfoSync().windowHeight * 0.6 - 45
		})
	},
	goDetail:function(e){
		wx.navigateTo({
			url: '/page/info/index?objectId='+e.currentTarget.dataset.id,
		})
	},
	getOrder:function(objectId){

		util.showLoading();
		var that = this;
		// var u = Bmob.Object.extend("order");
   		var query = Bmob.Query('order_address');
   		query.get(objectId).then(function(res) {
			var state = res.order_state;
			res.state_name = state_arr[state];
			console.log(res);
   			that.setData({
   				order_info : res,
   			});
		util.hideLoading();
		});
	},
	getGoodsList:function(objectId){
		
		util.showLoading();
		var that = this;
		// var u = Bmob.Object.extend("order_goods");
   		var query = Bmob.Query("order_goods");
   		query.equalTo("order_id",'==', objectId);
   		query.find().then(function(res) {
   			console.log(res);
   			that.setData({
   				goods_list : res,
   			});
		});
		util.hideLoading();
	},
	onShow: function() {}
});

