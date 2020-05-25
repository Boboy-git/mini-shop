// page/msg/index.js
var app = getApp();
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
	data: {

	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {

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
		that.getUserInfo();
	},
	getUserInfo: function () {
		var that = this;
		const query = Bmob.Query('_User');
		query.get(wx.getStorageSync('userId')).then(res => {
			// console.log(res)
			that.setData({
				userInfo: res
			});

			that.getComments();
		}).catch(err => {
			console.log(err)
		})
	},
	// 获取最新的聊天列表
	getComments: function () {
		var that = this;
		// 获取问题详情
		util.showLoading();
		const query = Bmob.Query('comments');
		query.order('-createdAt');
		query.include('userAttr');
		query.find().then(res => {
			// console.log(res)
			util.hideLoading();
			that.setData({
				datacomments: res
			});
		}).catch(err => {
			console.log(err)
		})
	},
	makecommentsTap: function (e) {
		var that = this;
		if (e.detail.value == undefined || e.detail.value == '') {
			util.message('请填写评论内容');
			return;
		}
		const pointer = Bmob.Pointer('_User')
		const poiID = pointer.set(wx.getStorageSync('userId'));
		var insert = {};
		var insert = Bmob.Query('comments');
		insert.set('content', e.detail.value);
		insert.set('userAttr', poiID);
		console.log(insert);
		insert.save().then(function (res) {
			// console.log(res)
			util.showSuccess('发布成功');
			that.setData({
				content: '',
			});
			setTimeout(function () {
				that.getComments();
			}, 2000);
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
	del_comments_btn: function (e) {
		var that = this;
		var id = e.currentTarget.dataset.id;
		var index = e.currentTarget.dataset.index;
		console.log(index);
		console.log(id);
		wx.showModal({
			title: '温馨提示',
			content: '您确定要删除此评论吗',
			success(res) {
				if (res.confirm) {
					util.showLoading();
					const query = Bmob.Query('comments');
					query.destroy(id).then(res => {
						console.log(res)
						util.hideLoading();
						var comments = that.data.datacomments;
						comments.splice(index, 1);
						that.setData({
							datacomments: comments
						});
						util.showSuccess('删除成功');
					}).catch(err => {
						console.log(err)
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
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

	}
})