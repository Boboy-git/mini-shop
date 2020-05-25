function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function showLoading(msg) {
    wx.showToast({
        title: msg ? msg : '加载中',
        icon: 'loading',
        mask: true,
        duration: 100000000
    });
}

function hideLoading() {
    wx.hideToast();
}

function showSuccess(msg, icon, time, mask) {
    icon = icon ? icon.toString() : 'success';
    wx.showToast({
        title: msg ? msg : '成功',
        icon: icon,
        mask: mask != true ? mask : true,
        duration: time ? time : 2000,
    });
}

function message(msg, success) {
    wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: false,
        confirmColor: "#59A5F0",
        success: success
    })
}

function confirm(msg, success, fail) {
    wx.showModal({
        title: '温馨提示',
        content: msg,
        showCancel: true,
        confirmColor: "#59A5F0",
        cancelColor: "#59A5F0",
        success: success,
        fail: fail
    })
}

function json2Form(json) {
    var str = [];
    for (var p in json) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    return str.join("&");
}
module.exports = {
    formatTime: formatTime,
    showLoading: showLoading,
    hideLoading: hideLoading,
    showSuccess: showSuccess,
    message: message,
    confirm: confirm,
    json2Form: json2Form,
}