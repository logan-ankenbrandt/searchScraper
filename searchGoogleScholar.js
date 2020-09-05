const puppeteer = require('puppeteer');

const searchGoogleScholar = async(searchQuery) => {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(`https://scholar.google.com`);

    await page.type('input[name="q"]', searchQuery);

    await page.$eval('input=[name"btnG"]', button => button.click());

    await page.waitFor('.gs_ri');

    const results = await page.$$eval('.gs_ri', rows => {
        return rows.map(row => {
            const properties = [];
            const titleElement = row.querySelector('.gs_rt');
            properties.title = titleElement.innerText;
            const url = row.querySelector('.gs_rt a');
            properties.href = url.getAttribute('href');
            const description = row.querySelector('.gs_rs');
            properties.description = description.innerText;
            return properties;
        })
    });

    await browser.close();

    return results;
}

module.exports = searchGoogleScholar;