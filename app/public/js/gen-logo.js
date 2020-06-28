$(document).ready(function () {
  new Vue({
    el: "#GenLogoApp",
    data() {
      return {
        showAllColor: false,
        colors: [],
        icons: [],
        fontFamilies: [
          "Arial",
          "Helvetica",
          "Sans-Serif",
          "微软雅黑",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Palatino",
        ],
        iconLib: {},
        option: {
          // 背景
          size: 300 * 4,
          shape: "round", // square: 正方形, circle: 圆形, round: 圆角
          bgType: "linear",
          background: "#333333",
          colors: [], // 渐变背景
          rotate: 0,

          // Logo 类型
          logoType: "svg", // text: 文字, svg: 图标

          // 文字
          svg: "",
          stokeColor: "#ffffff",

          // 文字
          // text: "🔨",
          text: "ABC",
          fontSize: 25,
          fontColor: "#ffffff",
          fontFamily: "Arial",

          // 徽章
          showBadge: false,
          badgeText: "促销",
          badgeSize: 15,
          badgeColor: "#ffffff",
          badgeBackground: "#ff0000",

          // 导出配置
          exportType: "osx",
        },
        ctx: null,
        iconLibModal: false,
        activeTab: "cssGG",
        activeIcon: "",
        customSvg: "",
      };
    },
    mounted() {
      this.ctx = this.$refs.stage.getContext("2d");
      this.getColors();
      $("#js_iconTab a").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
      });

      this.fetchAllIcons();
    },
    methods: {
      toggleShowAllColor: function () {
        this.showAllColor = !this.showAllColor;
      },

      getColors: function () {
        var that = this;
        $.ajax({
          type: "GET",
          url: "/api/genLogo/colors",
          success: function (res) {
            if (res.success) {
              that.colors = res.data;
              that.option.colors = res.data[0].colors;
              that.getIcons();
            } else {
              layer.msg(res.message, { icon: 5 });
            }
          },
        });
      },

      getIcons: function () {
        var that = this;
        $.ajax({
          type: "GET",
          url: "/api/genLogo/icons?name=demo",
          success: function (res) {
            if (res.success) {
              that.icons = res.data;
              that.option.svg = res.data[0];
              that.draw();
            } else {
              layer.msg(res.message, { icon: 5 });
            }
          },
        });
      },

      fetchAllIcons: function () {
        var that = this;
        var icons = ["css-gg", "feather"];
        for (let i = 0; i < icons.length; i++) {
          $.ajax({
            type: "GET",
            url: "/api/genLogo/icons?name=" + icons[i],
            success: function (res) {
              if (res.success) {
                that.iconLib[icons[i]] = res.data;
              } else {
                layer.msg(res.message, { icon: 5 });
              }
            },
          });
        }
      },

      setActiveTab: function (activeTab) {
        this.activeTab = activeTab;
      },

      setRotate: function () {
        this.option.rotate += 45;
        if (this.option.rotate > 360) {
          this.option.rotate = 45;
        }
        this.draw();
      },

      setLinearColor: function (row) {
        this.option.colors = row.colors;
        this.draw();
      },

      setBackgroundColor: function (background) {
        this.option.background = background;
        this.draw();
      },

      setSvg: function (svg) {
        this.option.svg = svg;
        this.draw();
      },

      chooseIconLib: function (svg) {
        this.activeIcon = svg;
      },

      showLibModal: function () {
        this.iconLibModal = true;
      },

      onLibModalCancel: function () {
        this.iconLibModal = false;
        this.activeIcon = "";
      },

      onLibModalOk: function () {
        if (this.activeTab === "custom" && this.customSvg === "") {
          return;
        }
        if (this.activeTab === "custom") {
          this.option.svg = this.customSvg;
        } else {
          this.option.svg = this.activeIcon;
        }
        this.draw();
        this.iconLibModal = false;
      },

      draw: function () {
        console.log("draw with option: ", this.option);
        this.drawShape();
        this.drawBg();
        this.drawSvg();
        this.drawText();
        this.drawBadge();
        this.drawBadgeText();
      },

      drawShape: function () {
        var size = this.option.size;
        // 清空画布
        this.ctx.clearRect(0, 0, size, size);
        this.ctx.restore();

        // 绘制正方形
        if (this.option.shape === "square") {
          this.ctx.beginPath();
          this.ctx.rect(0, 0, size, size);
          this.ctx.closePath();
        }

        // 绘制圆形
        if (this.option.shape === "circle") {
          this.ctx.beginPath();
          this.ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
          this.ctx.closePath();
        }

        // 绘制圆角
        if (this.option.shape === "round") {
          var radius = 150;
          var x = 0;
          var y = 0;
          var r = x + size;
          var b = y + size;
          this.ctx.beginPath();
          this.ctx.lineWidth = "0";
          this.ctx.moveTo(x + radius, y);
          this.ctx.lineTo(r - radius, y);
          this.ctx.quadraticCurveTo(r, y, r, y + radius);
          this.ctx.lineTo(r, y + size - radius);
          this.ctx.quadraticCurveTo(r, b, r - radius, b);
          this.ctx.lineTo(x + radius, b);
          this.ctx.quadraticCurveTo(x, b, x, b - radius);
          this.ctx.lineTo(x, y + radius);
          this.ctx.quadraticCurveTo(x, y, x + radius, y);
          this.ctx.closePath();
        }

        // 保存剪切上下文
        this.ctx.save();
        this.ctx.clip();
      },

      drawBg: function () {
        var background = this.option.background;
        var size = this.option.size;

        if (this.option.bgType === "transparent") {
        }

        if (this.option.bgType === "plain") {
          this.ctx.fillStyle = background;
          // fillRect(x, y, width, height)
          this.ctx.fillRect(0, 0, size, size);
        }

        if (this.option.bgType === "linear") {
          // createLinearGradient(x0, y0, x1, y1)
          var grd;
          if (this.option.rotate === 0) {
            grd = this.ctx.createLinearGradient(size / 2, 0, size / 2, size);
          }
          if (this.option.rotate === 45) {
            grd = this.ctx.createLinearGradient(0, size, size, 0);
          }
          if (this.option.rotate === 90) {
            grd = this.ctx.createLinearGradient(0, size / 2, size, size / 2);
          }
          if (this.option.rotate === 135) {
            grd = this.ctx.createLinearGradient(0, 0, size, size);
          }
          if (this.option.rotate === 180) {
            grd = this.ctx.createLinearGradient(size / 2, 0, size / 2, size);
          }
          if (this.option.rotate === 225) {
            grd = this.ctx.createLinearGradient(size, 0, 0, size);
          }
          if (this.option.rotate === 270) {
            grd = this.ctx.createLinearGradient(size, size / 2, 0, size / 2);
          }
          if (this.option.rotate === 315) {
            grd = this.ctx.createLinearGradient(size, size, 0, 0);
          }
          if (this.option.rotate === 360) {
            grd = this.ctx.createLinearGradient(size / 2, size, size / 2, 0);
          }
          if (this.option.colors.length === 3) {
            grd.addColorStop(0, this.option.colors[0]);
            grd.addColorStop(0.5, this.option.colors[1]);
            grd.addColorStop(1, this.option.colors[2]);
          } else {
            grd.addColorStop(0, this.option.colors[0]);
            grd.addColorStop(1, this.option.colors[1]);
          }
          this.ctx.fillStyle = grd;
          this.ctx.fillRect(0, 0, size, size);
        }
      },

      drawSvg: function () {
        if (this.option.logoType !== "svg") {
          return;
        }
        var size = this.option.size;
        var ctx = this.ctx;
        var img = new Image();
        var svgWithColor = this.option.svg
          .replace(/fill="currentColor"/g, 'fill="' + this.option.stokeColor + '"')
          .replace(/stroke="currentColor"/g, 'stroke="' + this.option.stokeColor + '"');
        var blob = new Blob([svgWithColor], { type: "image/svg+xml;charset=utf-8" });
        var blobURL =
          window.URL && window.URL.createObjectURL
            ? window.URL.createObjectURL(blob)
            : window.webkitURL.createObjectURL(blob);
        img.src = blobURL;
        img.onload = function () {
          ctx.drawImage(img, size / 4, size / 4, size / 2, size / 2);
        };
      },

      drawText: function () {
        if (this.option.logoType !== "text") {
          return;
        }
        var size = this.option.size;
        this.ctx.beginPath();
        this.ctx.font = this.option.fontSize * 8 + "px " + this.option.fontFamily;
        this.ctx.fillStyle = this.option.fontColor;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.option.text, size / 2, size / 2, size);
        this.ctx.fill();
        this.ctx.closePath();
      },

      drawBadge: function () {
        if (!this.option.showBadge) {
          return;
        }
        var size = this.option.size;
        var h = 250;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(size / 2, size);
        this.ctx.rotate(-(Math.PI / 4));
        this.ctx.rect(0, 0, size, h);
        this.ctx.fillStyle = this.option.badgeBackground;
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
      },

      drawBadgeText: function () {
        if (!this.option.showBadge) {
          return;
        }
        var size = this.option.size;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate((size / 8) * 6.7, (size / 8) * 6.5);
        this.ctx.rotate(-(Math.PI / 4));
        this.ctx.font = this.option.badgeSize * 8 + "px " + this.option.fontFamily;
        this.ctx.fillStyle = this.option.badgeColor;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(this.option.badgeText, 0, 0, size);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
      },

      exportToImage: function () {
        var that = this;
        $.ajax({
          type: "GET",
          url: "/api/genLogo/uuid",
          success: function (res) {
            if (res.success) {
              that.$refs.stage.toBlob(function (blob) {
                that.download(blob, res.data + ".jpg");
              });
            } else {
              layer.msg(res.message, { icon: 5 });
            }
          },
        });
      },

      download: function (data, filename, mime, bom) {
        var blobData = typeof bom !== "undefined" ? [bom, data] : [data];
        var blob = new Blob(blobData, { type: mime || "application/octet-stream" });
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(blob, filename);
        } else {
          var blobURL =
            window.URL && window.URL.createObjectURL
              ? window.URL.createObjectURL(blob)
              : window.webkitURL.createObjectURL(blob);
          var tempLink = document.createElement("a");
          tempLink.style.display = "none";
          tempLink.href = blobURL;
          tempLink.setAttribute("download", filename);
          if (typeof tempLink.download === "undefined") {
            tempLink.setAttribute("target", "_blank");
          }
          document.body.appendChild(tempLink);
          tempLink.click();
          setTimeout(function () {
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
          }, 200);
        }
      },
    },
  });
});
