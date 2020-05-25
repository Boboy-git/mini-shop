var app = getApp();
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js');
Page({
	data: {},
	onLoad: function () {
		var that = this;
	},
	onShow: function () {
		var that = this;
		const query = Bmob.Query('_User');
		query.get(wx.getStorageSync('userId')).then(res => {
            // console.log(res)
            that.setData({
                userInfo: res
            });
        }).catch(err => {
            console.log(err)
        })
	},
	ToUserVip:function(){
		var that = this;
		if(wx.getStorageSync('vip') == 1){
			util.message('您已经享用全场会员价,请勿重复操作');
		}else{
			wx.showModal({
				title: '温馨提示',
				content: '您确定要支付'+that.data.StoreInfo.vip_price+'元成为会员吗？',
				success(res) {
					if (res.confirm) {
						console.log('用户点击确定')
						const query = Bmob.Query('_User');
						query.get(wx.getStorageSync('userId')).then(res => {
				            // console.log(res)
				            res.set('vip',1);
				            res.save();
				            wx.getStorageSync('vip',1);
				            util.message('恭喜您，已经成为会员，将享用全场会员价');
				        }).catch(err => {
				            console.log(err)
				        })
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		}
	},
});

