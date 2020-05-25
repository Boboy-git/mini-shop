// page/adminss/address/index/index.js
var app = getApp();
var util = require('../../../../utils/util');
var Bmob = require('../../../../utils/bmob.js')
var that;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		visual: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;
	},
	editArticle:function(e){
		wx.navigateTo({
			url: '../add/index?objectId=' + e.currentTarget.dataset.id
		})
		return false;
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
		that.getAddress();
	},
	getAddress: function () {
		util.showLoading();
		var query = Bmob.Query('goods');
		query.order('-createdAt');
		query.find().then(function (results) {
			util.hideLoading();
			that.setData({
				addressList: results,
				visual: results.length ? true : false
			});
		}, function () {
			util.hideLoading();
		});
	},
	edit: function (e) {
		var objectId = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '../add/index?objectId=' + objectId
		})
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
	add: function () {
		wx.navigateTo({
			url: '../add/index'
		});
	}
})