// Load Puppeteer 
const puppeteer = require('puppeteer');

// Load Stealth plugin
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());