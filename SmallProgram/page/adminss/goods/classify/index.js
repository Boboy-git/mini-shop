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
		visual: false,
		upd_add_hidden:true,
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
		that.getClassify();
	},
	getClassify: function () {
		var that = this;
		that.setData({
			classifyList:[],
		});
		util.showLoading();
		var query = Bmob.Query('classify');
		query.find().then(function (results) {
			util.hideLoading();
			that.setData({
				classifyList: results,
				visual: results.length ? true : false
			});
		}, function () {
			util.hideLoading();
		});
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
	hideDiaLog:function(){
		var that = this;
		that.setData({
			upd_add_hidden:true,
			classify_name:'',
			upd_object_id:'',
		});
	},
	add: function () {
		var that = this;
		that.setData({
			upd_add_title:'新增分类',
			upd_add_hidden:false,
		});
	},
	edit: function (e) {
		var that = this;
		var upd_object_id = e.currentTarget.dataset.id;
		var classify_name = e.currentTarget.dataset.classify_name;
		that.setData({
			upd_add_title:'编辑分类',
			upd_add_hidden:false,
			upd_object_id:upd_object_id,
			classify_name:classify_name,
		});
	},
	ChangeClassifyName:function(e){
		var that = this;
		that.setData({
			classify_name : e.detail.value,
		});

	},
	upd_add_do:function(e){
		var that = this;
		var upd_object_id = e.currentTarget.dataset.id;
		var classify_name = that.data.classify_name;
		console.log(upd_object_id);
		if(upd_object_id != undefined && upd_object_id != '' && upd_object_id != null){
			console.log('修改');
			console.log(upd_object_id);
			//修改
			util.showLoading();
			var query = Bmob.Query('classify');
			query.get(upd_object_id).then(result => {
			  console.log(result)
			  	result.set('name',classify_name);
				result.save();
				that.hideDiaLog();
				util.showSuccess('编辑成功');
				setTimeout(function(){
					that.getClassify();
				},2000);
			}).catch(err => {
			  console.log(err)
			})
			
		}else{
			//添加
			console.log('添加');	
			const query = Bmob.Query('classify');
			query.set("name",classify_name)
			query.save().then(res => {
			  console.log(res)
			  	util.showSuccess('添加成功');
				that.hideDiaLog();
				that.getClassify();	
			}).catch(err => {
			  console.log(err)
			})
		}
	},
	del_do:function(e){
		var that = this;
		var objectId = e.currentTarget.dataset.id;
		console.log(objectId);
		wx.showModal({
			title: '温馨提示',
			content: '您确定要删除此分类吗？',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
					const query = Bmob.Query('classify');
					query.destroy(objectId).then(res => {
					  	console.log(res)
					  	that.hideDiaLog();
						that.getClassify();	
					}).catch(err => {
					  console.log(err)
					})
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	}
})