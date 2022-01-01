const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: {width: 1920, height: 1080}});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 
    await page.goto('https://www.avito.ru/ekaterinburg?p=1&q=%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE%D0%BA%D0%B0%D1%80%D1%82%D0%B0');

    const result = await page.evaluate(() => {return `id=${document.querySelectorAll('div[data-marker="item"]')[1].id}`});
    // let item = document.querySelectorAll('div[data-marker="item"]')[0];
    await page.hover(`div[${result}]`);
    console.log(`div[${result}]`);
    
    await page.screenshot({ path: 'hover.png' });
    await browser.close();
   })()



   const puppeteer = require('puppeteer');
   const userAgent = require('user-agents');
   
   products = [];
   
   function getUrl(url, town, item) {
       return `${url}${town}?p=1&q=${item}`
   }
   
   async function bigPhotos(url, index) {
       const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
       const page1 = await browser.newPage();
       await page1.setUserAgent(userAgent.toString());
       await page1.goto(url, { waitUntil: 'networkidle2' });
       await page1.bringToFront();  
       await page1.setDefaultNavigationTimeout(0); 
   
       
       await page1.waitForTimeout(1000);
       const photos = await page1.evaluate(() => {
           photosCount =  Array.from(document.querySelectorAll('div.gallery-imgs-container img')).length;
           photosLinks = []
           for (let i = 0; i < photosCount; i++) {
               photosLinks.push(document.querySelectorAll('div.gallery-imgs-container img')[i].src);
               
           }
           return photosLinks;
       });
       await browser.close();
   
       products[index].photo = photos;
       console.log(products);
   
   }
   
   async function fetchProductList(url) {
       let startTime = Date.now();
       const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
       const page = await browser.newPage();
       await page.setUserAgent(userAgent.toString());
       await page.goto(url, { waitUntil: 'networkidle2' });
       await page.setDefaultNavigationTimeout(0); 
   
   
      
       
       
       const smallPost = await page.evaluate(() => {
           let countItems = Array.from(document.querySelectorAll('div[data-marker="item"]')).length;
           productsList = [];
           
           for (let i = 0; i < countItems - 1; i++) {
               
   
               let product = {
                   name: '',
                   prise: 0,
                   link: '',
                   stars: 0,
                   reviewsCount: 0,
                   photo: ''
                   
               };
               let htmlItem = document.querySelectorAll('div[data-marker="item"]')[i];
               product.name = htmlItem.querySelector('h3[itemprop="name"]').textContent.replace(/Видеокарта|видеокарта/g, '').trim();
               product.prise = Number(htmlItem.querySelector('span.price-text-E1Y7h').textContent.replace('₽', '').replace(/\s/g, ''));
               product.link = htmlItem.querySelector('div.iva-item-titleStep-_CxvN a').href;
               product.stars = htmlItem.querySelector('span[data-marker="seller-rating/score"]') != null ? Number(htmlItem.querySelector('span[data-marker="seller-rating/score"]').textContent.replace(',', '.')) : 0;
               product.reviewsCount = htmlItem.querySelector('span[data-marker="seller-rating/summary"]') != null ? Number(htmlItem.querySelector('span[data-marker="seller-rating/summary"]').textContent.replace(/отзыва|отзывов|отзыв/g, '')) : 0;
               // product.photo = bigPhotos(products.link);
   
               productsList = productsList.concat(product);
           }
   
           
           return productsList;
       
       });
       products = smallPost;
       let productsCount = products.length;
       for (let i = 0; i < 4; i++) {
           bigPhotos(products[i].link, i);
       }
       
   
       await browser.close();
       console.log('Time: ', (Date.now() - startTime) / 1000, 's');
     
   }
   
   
   
   
   
   fetchProductList(getUrl('https://www.avito.ru/', 'ekaterinburg', 'видеокарта'));
   
   