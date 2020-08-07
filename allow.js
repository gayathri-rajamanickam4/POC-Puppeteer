const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://titan.ngbeta.net/whitelist/");
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click("#login"),
  ]);

  await page.type("#username", "gayathri.rajamanickam@tesco.com");

  //   await Promise.all([
  //     page.waitForNavigation({ waitUntil: "domcontentloaded" }),
  //     page.click("[type=submit]"),
  //   ]);

  await page.click("[type=submit]");
  await page.waitForSelector("#password", {
    visible: true,
  });

  console.log("process.env.PASSWD::", process.env.PASSWD);

  await page.type("#password", process.env.PASSWD);

  await page.click("[type=submit]");

  await page.waitForSelector("[name=ipaddress]", {
    visible: true,
  });
  //   await Promise.all([page.waitForNavigation(), page.click("[type=submit]")]);

  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
