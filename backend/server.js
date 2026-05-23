import express from 'express';
import cors from 'cors';
import { KleinanzeigenBot } from './bot.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const bot = new KleinanzeigenBot();

// Session
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email und Passwort erforderlich' });
    await bot.login(email, password);
    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

app.get('/api/session', async (req, res) => {
  const valid = await bot.isLoggedIn();
  res.json({ loggedIn: valid, email: bot.email });
});

app.post('/api/logout', async () => {
  await bot.logout();
  res.json({ success: true });
});

// Anzeigen
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await bot.getListings();
    res.json(listings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/listings', async (req, res) => {
  try {
    const result = await bot.createListing(req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/listings/:id/duplicate', async (req, res) => {
  try {
    const result = await bot.duplicateListing(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/listings/:id/republish', async (req, res) => {
  try {
    const result = await bot.republishListing(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Chats
app.get('/api/chats', async (req, res) => {
  try {
    const chats = await bot.getChats();
    res.json(chats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/chats/:id', async (req, res) => {
  try {
    const messages = await bot.getChatMessages(req.params.id);
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/chats/:id/messages', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text erforderlich' });
    const result = await bot.sendMessage(req.params.id, text);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`Flippy Bird Backend läuft auf Port ${PORT}`);
});
