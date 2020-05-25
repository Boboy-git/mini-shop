// page/address/add/add.js
var app = getApp();
var util = require('../../../utils/util');
var Bmob = require('../../../utils/bmob.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        console.log();
        if (options.objectId) {
            that.loadAddress(options.objectId);
            that.setData({
                objectId: options.objectId,
                isEdit: true
            });
            wx.setNavigationBarTitle({
                title: '编辑地址'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '添加地址'
            })
        }
    },
    loadAddress: function(objectId) {
        var that = this;
        var query = Bmob.Query('address');
        query.get(objectId).then(function(addressObject) {
            that.setData({
                address: addressObject
            });
        });
    },
    delete: function() {
        var that = this;
        // 确认删除对话框
        wx.showModal({
            title: '温馨提示',
            content: '确认删除该地址吗?',
            confirmColor: "#59A5F0",
            success: function(res) {
                if (res.confirm) {
                    var address = that.data.address;
                    address.destroy().then(function(result) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '删除成功',
                            confirmColor: "#59A5F0",
                            showCancel: false,
                            success: function() {
                                wx.navigateBack();
                            }
                        });
                    });
                }
            }
        });

    },
    selectAddress: function() {
        var that = this;
        wx.chooseLocation({
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                console.log(res);
                that.setData({
                    area: res.address
                })
            },
            fail: function(err) {
                util.message('您已经拒绝地址授权，请前往小程序设置中打开定位，或者在小程序列表中删除该小程序后重新进入');
            }
        })
    },
    add: function(e) {
        var that = this;
        var form = e.detail.value;
        // console.log(form);
        // 表单验证
        if (form.realname == '') {
            util.message('请填写收货人姓名');
            return;
        }

        if (!(/^1[34578]\d{9}$/.test(form.mobile))) {
            util.message('请填写正确手机号码');
            return;
        }

        if (form.detail == '') {
            util.message('请填写详细地址');
            return;
        }

        form.gender = parseInt(form.gender);
        form.member_id = wx.getStorageSync('userId');
        var address = Bmob.Query('address');
        // 是否处在编辑状态
        if (that.data.isEdit) {
            // address.id = that.data.objectId; //需要修改的objectId
            address.set('id', that.data.objectId) //需要修改的objectId
        }
        address.save(form).then(function(res) {
            // console.log(res)
            wx.showModal({
                title: '温馨提示',
                content: '保存成功',
                confirmColor: "#59A5F0",
                showCancel: false,
                success: function() {
                    wx.navigateBack();
                }
            });
        }, function(res) {
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})