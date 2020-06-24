function setBsCss(isDark) {
  var cssName = isDark ? "dark.min.css" : "light.min.css";
  var cssUrl = "/public/lib/bootstrap/css/" + cssName;
  var styleEl = document.getElementById("js_bsCss");
  styleEl.setAttribute("href", cssUrl);
}

function initAndDeleteOsTheme() {
  if (window.matchMedia) {
    var media = window.matchMedia("(prefers-color-scheme: dark)");
    setBsCss(media.matches);

    media.addEventListener("change", function () {
      var isDark = media.matches;
      setBsCss(isDark);
    });
  }
}

initAndDeleteOsTheme();
