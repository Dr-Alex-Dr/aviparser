const puppeteer = require('puppeteer');
const userAgent = require('user-agents');
const fs = require('fs');
const path = require('path');

products = [];

let nameCard = {
    rx: [
        '6900','6800','6800','6700','6600','6600','5700','5700','5600','5500','vega','vega','590','580','580','570','560','550','480','470','460'
    ],
    gtx: {
        ti: [
            '1660 ti','1080 ti','1070 ti','1050 ti',
        ],
        super: [
            '1660 super','1650 super',
        ],
        number: [
            '1660','1650','1070','1060','1050'
        ]
    },
    rtx: {
        ti: [
            '3080 ti','3070 ti','3060 ti','2080 ti',
        ],
        super: [
            '2080 super','2070 super','2060 super',
        ],
        number: [
            '3090','3080','3070','3060','2080','2070','2060',
        ]
    }
}





function getUrl(url, town, item) {
    return `${url}${town}?p=1&q=${item}`
}

function searchName(name) {
    
}

async function fetchProductList(url) {
    try {
    let startTime = Date.now();
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.toString());
    await page.goto(url, { waitUntil: 'networkidle2' }, );
    await page.setDefaultNavigationTimeout(0); 

   

    const smallPost = await page.evaluate(() => {
        let countItems = Array.from(document.querySelectorAll('div[data-marker="item"]')).length;
        let all = document.querySelector('span[data-marker="page-title/count"]').textContent;

        if (all < countItems) {
            countItems = Number(all.replace(/\s/g, ''));
        };
        

        productsList = [];       
        for (let i = 0; i < countItems - 1; i++) {
            let product = {
                name: '',
                prise: 0,
                link: '',
                stars: 0,
                reviewsCount: 0,
                photo: '',
                countItems: countItems
                
            };
            let htmlItem = document.querySelectorAll('div[data-marker="item"]')[i];
            product.name = htmlItem.querySelector('h3[itemprop="name"]').textContent.replace(/Видеокарта|видеокарта/g, '').trim().toLowerCase();
            product.prise = Number(htmlItem.querySelector('span.price-text-E1Y7h').textContent.replace('₽', '').replace(/\s/g, ''));
            product.link = htmlItem.querySelector('div.iva-item-titleStep-_CxvN a').href;
            product.stars = htmlItem.querySelector('span[data-marker="seller-rating/score"]') != null ? Number(htmlItem.querySelector('span[data-marker="seller-rating/score"]').textContent.replace(',', '.')) : 0;
            product.reviewsCount = htmlItem.querySelector('span[data-marker="seller-rating/summary"]') != null ? Number(htmlItem.querySelector('span[data-marker="seller-rating/summary"]').textContent.replace(/отзыва|отзывов|отзыв/g, '')) : 0;

            productsList = productsList.concat(product);
        }
 
        return productsList;  
    });
    products = smallPost;



    for (let i = 0; i < products[0].countItems - 1; i++) {
        await page.goto(products[i].link, { waitUntil: 'networkidle2' });
        await page.setDefaultNavigationTimeout(0); 
        await page.waitForSelector('div.gallery-imgs-container img');

        const photos = await page.evaluate(() => {
            photosCount =  Array.from(document.querySelectorAll('div.gallery-imgs-container img')).length;
            photosLinks = []
            for (let i = 0; i < photosCount; i++) {
                photosLinks.push(document.querySelectorAll('div.gallery-imgs-container img')[i].src);
                
            }
            return photosLinks;
        });
        products[i].photo = photos;
        console.log(products[i]);
        // console.log(products.countItems);

    }

    await browser.close();
    console.log('Time: ', (Date.now() - startTime) / 1000, 's');
    }
    catch (error) {
        console.log(error);
        fetchProductList(getUrl('https://www.avito.ru/', 'ekaterinburg', 'видеокарта'));
    }
  
}


fetchProductList(getUrl('https://www.avito.ru/', 'ekaterinburg', 'видеокарта'));

