import puppeteer from 'puppeteer';

export class KleinanzeigenBot {
  constructor() {
    this.browser = null;
    this.page = null;
    this.email = null;
  }

  async getBrowser() {
    if (!this.browser || !this.browser.connected) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
    }
    return this.browser;
  }

  async getPage() {
    const browser = await this.getBrowser();
    if (!this.page || this.page.isClosed()) {
      this.page = await browser.newPage();
      await this.page.setViewport({ width: 1280, height: 800 });
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    }
    return this.page;
  }

  async login(email, password) {
    this.email = email;
    const page = await this.getPage();

    await page.goto('https://www.kleinanzeigen.de/m-benutzer-anmeldung.html', { waitUntil: 'networkidle0' });

    await page.type('#login-email', email, { delay: 40 });
    await page.type('#login-password', password, { delay: 40 });

    await Promise.all([
      page.click('#login-submit'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }),
    ]);

    const error = await page.$('.error-msg');
    if (error) {
      const msg = await page.evaluate(el => el.textContent, error);
      throw new Error(msg || 'Login fehlgeschlagen');
    }

    const loggedIn = await page.$('.m-nav-list-item--myself');
    if (!loggedIn) throw new Error('Login fehlgeschlagen – bitte Email/Passwort prüfen');
  }

  async isLoggedIn() {
    try {
      const page = await this.getPage();
      await page.goto('https://www.kleinanzeigen.de/m-meine-anzeigen.html', { waitUntil: 'networkidle0', timeout: 10000 });
      const el = await page.$('.m-nav-list-item--myself');
      return !!el;
    } catch {
      return false;
    }
  }

  async logout() {
    if (this.browser) await this.browser.close();
    this.browser = null;
    this.page = null;
    this.email = null;
  }

  async getListings() {
    const page = await this.getPage();
    await page.goto('https://www.kleinanzeigen.de/m-meine-anzeigen.html', { waitUntil: 'networkidle0' });

    const listings = await page.evaluate(() => {
      const cards = document.querySelectorAll('.ad-listitem');
      return Array.from(cards).map(card => {
        const titleEl = card.querySelector('.ellipsis');
        const priceEl = card.querySelector('.aditem-detail-price');
        const dateEl = card.querySelector('.aditem-add');
        const statusEl = card.querySelector('.ad-status');
        const linkEl = card.querySelector('a');
        return {
          title: titleEl?.textContent?.trim() || '',
          price: priceEl?.textContent?.trim() || '',
          date: dateEl?.textContent?.trim() || '',
          status: statusEl?.textContent?.trim() || 'aktiv',
          url: linkEl?.href || '',
          id: linkEl?.href?.match(/\/s-anzeige\/(\w+)\//)?.[1] || '',
        };
      });
    });

    return listings;
  }

  async createListing(data) {
    const page = await this.getPage();
    await page.goto('https://www.kleinanzeigen.de/p-anzeige-aufgeben.html', { waitUntil: 'networkidle0' });

    const { title, description, price, category, images } = data;

    if (category) {
      const catInput = await page.$('#category-field input');
      if (catInput) {
        await catInput.click();
        await page.type('#category-field input', category, { delay: 30 });
        await page.waitForTimeout(500);
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
      }
    }

    const titleInput = await page.$('#ad_title');
    if (titleInput) {
      await titleInput.click();
      await titleInput.type(title, { delay: 30 });
    }

    const descInput = await page.$('#ad_description');
    if (descInput) {
      await descInput.click();
      await descInput.type(description, { delay: 10 });
    }

    if (price) {
      const priceInput = await page.$('#ad_price');
      if (priceInput) {
        await priceInput.click();
        await priceInput.type(price.toString().replace(',', '.'), { delay: 20 });
      }
    }

    if (images && images.length > 0) {
      const fileInput = await page.$('input[type="file"]');
      if (fileInput) await fileInput.uploadFile(...images);
    }

    await page.waitForTimeout(1000);

    const submitBtn = await page.$('#pstad-submit');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 });
      return { success: true, url: page.url() };
    }

    throw new Error('Konnte Anzeige nicht erstellen');
  }

  async duplicateListing(listingId) {
    const page = await this.getPage();
    const url = `https://www.kleinanzeigen.de/p-anzeige-bearbeiten.html?adId=${listingId}`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    const submitBtn = await page.$('#pstad-submit');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 });
      return { success: true, url: page.url() };
    }

    throw new Error('Konnte Anzeige nicht duplizieren');
  }

  async republishListing(listingId) {
    const page = await this.getPage();
    const url = `https://www.kleinanzeigen.de/p-anzeige-bearbeiten.html?adId=${listingId}`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    const submitBtn = await page.$('#pstad-submit');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 });
      return { success: true, url: page.url() };
    }

    throw new Error('Konnte Anzeige nicht neu einstellen');
  }

  async getChats() {
    const page = await this.getPage();
    await page.goto('https://www.kleinanzeigen.de/m-nachrichten.html', { waitUntil: 'networkidle0', timeout: 15000 });

    await page.waitForSelector('.conversation-list-item, .message-list-item', { timeout: 8000 }).catch(() => {});

    const chats = await page.evaluate(() => {
      const items = document.querySelectorAll('.conversation-list-item, .message-list-item, [data-conversation-id]');
      return Array.from(items).map(item => {
        const nameEl = item.querySelector('.conversation-partner, .message-partner');
        const previewEl = item.querySelector('.conversation-preview, .message-preview');
        const dateEl = item.querySelector('.conversation-timestamp, .message-timestamp');
        const linkEl = item.querySelector('a');
        const id = item.getAttribute('data-conversation-id') || linkEl?.href?.match(/\/m-nachrichten\/(\d+)/)?.[1] || '';
        return {
          id,
          partner: nameEl?.textContent?.trim() || 'Unbekannt',
          preview: previewEl?.textContent?.trim() || '',
          date: dateEl?.textContent?.trim() || '',
          url: linkEl?.href || '',
          unread: item.classList.contains('is-unread') || !!item.querySelector('.badge'),
        };
      });
    });

    return chats;
  }

  async getChatMessages(chatId) {
    const page = await this.getPage();
    const url = chatId.includes('kleinanzeigen') ? chatId : `https://www.kleinanzeigen.de/m-nachrichten/${chatId}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

    await page.waitForTimeout(2000);

    const messages = await page.evaluate(() => {
      const items = document.querySelectorAll('.message, .message-item, .conversation-message');
      return Array.from(items).map(msg => {
        const textEl = msg.querySelector('.message-text, .text-content');
        const dateEl = msg.querySelector('.message-date, .timestamp');
        const isMine = msg.classList.contains('is-self') || !!msg.querySelector('.self, .from-me');
        return {
          text: textEl?.textContent?.trim() || '',
          date: dateEl?.textContent?.trim() || '',
          isMine,
        };
      });
    });

    return messages;
  }

  async sendMessage(chatId, text) {
    const page = await this.getPage();
    const url = chatId.includes('kleinanzeigen') ? chatId : `https://www.kleinanzeigen.de/m-nachrichten/${chatId}`;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

    await page.waitForTimeout(1000);

    const input = await page.$('textarea, .message-input, [contenteditable="true"]');
    if (!input) throw new Error('Konnte Nachrichtenfeld nicht finden');

    await input.click();
    await input.type(text, { delay: 20 });

    const sendBtn = await page.$('button[type="submit"], .send-button, .btn-primary');
    if (sendBtn) {
      await sendBtn.click();
    } else {
      await page.keyboard.press('Enter');
    }

    await page.waitForTimeout(1000);
    return { success: true };
  }
}
