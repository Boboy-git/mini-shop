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
		searchValue:'',
	},
	
	onLoad: function (options) {
		var that = this;
		wx.getSystemInfo({
            success: (res) => {
                that.setData({
                    pixelRatio: res.pixelRatio,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            },
        })
		that.getAllNews(); // 获取菜品
	},

	getAllNews: function () {
		var that = this;
		util.showLoading();
		var query = Bmob.Query('goods');
		query.limit(1000);
		query.find().then(res => {
			util.hideLoading();

			var search_objectid = [];
			for (var i = 0; i < res.length; i++) {
				search_objectid.push(res[i].objectId);
			};
			that.setData({
				all_article_list: res,
				search_objectid: search_objectid,
			});
			util.hideLoading();
			console.log(res);
			that.getNews(); // 获取商品
		});
	},

	getSearch: function () {
		var that = this;
		util.showLoading();
		console.log(that.data.searchValue);
		var all_article_list = that.data.all_article_list;
		var search_objectid = [];
		for (var i = 0; i < all_article_list.length; i++) {
			console.log(all_article_list[i].name.indexOf(that.data.searchValue));
			if (all_article_list[i].name.indexOf(that.data.searchValue) !== -1) {
				search_objectid.push(all_article_list[i].objectId);
			}
		};
		that.setData({
			search_objectid: search_objectid,
		});
		console.log(search_objectid);
		that.getNews();
	},
	makeSearchValue:function(e){
		var that = this;
		that.setData({
			searchValue: e.detail.value
		});
	},
	getNews:function(){
		var that = this;
		util.showLoading();
		var query = Bmob.Query('goods');
		query.containedIn("objectId", that.data.search_objectid);
		query.order('-createdAt');
		query.limit(1000);
		query.find().then(res => {
			util.hideLoading();
			that.setData({
				article_list: res
			});
			util.hideLoading();
			console.log(res);
		});
	},
	makeNavigate:function(e){
		wx.navigateTo({
			url: e.currentTarget.dataset.url,
		});
	},
	onShow: function() {
		var that = this;
	},
});