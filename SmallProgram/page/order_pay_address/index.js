var app = getApp();
// pages/cart/cart.js
var util = require('../../utils/util');
var Bmob = require('../../utils/bmob.js')
var that = this;
Page({
	data: {
		personCountIndex: 0
	},
	onLoad: function (options) {
		that = this;
		that.loadAddress();
		that.getCart();
	},
	onShow: function () {
		var that = this;
		if (app.globalData.selectAdId != undefined) {
			that.getSelectedAddress(app.globalData.selectAdId);
			console.log(app.globalData.selectAdId);
		}else{
			that.loadAddress();
		}
	},
	selectAddress: function () {
		wx.navigateTo({
			url: '/page/address/list/list'
		});
	},
	getSelectedAddress: function (addressId) {
		console.log(addressId);
		// 回调查询地址对象
		var query = Bmob.Query("address");
		query.get(addressId).then(function (address) {
			that.setData({
				address: address
			});
		});
	},
	loadAddress: function () {
		var that = this;
		var query = Bmob.Query('address');
		query.equalTo("member_id",'==', wx.getStorageSync('userId'));
		query.order('-updatedAt');
		query.limit(1);
		query.find().then(function (addressObjects) {
			// 查到用户已有收货地址
			if (addressObjects.length > 0) {
				that.setData({
					address: addressObjects[0]
				});
			}else{
				that.setData({
					address: false
				});
			}
		});
	},
	// 获取购物车
	getCart: function () {
		var that = this;
		var that = this;
		console.log(111);
		var showCartList = [];
		//制作显示购物车的数据
		var cart_list = wx.getStorageSync('cart_list') || [];
		for (var i = 0; i < cart_list.length; i++) {
			showCartList.push(wx.getStorageSync('cart_goods_' + cart_list[i]));
		}
		if (showCartList.length > 0) {
			that.setData({
				showCartList: showCartList,
			});
		}
		that.countCart();
		console.log(that.data.showCartList);
	},

	countCart: function () {
		var that = this;
		var cart_list = wx.getStorageSync('cart_list');
		//制作购物车总数
		var count = 0,
			total = parseFloat(0);
		for (var i = 0; i < cart_list.length; i++) {
			var nowGoods = wx.getStorageSync('cart_goods_'+cart_list[i]);
			total += nowGoods.goods_price * nowGoods.num;
		};
		var cart = {
			count: parseInt(cart_list.length),
			total: total.toFixed(2),
		};
		that.setData({
			cart: cart
		});
		console.log(that.data.cart);
	},
	orderRemarks:function(e){
		var that = this;
		that.setData({
			remarks : e.detail.value,
		});
	},
	//支付
	doPay:function(e){

		var that = this;
		var address = that.data.address;

		console.log(address);
		console.log(address.realname);
		if(!address){
			util.message('请选择收货地址');
			return false;
		}
		const pointer = Bmob.Pointer('_User')
		const poiID = pointer.set(wx.getStorageSync('userId'));
		util.showLoading();
		var timestamp = (new Date()).valueOf();
		const diary = Bmob.Query('order_address');

		var cart_list = wx.getStorageSync('cart_list');
		var goods_images_arr = [];
		for (var i = 0; i < cart_list.length; i++) {
			var nowGoods = wx.getStorageSync('cart_goods_'+cart_list[i]);
			goods_images_arr.push(nowGoods.goods_image);
		};
		var allnum = cart_list.length;
		diary.set("member_id", wx.getStorageSync('userId'));
		diary.set("goods_num", parseInt(allnum));
		diary.set("goods_amount", parseFloat(that.data.cart.total));
		diary.set("order_amount", parseFloat(that.data.cart.total));
		if(that.data.remarks !== undefined)
			diary.set("remarks", that.data.remarks);
		diary.set("order_sn", timestamp.toString());
		diary.set("order_state", parseInt(2));
		diary.set("goods_images_arr", goods_images_arr);
		diary.set("address", address.objectId);
		diary.set("contact_name", address.realname);
		diary.set("contact_phone", address.mobile);
		diary.set("contact_address", address.area+address.detail);
		diary.set('userAttr', poiID);
		console.log(diary);

		//添加数据，第一个入口参数是null

		var diary_goods = Bmob.Query("order_goods");
		diary.save().then(function (orderCreated) {
			console.log(orderCreated);
			// 保存成功，调用支付
			that.AddGoods(orderCreated,0);
		}, function (res) {
			console.log(res)
			util.hideLoading();
			wx.showModal({
				title: '订单创建失败',
				showCancel: false
			})
		});
	},
	AddGoods:function(orderCreated,i){
		var that = this;
		var diary_goods = Bmob.Query("order_goods");
		var cart_list = wx.getStorageSync('cart_list');
		var allnum = cart_list.length;
		var nowGoods = wx.getStorageSync('cart_goods_'+cart_list[i]);

		var order_id = orderCreated.objectId;

		console.log('order_id:'+order_id);
		diary_goods.set("buyer_id", nowGoods.buyer_id);
		diary_goods.set("goods_id", nowGoods.goods_id);
		diary_goods.set("goods_image", nowGoods.goods_image);
		diary_goods.set("goods_name", nowGoods.goods_name);
		diary_goods.set("goods_price", parseFloat(nowGoods.goods_price));
		diary_goods.set("num", parseFloat(nowGoods.num));
		diary_goods.set("order_id", order_id);

		diary_goods.save().then(function (results) {
			console.log(results);
			// 保存成功，调用支付
			i++;
			if(i == allnum){
				//下单成功后更新商品销量
				that.UpdGoodsSale(0);
			}else{
				that.AddGoods(orderCreated,i);
			}
		}, function (res) {
			console.log(res)
			util.hideLoading();
			wx.showModal({
				title: '订单商品创建失败',
				showCancel: false
			})
		});

	},
	//更新销量
	UpdGoodsSale:function(i){
		var that = this;
		var cart_list = wx.getStorageSync('cart_list');

		var query = Bmob.Query('goods');
		query.containedIn("objectId", cart_list);
		query.find().then(function(todos) {
		    todos.forEach(function(todo) {
		    	var nowGoods = wx.getStorageSync('cart_goods_'+todo.objectId);
		    	var sale_num = parseInt(todo.sale_num) || 0 + parseInt(nowGoods.num);
		        todo.sale_num=sale_num;
		    });
		    todos.saveAll().then(res => {
				// 成功批量修改
				console.log(res,'ok')
				console.log('更新成功');
				util.message('下单成功，可在我的订单中查看',(err)=>{
					wx.navigateBack();
				});
				util.hideLoading();
			    for (var i = 0; i < cart_list.length; i++) {
			    	wx.removeStorageSync('cart_goods_'+cart_list[i]);
			    };
				wx.removeStorageSync('cart_list');
				// setTimeout(function(){
				// 	wx.navigateBack();
				// },2000);
			}).catch(err => {
				console.log(err)
			});;
		});

		return false;
	}
})