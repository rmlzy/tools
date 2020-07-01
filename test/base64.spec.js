const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const { sleep } = require("./util");
require("chromedriver");

describe("base64", function () {
  this.timeout(30000);
  let driver;
  let vars;
  beforeEach(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    vars = {};
  });
  afterEach(async function () {
    await driver.quit();
  });

  it("encrypt", async function () {
    await driver.get("https://www.rmlzy.com/tool/base64.html");
    await driver.manage().window().setRect(1422, 877);
    await driver.findElement(By.id("js_sourceArea")).click();
    await driver.findElement(By.id("js_sourceArea")).sendKeys("123");
    await driver.findElement(By.id("js_encryptBtn")).click();
    await sleep(200);
    {
      const value = await driver.findElement(By.id("js_outputArea")).getAttribute("value");
      assert(value == "MTIz");
    }
  });

  it("decrypt", async function () {
    await driver.get("https://www.rmlzy.com/tool/base64.html")
    await driver.manage().window().setRect(1422, 877)
    await driver.findElement(By.id("js_sourceArea")).click()
    await driver.findElement(By.id("js_sourceArea")).sendKeys("MTIz")
    await driver.findElement(By.id("js_decryptBtn")).click()
    {
      const value = await driver.findElement(By.id("js_outputArea")).getAttribute("value")
      assert(value == "123")
    }
  });
});
