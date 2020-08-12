$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/api/stat",
    success: function (res) {
      if (res.message) {
        $("#js_totalPV").text(res.data.pv);
        $("#js_totalUser").text(res.data.ipNum);
        $("#js_running").text(res.data.systemRunning);
      }
    },
  });

  $("#js_showWechatBtn").on("click", function () {
    layer.open({
      type: 1,
      title: "请备注: 工具小站",
      skin: "layui-layer-rim",
      area: ["500px", "720px"],
      content: "<img style='width: 100%;' src='/public/img/wechat-qr.jpeg' />",
    });
  });
});
