const puppeteer = require('puppeteer');
const prompt = require('prompt');

(async () => {
  let browser;
  let page;
  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    const credentials = await new Promise((resolve, reject) => {
      if (process.env.EMAIL) {
        prompt.get(
          [
            {
              name: 'Password',
              hidden: true,
              conform: function (value) {
                return true;
              },
            },
          ],
          (error, result) => {
            resolve(result);
          }
        );
      } else {
        prompt.get(['Email', 'Password'], (error, result) => {
          resolve(result);
        });
      }
    });

    const email = process.env.EMAIL || credentials.Email;
    const passwd = credentials.Password;

    await page.goto('https://www.myip.com/');

    const myIPAddress = await page.$eval('#ip', (el) => el.textContent.trim());

    console.log('Your IP Address is ', myIPAddress);

    await page.goto('https://titan.ngbeta.net/whitelist/');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('#login'),
    ]);

    await page.type('#username', email);

    await page.click('[type=submit]');
    await page.waitForSelector('#password', {
      visible: true,
    });

    await page.type('#password', passwd);

    await page.click('[type=submit]');

    try {
      await page.waitForSelector('[name=ipaddress]', {
        visible: true,
      });
    } catch (error) {
      console.log('Looks like your credentials are wrong! Try again');
      return;
    }

    const reason = 'WFH';
    await page.type('[name=ipaddress]', myIPAddress);
    await page.type('[name=reason]', reason);

    await Promise.all([page.waitForNavigation(), page.click('[type=submit]')]);

    const feedback = await page.$eval('#wrapper', (el) =>
      el.textContent.trim()
    );

    if (feedback.includes('Registration Success')) {
      console.log(
        'Your IP Address ',
        myIPAddress,
        'is successfully registered in the allowed list.'
      );
    } else {
      console.log('Error occurred in registering your IP Address. Try again');
    }
  } catch (error) {
    console.log('Error occurred in registering your IP Address. Try again');
  } finally {
    await page.screenshot({ path: 'screen-shot.png' });
    await browser.close();
  }
})();
