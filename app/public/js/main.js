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
});
