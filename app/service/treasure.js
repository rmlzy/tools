const Service = require("egg").Service;
const _ = require("lodash");

class TreasureService extends Service {
  // 至少 24 + 1 个字符
  dict = "`!@#$%^&*()_+`1234567890-=[];',./{}|:<>?";

  _randomKeys(str) {
    const keys = str.split("");
    const random = _.random(0, keys.length - 1);
    return keys[random];
  }

  _getKeyWithout(str) {
    return this.dict.replace(str, "");
  }

  async encrypt(plainText) {
    plainText = plainText.toUpperCase();
    const uniqTexts = _.uniq(plainText.split(""));
    const valToKey = {};
    let key = this.dict;
    let cipherText = "";
    uniqTexts.forEach((text) => {
      const random = this._randomKeys(key);
      key = this._getKeyWithout(random);
      valToKey[text] = random;
      cipherText += random;
    });
    return cipherText;
  }

  async decrypt(cipherText) {}
}

module.exports = TreasureService;
