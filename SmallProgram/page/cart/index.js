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
		store_name_list:[],
		store_index:0,
	},
	onLoad: function (options) {
		var that = this;
	},
	onShow: function () {
		// this.setData({
		// 	classifySeleted: this.data.goodsList[0].id
		// });
		var that = this;
        that.showCartDetail();
        that.countCart();
	},

	tapAddCart: function (e) {
		var that = this;
		var goods_id = e.currentTarget.dataset.id;
		console.log(goods_id);
		var cart_list = wx.getStorageSync('cart_list') || [];
		if (cart_list.indexOf(goods_id) !== -1) {
			//有值，直接添加
			that.addCart(e.currentTarget.dataset.id);
		}
	},
	tapDelCart: function (e) {
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
	tapReduceCart: function (e) {
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
		that.setData({
			showCartList: showCartList,
		});
	},
	tapAdduceCart: function (e) {
		var that = this;
		that.tapAddCart(e);
		var index = e.currentTarget.dataset.key;
		var showCartList = that.data.showCartList;
		showCartList[index].num = parseInt(showCartList[index].num) + parseInt(1);
		that.setData({
			showCartList: showCartList,
		});
	},
	addCart: function (goods_id) {
		var goods = wx.getStorageSync('cart_goods_' + goods_id);
		var nowNum = parseInt(goods.num) + parseInt(1);
		goods.num = nowNum;
		console.log(goods);
		wx.setStorageSync('cart_goods_' + goods_id, goods);
		this.countCart();
	},
	countCart: function () {
		var that = this;
		//制作商品列表
		var cart_list = wx.getStorageSync('cart_list');
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
	tapClassify: function (e) {
		console.log(this.data.classgoods);
		var id = e.target.dataset.id;
		var that = this;
		that.setData({
			classifySeleted: id
		});
		that.getClassGoods();
	},
	showCartDetail: function () {
		var that = this;
		var showCartList = [];
		// if (that.data.showCartDetail == false) {
			//制作显示购物车的数据
			var cart_list = wx.getStorageSync('cart_list') || [];
			for (var i = 0; i < cart_list.length; i++) {
				showCartList.push(wx.getStorageSync('cart_goods_' + cart_list[i]));
			}
		// }
		console.log(showCartList);
			that.setData({
				showCartList: showCartList
			});
	},
	hideCartDetail: function () {
		this.setData({
			showCartDetail: false
		});
	},
	pay_now: function () {
		var that = this;
		if (that.data.showCartList.length >0){
			wx.navigateTo({
				url: '/page/order_pay_address/index'
			});
		}else{
			util.showSuccess('请先添加商品后下单','none');
		}
	},
	goInfo: function (e) {
		wx.navigateTo({
			url: '/page/info/index?objectId=' + e.currentTarget.dataset.id,
		});
	},
});