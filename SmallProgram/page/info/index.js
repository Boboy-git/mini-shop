var app = getApp();
// pages/cart/cart.js
var util = require('../../utils/util');
var Bmob = require('../../utils/bmob.js')
var pageTo=0;
Page({
    data: {
		showHidFen:true,
    },
    onLoad: function(options) {
		pageTo = 0;
        var that = this;
		that.setData({
			objectId: options.objectId != undefined ? options.objectId : 0,
		});
        that.getDetail(options.objectId);
    },
	goCart:function(){
		wx.switchTab({
			url:'/page/cart/index'
		});
	},
    getDetail: function(objectId) {
        var that = this;
		util.showLoading();
        var objectId = objectId != undefined ? objectId : 'WwBM222I';
        // 获取问题详情
        const query = Bmob.Query('goods');
		query.get(objectId).then(res => {
            // console.log(res)
			util.hideLoading();
            that.setData({
                articleInfo: res
            });
            var read_num = res.read_num !== undefined ? res.read_num : 0;
            var now_num = parseInt(read_num) + parseInt(1);
            res.set('read_num',now_num);
  			res.save();
        }).catch(err => {
            console.log(err)
        })
    },
    // 加入购物车
    tapAddCart:function(e){
        var that = this;
        util.showLoading();
        var goods_id = e.currentTarget.dataset.id;
        console.log(goods_id);
        var cart_list = wx.getStorageSync('cart_list') || [];
        if(cart_list.indexOf(goods_id) !== -1){
            //有值，直接添加
            that.addCart(goods_id);
        }else{
            //无值，显示口味
            that.chooseOk(e);
        }
    },
    // 实行加入购物车
    addCart: function (goods_id) {
        var that = this;
        var goods = wx.getStorageSync('cart_goods_'+goods_id);
        var nowNum = parseInt(goods.num) + parseInt(1);
        goods.num = nowNum;
        console.log(goods);
        wx.setStorageSync('cart_goods_'+goods_id,goods);
        util.showSuccess('加入购物车成功','none');
    },
    chooseOk:function(e){
        var that = this;
        var goods_id = e.currentTarget.dataset.id;
        console.log(goods_id);
        //加入购物车统计
        var cart_list = wx.getStorageSync('cart_list') || [];
        cart_list.push(goods_id);
        wx.setStorageSync('cart_list',cart_list);
        //加入购物车统计
        var nowGoods = that.data.articleInfo;
        var detail;
        var num = 1;
        var goods_name = nowGoods.name;
        if(wx.getStorageSync('vip') == 1){
            var goods_price = parseFloat(nowGoods.vip_price).toFixed(2);
        }else{
            var goods_price = parseFloat(nowGoods.price).toFixed(2);
        }
        var goods_image = nowGoods.image;
        var goods_id = goods_id;
        var buyer_id = wx.getStorageSync('userId');
        var detail = {'goods_id':goods_id,'buyer_id':buyer_id,'goods_name':goods_name,'goods_price':goods_price,'goods_image':goods_image,'num':num};
        wx.setStorageSync('cart_goods_'+goods_id,detail);
        util.showSuccess('操作成功');
    },
	/**
     * 用户点击右上角分享
     */
	onShareAppMessage: function () {
		var that = this;
		return {
			title: that.data.articleInfo.name,
			path: '/page/index/index?objectId='+that.data.articleInfo.objectId,
		}
	}

})