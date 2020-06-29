const { Builder, By } = require("selenium-webdriver");
const assert = require("assert");
const { sleep } = require("./util");
require("chromedriver");

describe("test_md5", function () {
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

  it("加密按钮", async function () {
    await driver.get("https://www.rmlzy.com/");
    await driver.manage().window().setRect(1391, 877);
    await driver.findElement(By.css(".col-xs-12:nth-child(3) .pull-right")).click();
    await driver.findElement(By.id("js_source")).click();
    await driver.findElement(By.id("js_source")).sendKeys("111");
    await driver.findElement(By.id("js_encryptBtn")).click();
    await sleep(100);
    {
      const value = await driver.findElement(By.id("js_32Upper")).getAttribute("value");
      assert(value === "698D51A19D8A121CE581499D7B701668");
    }
    {
      const value = await driver.findElement(By.id("js_32Lower")).getAttribute("value");
      assert(value === "698d51a19d8a121ce581499d7b701668");
    }
    {
      const value = await driver.findElement(By.id("js_16Upper")).getAttribute("value");
      assert(value === "9D8A121CE581499D");
    }
    {
      const value = await driver.findElement(By.id("js_16Lower")).getAttribute("value");
      assert(value === "9d8a121ce581499d");
    }
  });

  it("清空按钮", async function () {
    await driver.get("https://www.rmlzy.com/");
    await driver.manage().window().setRect(1391, 877);
    await driver.findElement(By.css(".col-xs-12:nth-child(3) .pull-right")).click();
    await driver.findElement(By.id("js_source")).click();
    await driver.findElement(By.id("js_source")).sendKeys("111");
    await driver.findElement(By.id("js_encryptBtn")).click();
    await sleep(100);
    await driver.findElement(By.id("js_resetBtn")).click();
    await sleep(100);
    {
      const value = await driver.findElement(By.id("js_source")).getAttribute("value");
      assert(value === "");
    }
    {
      const value = await driver.findElement(By.id("js_32Upper")).getAttribute("value");
      assert(value === "");
    }
    {
      const value = await driver.findElement(By.id("js_32Lower")).getAttribute("value");
      assert(value === "");
    }
    {
      const value = await driver.findElement(By.id("js_16Upper")).getAttribute("value");
      assert(value === "");
    }
    {
      const value = await driver.findElement(By.id("js_16Lower")).getAttribute("value");
      assert(value === "");
    }
  });
});
