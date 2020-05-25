// page/adminss/setting/index.js
var app = getApp();
var util = require('../../../utils/util');
var Bmob = require('../../../utils/bmob.js')
var objectId='';
var date = new Date();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userPic:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		util.showLoading();
		//验证
		var query = Bmob.Query('_User');
		var userId = wx.getStorageSync('userId');
		query.get(userId).then(function (todos) {
			console.log(todos);
			if(todos != undefined){
				that.setData({
					userInfo:todos,
					userPic:todos.userPic
				});
				util.hideLoading();
			}else{
				util.hideLoading();
			}
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
					util.showLoading();
					var name = date.getTime()+".jpg";//上传的图片的别名，建议可以用日期命名
					var file = Bmob.File(name,tempFilePaths[0]);
					file.save().then(function(res){
						console.log(res[0]);
						that.setData({
							userPic:res[0].url,
						})
						util.hideLoading();
					},function(error){
						util.hideLoading();
						console.log(error);
					})
				}
			}
		})
	},
	submit:function(e){
		var that = this;
		console.log(e);
		var value = e.detail.value;
		console.log(value.nickName.length);
		var phonereg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
		var schoolreg = /^[P][0-9]{9}$/; //验证规则
		if(value.nickName == ''){
			util.message('请输入昵称');
			return false;
		}else{
			util.showLoading();
			var query = Bmob.Query("_User");
			// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
			query.get(wx.getStorageSync('userId')).then(result => {
				console.log(result)
				result.set('nickName',value.nickName);
				result.set('userPic',that.data.userPic);
				result.save();
				util.showSuccess('保存成功');
				setTimeout(function(){
					wx.navigateBack({
						
					})
				},2000);
			}).catch(err => {
				console.log(err)
			})
		}
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