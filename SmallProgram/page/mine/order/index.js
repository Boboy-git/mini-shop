var app = getApp();
var util = require('../../../utils/util');
var Bmob = require('../../../utils/bmob.js')
var state_arr = {
    0: '全部',
    1: '待付款',
    '2': '待发货',
    3: '待收货',
    4: '已完成'
}
Page({
    data: {
        hiddenGoods: true,
    },
    onLoad: function(options) {
        var that = this;

        util.showLoading();
        that.setData({
            order_state: options.order_state
        });
        if (options.order_state) {
            that.getOrder(options.order_state);
        } else {
            that.getOrder();
        }
    },
    getOrder: function(type) {
        var that = this;

        // var u = Bmob.Object.extend("order_address");
        var query = Bmob.Query('order_address');
        query.equalTo("member_id", '==', wx.getStorageSync('userId'));
        if (type != undefined && type != 1) {
            query.equalTo("order_state", '==', parseInt(type));
        }
        query.include('userAttr')
        query.order('-createdAt');
        query.find().then(function(todos) {
            todos.forEach(function(todo) {
                var state = todo.order_state;
                todo.state_name = state_arr[state];
            });
            that.setData({
                order_list: todos
            });
            util.hideLoading();
            console.log(todos);
        });
    },
    GoDetail: function(e) {
        wx.navigateTo({
            url: '../order_detail/index?objectId=' + e.currentTarget.dataset.id
        });
    },
    getOrderList: function(e) {
        var that = this;
        util.showLoading();
        var order_state = e.currentTarget.dataset.type;
        that.getOrder(order_state);
        that.setData({
            order_state: order_state
        });
        console.log(order_state);
    },

    changeOrder: function(e) {
        var that = this;
        var objectId = e.currentTarget.dataset.id;
        var cgst = e.currentTarget.dataset.cgst;
        const query = Bmob.Query('order_address');
        query.get(objectId).then(res => {
            console.log(res)
            res.set('order_state', parseInt(cgst))
            res.save().then(res => {
                util.showSuccess('操作成功');
                setTimeout(function() {
                    that.getOrder(that.data.order_state);
                }, 2000);
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    },
    // 删除订单
    changeOrderState: function(e) {
        var that = this;
        if (e.currentTarget.dataset.type == 1) {
            var title = '取消';
        } else {
            var title = '删除';
        }
        util.confirm('您确定要' + title + '该订单吗', function(res) {
			if(res.confirm){
				const query = Bmob.Query('order_address');
				query.destroy(e.currentTarget.dataset.id).then(res => {
					console.log(res)
					util.showSuccess('操作成功');
					setTimeout(function () {
						that.getOrder(that.data.order_state);
					}, 2000);
				}).catch(err => {
					console.log(err)
				})
			}
        })
    },
    onShow: function() {}
});