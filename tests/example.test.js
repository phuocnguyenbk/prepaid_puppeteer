const puppeteer = require('puppeteer');
const fs = require('fs');
describe('My first project', () => {
	it('should launch project', async () => {
		const inputCode = fs.readFileSync('tests/Input.txt', {
			encoding: 'utf8',
			flag: 'r',
		});

		const result = inputCode.split(/\r?\n/);

		const browser = await puppeteer.launch({
			headless: false,
			args: ['--disable-web-security'],
			defaultViewport: null,
		});

		const creds = {
			email: 'tracybartlett',
			password: 'Lion@0504',
		};
		const page = await browser.newPage();
		const pages = await browser.pages();
		// Close the new tab that chromium always opens first.
		pages[0].close();

		await page.goto('https://www.prepaiddigitalsolutions.com/Login', {
			waitUntil: ['networkidle2'],
		});

		await page.type('input[name=UserName]', creds.email, {delay: 100});
		await page.type('input[name=Password]', creds.password, {delay: 100});

		// const selector = '#MyWallet\\.Btn\\.AddPayment';

		await page.waitForXPath('//*[@id="MyWallet.Btn.AddPayment"]', {
			timeout: 0,
		});

		for (let item of result) {
			if (item.length !== 16 || item.split('-').length !== 3) continue;

			await page.waitFor(3000);
			await page.evaluate(() =>
				document.querySelector('#MyWallet\\.Btn\\.AddPayment').click()
			);

			await page.waitForSelector('#AddPayment\\.Btn\\.Add');

			await page.$eval(
				'#AddPayment\\.Txt\\.Token',
				(el, value) => (el.value = value),
				item
			);

			await page.waitFor(3000);
			await page.evaluate(() =>
				document.querySelector('#AddPayment\\.Btn\\.Add').click()
			);

			await page.waitForXPath(
				'//*[@id="frmRedemptionOptions"]/div[2]/div/div[2]/div/h1',
				{timeout: 0}
			);

			await page.waitFor(5000);
			await page.evaluate(() => {
				document
					.querySelector('#RedemptionOptions\\.Btn\\.Select_VIRTUAL')
					.click();
			});

			await page.waitFor(5000);

			await page.waitForXPath('//*[@id="RedemptionConfirm.Btn.Confirm"]', {
				timeout: 0,
			});

			await page.waitFor(5000);
			await page.evaluate(() => {
				document.querySelector('#RedemptionConfirm\\.Btn\\.Confirm').click();
			});

			await page.waitForXPath('//*[@id="MyWallet.Btn.Agree"]');

			await page.waitFor(7000);
			await page.evaluate(() => {
				document
					.querySelector(
						'#site-agreement-terms > div > div > div.siteAgreementTerms.modal__body.modal__body--transparent > div > div > div:last-child'
					)
					.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'end'});
			});

			await page.waitFor(5000);

			await page.evaluate(() => {
				document.querySelector('#MyWallet\\.Btn\\.Agree').click();
			});

			await page.waitFor(5000);

			await page.waitForXPath(
				'//*[@id="RedemptionSuccess.Btn.GotoDigitalWallet"]'
			);

			await page.waitFor(5000);
			await page.goto('https://www.prepaiddigitalsolutions.com/MyWallet', {
				waitUntil: ['networkidle2'],
			});

			await page.waitForXPath('//*[@id="MyWallet.Btn.AddPayment"]', {
				timeout: 0,
			});
		}

		console.log('payment added successfully');
	});
});
