// page/adminss/address/add/index.js
var app = getApp();
var util = require('../../../../utils/util');
var Bmob = require('../../../../utils/bmob.js')
var date = new Date();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		images_url:'/images/addlivephoto.png',
		classifyArray: [],
		conIndex:0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		console.log();
		if (options.objectId) {
			that.loadAddress(options.objectId);
			that.setData({
				isEdit: true,
				objectId:options.objectId,
			});
			wx.setNavigationBarTitle({
				title: '编辑banner'
			})
		} else {
			wx.setNavigationBarTitle({
				title: '添加banner'
			})
		}
	},
	loadAddress: function (objectId) {
		var that = this;
		util.showLoading();
		var query = Bmob.Query('banner');
		query.get(objectId).then(function (res) {
			that.setData({
				court: res,
				images_url : res.image,
			});
			util.hideLoading();
		});
	},
	// 添加现场图
	addPhoto:function(){
		var that = this;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				var tempFilePaths = res.tempFilePaths;
				console.log(tempFilePaths);
				if(tempFilePaths.length>0){
					var name = date.getTime()+".jpg";//上传的图片的别名，建议可以用日期命名
					var file = Bmob.File(name,tempFilePaths[0]);
					file.save().then(function(res){
						console.log(res[0]);
						that.setData({
							images_url:res[0].url,
						})
					},function(error){
						console.log(error);
					})
				}
			}
		})
	},
	delete: function () {
		var that = this;
		// 确认删除对话框
		wx.showModal({
			title: '温馨提示',
			content: '确认删除该banner吗?',
			confirmColor: "#59A5F0",
			success: function (res) {
				if (res.confirm) {
					const query = Bmob.Query('banner');
					query.destroy(that.data.objectId).then(res => {
					  wx.showModal({
							title: '温馨提示',
							content: '删除成功',
							confirmColor: "#59A5F0",
							showCancel: false,
							success: function () {
								wx.navigateBack();
							}
						});
					}).catch(err => {
					  console.log(err)
					})
				}
			}
		});

	},
	add: function (e) {
		var that = this;
		var form = e.detail.value;
		// 表单验证
		if (that.data.images_url == '/images/addlivephoto.png') {
			util.message('请上传图片');
			return;
		}
		var insert = {};
		var insert = Bmob.Query('banner');
		insert.set('image',that.data.images_url);
		
		// 是否处在编辑状态
		if (that.data.isEdit) {
			 insert.set('id', that.data.court.objectId) //需要修改的objectId
		}
		console.log(insert);
		insert.save().then(function (res) {
			// console.log(res)
			wx.showModal({
				title: '温馨提示',
				content: '保存成功',
				confirmColor: "#59A5F0",
				showCancel: false,
				success: function () {
					wx.navigateBack();
				}
			});
		}, function (res) {
			// console.log(res)
			wx.showModal({
				title: '温馨提示',
				content: '保存失败',
				confirmColor: "#59A5F0",
				showCancel: false
			});
		});
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

	}
})