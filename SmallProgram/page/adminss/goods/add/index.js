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
		images_list:[],
		rec:1,
		hot:0,
		content:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;
		console.log();
		if (options.objectId) {
			that.loadGoods(options.objectId);
			that.setData({
				isEdit: true,
				objectId:options.objectId
			});
			wx.setNavigationBarTitle({
				title: '编辑商品'
			})
		} else {
			wx.setNavigationBarTitle({
				title: '添加商品'
			})
			that.loadClassify();
		}
	},
	loadClassify:function(){
		var that = this;
		util.showLoading();
		var query = Bmob.Query('classify');
		var conArray = [];
		query.find().then(function (results) {
			for (var i = 0; i < results.length; i++) {
				conArray.push(results[i].name);
				if (that.data.court != undefined){

					if (results[i].objectId == that.data.court.classify) {
						that.setData({
							conIndex: i
						});
					}
				}
			};
			that.setData({
				classifyList : results,
				classifyArray: conArray
			});
			util.hideLoading();
		});
	},
	loadGoods: function (objectId) {
		var that = this;
		util.showLoading();
		var query = Bmob.Query('goods');
		query.get(objectId).then(function (res) {
			that.setData({
				court: res,
				images_url : res.image,
				name : res.name,
				price: res.price,
				rec: res.rec,
				hot: res.hot,
				content : res.content,
				images_list:res.images_list || [],
			});
			that.loadClassify();
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
							images_url:res[0].url,
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
	// 添加现场图
	addPhotoList:function(){
		var that = this;
		util.showLoading();
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
						var images_list = that.data.images_list;
						images_list.push(res[0].url);
						that.setData({
							images_list:images_list,
						})
						util.hideLoading();
					},function(error){
						util.hideLoading();
						console.log(error);
					})
				}
			},
			fail:function(){
				util.hideLoading();
			},
		})
	},
	// 删除图片
	delImg: function (e) {
		var that = this;
		var index = e.currentTarget.dataset.index;
		console.log(index);
		var articleList = that.data.images_list;
		articleList.splice(index, 1);
		that.setData({
			images_list: articleList
		});
	},
	// 选择类别
	ChangeClassify:function(e){
		var that = this;
		that.setData({
			conIndex : e.detail.value,
		});
	},
	// 编辑名称
	ChangeName:function(e){
		var that = this;
		that.setData({
			name : e.detail.value,
		});
	},
	// 输入价格
	ChangePrice:function(e){
		var that = this;
		that.setData({
			price : e.detail.value,
		});
	},
	ChangeContent:function(e){
		var that = this;
		that.setData({
			content : e.detail.value,
		});
	},

	// 修改推荐
	tuijianChange:function(e){
		var that = this;
		that.setData({
			rec:e.detail.value == true ? 1 : 0,
		});
		console.log(that.data.rec);
	},// 修改推荐
	hotChange:function(e){
		var that = this;
		that.setData({
			hot:e.detail.value == true ? 1 : 0,
		});
		console.log(that.data.hot);
	},
	delete: function () {
		var that = this;
		// 确认删除对话框
		wx.showModal({
			title: '温馨提示',
			content: '确认删除该商品吗?',
			confirmColor: "#59A5F0",
			success: function (res) {
				if (res.confirm) {
					const query = Bmob.Query('goods');
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
		if (that.data.name == undefined || that.data.name == '') {
			util.message('请填写名称');
			return;
		}
		if (that.data.price == undefined || that.data.price == '') {
			util.message('请填写价格');
			return;
		}
		var reg = /(^[-+]?[1-9]\d*(\.\d{1,2})?$)|(^[-+]?[0]{1}(\.\d{1,2})?$)/;
		if (!reg.test(that.data.price)) {  
            util.message("价格必须为合法数字(正数，最多两位小数)！");  
            return false;  
        }
		var insert = {};
		var insert = Bmob.Query('goods');
		insert.set('image',that.data.images_url);
		insert.set('classify',that.data.classifyList[that.data.conIndex].objectId);
		insert.set('classify_name',that.data.classifyList[that.data.conIndex].name);
		insert.set('name',that.data.name);
		insert.set('price',that.data.price);
		insert.set('rec',parseInt(that.data.rec));
		insert.set('hot',parseInt(that.data.hot));
		insert.set('content',that.data.content);
		insert.set('images_list',that.data.images_list);

		
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