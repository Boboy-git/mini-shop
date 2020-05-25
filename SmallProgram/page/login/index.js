// pages/mine/login/index.js
var app = getApp();
var util = require('../../utils/util');
var Bmob = require('../../utils/bmob.js')
var backRoute = '';

function checkTarbar() {
    var tarbar = [
        'page/index/index',
        'page/mine/index',
    ];
    for (var i in tarbar) {
        if (tarbar[i] == backRoute) {
            return true;
        } else {
            return false;
        }
    }
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        login_hidden: true,
    },
    getUserInfo: function(res) {
        var that = this;
        util.showLoading();
        var that = this;
        console.log(res);
        console.log(res.detail.errMsg);
        if (res.detail.errMsg != 'getUserInfo:fail auth deny') {
            console.log('登录成功');
            that.getUserInfoBasic(res.detail);
        }
    },
    getUserInfoBasic: function(result) {
        console.log(result);
        var that = this;
        const query = Bmob.Query('_User');
        query.get(wx.getStorageSync('userId')).then(res => {
            // console.log(res)
            res.set('nickName', result.userInfo.nickName);
            res.set("userPic", result.userInfo.avatarUrl);
			res.set("vip", 0);
            wx.setStorageSync('nickName', result.userInfo.nickName);
            wx.setStorageSync('userPic', result.userInfo.avatarUrl);
			wx.setStorageSync('vip', 0);
            res.save().then(function(){
                util.showSuccess('登录成功');
                setTimeout(function(){
                    that.getBack();
                },2000);
            });

        }).catch(err => {
            console.log(err)
        })

    },
    getBack: function() {
        var that = this;
        if (checkTarbar()) {
            wx.switchTab({
                url: '/' + backRoute,
            });
        } else {
            wx.reLaunch({
                url: '/' + backRoute,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        backRoute = options.route != undefined ? options.route : 'page/index/index';
        if (app.globalData.par_path) {
            backRoute = backRoute + '?' + app.globalData.par_path
        }
        // var user = new Bmob.User(); //开始注册用户

        var newOpenid = wx.getStorageSync('openid')
        var userId = wx.getStorageSync('userId')

        util.showLoading('登录中...');
        if (!newOpenid || !userId) {
            Bmob.User.auth().then(user => {
                console.log(user)
                console.log('一键登陆成功')
                wx.setStorageSync('userId', user.objectId);
                wx.setStorageSync('nickName', user.nickName);
                wx.setStorageSync('userPic', user.userPic);
				wx.setStorageSync('vip', user.vip);
                if (user.nickName) {
                    // 第二次访问

                    wx.setStorageSync('openid', user.openid)
                    that.getBack();
                } else {
                    util.hideLoading();
                    that.setData({
                        login_hidden: false,
                    });
                }
            }).catch(err => {
                console.log(err)
            });
            console.log(111);

        } else {
            that.getBack();
        }


    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
})