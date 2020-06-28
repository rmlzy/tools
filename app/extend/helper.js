"use strict";

const md5 = require("blueimp-md5");
const jwt = require("jsonwebtoken");
const MarkdownIt = require("markdown-it");
const md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

module.exports = {
  md2html(markdown) {
    return md.render(markdown);
  },

  encryptPassword(password) {
    return md5(md5(password));
  },

  getLoggedIdByToken(token) {
    let id;
    try {
      const jwtSecret = this.config.keys;
      const decoded = jwt.verify(token, jwtSecret);
      id = decoded.id;
    } catch (e) {
      // ignore
    }
    return id;
  },

  generateToken(payload, options) {
    const jwtSecret = this.config.keys;
    return jwt.sign(payload, jwtSecret, options);
  },

  getFileExt(filename) {
    return filename.split(".").pop();
  },
};
