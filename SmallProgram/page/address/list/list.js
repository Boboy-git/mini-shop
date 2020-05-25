// page/address/list/list.js
var app = getApp();
var util = require('../../../utils/util');
var Bmob = require('../../../utils/bmob.js')
var that;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		visual: 'hidden'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this;
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
		var query = Bmob.Query('address');
		query.equalTo('member_id','==', wx.getStorageSync('userId'));
		query.find().then(function (results) {
			that.setData({
				addressList: results,
				visual: results.length ? 'hidden' : 'show'
			});
		});
	},
	edit: function (e) {
		var objectId = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '../add/add?objectId=' + objectId
		})
	},
	selectAddress: function (e) {
		app.globalData.selectAdId = e.currentTarget.dataset.id;
		wx.navigateBack();
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
			url: '../add/add'
		});
	}
})