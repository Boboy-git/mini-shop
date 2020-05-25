var app = getApp();
var util = require('../../utils/util');
var Bmob = require('../../utils/bmob.js')
function getToday() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
// type  1 - 可预定，显示可预订数量，2-未取消3次，显示无机器，3-已取消3次，不可使用预定
Page({
	data: {
		type:1,
		today:'',
		currentTab:0,
	},
	
	onLoad: function (options) {
		var that = this;
		if(options.objectId !== undefined){
			wx.navigateTo({
				url: '/page/info/index?objectId='+options.objectId,
			})
		}
		wx.getSystemInfo({
            success: (res) => {
                that.setData({
                    pixelRatio: res.pixelRatio,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            },
        })
	},

	// 获取banner
	getBanner:function(){
		var that = this;
		util.showLoading();
		var query = Bmob.Query('banner');
		query.order('-createdAt');
		query.find().then(function (results) {
			util.hideLoading();
			that.setData({
				bannerList: results,
			});
		}, function () {
			util.hideLoading();
		});
	},

	getHotNews:function(){
		var that = this;
		util.showLoading();
		var query = Bmob.Query('goods');
		query.order('-read_num');
		query.order('createdAt');
		query.equalTo("hot", '==', parseInt(1) );
		query.limit(3);
		query.find().then(res => {
			util.hideLoading();
			that.setData({
				hot_goods_list: res
			});
			util.hideLoading();
			console.log(res);
		});
	},
	getNews:function(){
		var that = this;
		util.showLoading();
		var query = Bmob.Query('goods');
		query.order('-read_num');
		query.order('-createdAt');
		query.equalTo("rec", '==', parseInt(1) );
		query.find().then(res => {
			util.hideLoading();
			that.setData({
				goods_list: res
			});
			util.hideLoading();
			console.log(res);
		});
	},
	GoDetail:function(e){
		wx.navigateTo({
			url:'/page/detail/index?objectId='+e.currentTarget.dataset.id,
		});
	},
    makeNavigate:function(e){
    	wx.navigateTo({
    		url:e.currentTarget.dataset.url
    	});
    },
    
	//跳转搜索页面
	onScearhTap: function (e) {
		wx.navigateTo({
			url: '/page/search/index',
		})
	},
	onShow: function() {
		var that = this;
		that.getBanner();
		that.getNews(); // 获取推荐商品
		that.getHotNews(); // 获取热销
	},
});