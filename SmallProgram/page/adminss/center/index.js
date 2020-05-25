// pages/usercenter/usercenter.js
var app = getApp();
var util = require('../../../utils/util');
var Bmob = require('../../../utils/bmob.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: '',
		tq_img:'none.png',
		last_plan:0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
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
		var that = this;                      
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
	do_logout:function(){
		//确认注册
		wx.showModal({
			title: '温馨提示',
			content: '确定要退出吗？',
			success: function(res) {
				if (res.confirm) {
					util.showLoading();
					wx.removeStorageSync('admin_login');
					util.showSuccess('退出成功');
					setTimeout(function(){
						wx.reLaunch({
							url: '/page/adminss/login/index'
						});
					},2000);
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		})
	},
	showSettingMenu:function(){
		var itemList = ['密码修改', '常规设置'];
		var that = this;
		wx.showActionSheet({
			itemList: itemList,
			success: function(res) {
				if(res.tapIndex == 0){
					wx.navigateTo({
						url: '/page/adminss/setting/pwd/index',
					})
				}else{
					wx.navigateTo({
						url: '/page/adminss/setting/index',
					})
				}
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		})
	},
	showAddressMenu:function(){
		var itemList = ['分类管理', '商品管理'];
		var that = this;
		wx.showActionSheet({
			itemList: itemList,
			success: function(res) {
				if(res.tapIndex == 0){
					wx.navigateTo({
						url: '/page/adminss/goods/classify/index',
					})
				}else{
					wx.navigateTo({
						url: '/page/adminss/goods/index/index',
					})
				}
			},
			fail: function(res) {
				console.log(res.errMsg)
			}
		})
	},
})