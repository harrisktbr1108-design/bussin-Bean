import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const projectDir = process.cwd();
const dataDir = path.resolve(projectDir, 'data');
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, 'bussin-bean.sqlite'));
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && !process.env.JWT_SECRET) throw new Error('JWT_SECRET must be configured in production');
const JWT_SECRET = process.env.JWT_SECRET || 'local-development-secret';
const PORT = Number(process.env.PORT || 3001);
const app = express();
const now = () => new Date().toISOString();

db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, rating INTEGER NOT NULL, comment TEXT NOT NULL, item_ordered TEXT, approved INTEGER NOT NULL DEFAULT 0, likes INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS discount_consents (id INTEGER PRIMARY KEY AUTOINCREMENT, review_id INTEGER NOT NULL UNIQUE, customer_key TEXT NOT NULL, consented INTEGER NOT NULL, redeemed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS discounts (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_key TEXT NOT NULL UNIQUE, percent INTEGER NOT NULL, label TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1);
  CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, payload TEXT NOT NULL, total INTEGER NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS menu_items (id TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS blog_posts (id TEXT PRIMARY KEY, payload TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
`);

const seedMenu = [
  ['loaded-oreo', 'LOADED OREO', 'Dreamy, creamy and absolutely irresistible.', 650, 'special', '/images/loaded_oreo.png', 1, 0],
  ['vanilla-velvet', 'VANILLA VELVET', 'Smooth vanilla, pure comfort in a cup.', 599, 'signature', '/images/vanilla_velvet.png', 1, 1],
  ['original-brew', 'THE ORIGINAL BREW', 'Pure coffee. Nothing else.', 350, 'classic', '/images/original_brew.png', 0, 0],
  ['midnight-mocha', 'MIDNIGHT MOCHA', 'Rich chocolate. Bold coffee. Pure indulgence.', 350, 'classic', '/images/midnight_mocha.png', 1, 0],
  ['spanish-sunset', 'SPANISH SUNSET', 'A perfect blend of coffee, caramel and warmth.', 399, 'cold', '/images/spanish_sunset.png', 0, 0],
  ['golden-caramel-bliss', 'GOLDEN CARAMEL BLISS', 'Sweet caramel. Smooth coffee. Total bliss.', 400, 'signature', '/images/golden_caramel_bliss.png', 1, 0],
  ['bussin-signature', 'THE BUSSIN SIGNATURE', 'A signature taste, uniquely yours.', 550, 'signature', '/images/bussin_signature.png', 0, 1],
];
const insertMenu = db.prepare('INSERT OR IGNORE INTO menu_items (id, payload, updated_at) VALUES (?, ?, ?)');
for (const [id, name, description, price, category, image, isPopular, isFeatured] of seedMenu) insertMenu.run(id, JSON.stringify({ id, name, description, price, currency: 'Rs.', category, image, isPopular: Boolean(isPopular), isFeatured: Boolean(isFeatured), tags: [] }), now());

const seedBlogPosts = [
  {
    id: 'coffee-always-good-idea',
    title: 'Coffee Is Always a Good Idea',
    slug: 'coffee-is-always-a-good-idea',
    excerpt: 'A warm, comforting coffee ritual is more than a beverage — it is a mood, a ritual, and a reason to pause and enjoy life one sip at a time.',
    content: [
      'Coffee is always a good idea. It is the small daily ritual that turns quiet mornings into productive starts and stressful afternoons into graceful pauses. At Bussin Bean, we believe the best cups are not just brewed — they are designed to lift your mood and slow your day down in the most enjoyable way.',
      'Whether you prefer the earthy comfort of a classic roast or the creamy coolness of a signature cold coffee, each sip is a reminder that coffee can be both energizing and comforting. A well-made cup brings people together, sparks conversation, and creates lasting moments.',
      'That is why our coffee culture is built around flavor, comfort, and connection. From your first sip to the final drop, every cup should feel like a good idea worth repeating again and again.'
    ],
    author: 'Bussin Bean Team',
    date: '29 Sep 2026',
    readTime: '3 min read',
    category: 'Coffee Lifestyle',
    image: '/images/hero_bg.png',
    tags: ['Coffee Mood', 'Good Idea', 'Daily Ritual', 'Bussin Bean'],
  },
];
const insertBlogPost = db.prepare('INSERT OR IGNORE INTO blog_posts (id, payload, created_at, updated_at) VALUES (?, ?, ?, ?)');
for (const post of seedBlogPosts) insertBlogPost.run(post.id, JSON.stringify(post), now(), now());

if (isProduction && !process.env.ADMIN_INITIAL_PASSWORD) throw new Error('ADMIN_INITIAL_PASSWORD must be configured in production');
const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || '1234';
const existingAdmin = db.prepare('SELECT id FROM admins LIMIT 1').get();
if (!existingAdmin) db.prepare('INSERT INTO admins (password_hash, created_at) VALUES (?, ?)').run(bcrypt.hashSync(initialPassword, 12), new Date().toISOString());

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',').map(origin => origin.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : true }));
app.use(express.json({ limit: '1mb' }));

type AuthRequest = Request & { adminId?: number };
const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try { req.adminId = (jwt.verify(token, JWT_SECRET) as { adminId: number }).adminId; next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired session' }); }
};
const normalizeKey = (value: string) => value.trim().toLowerCase();
const reviewDiscountPercent = Math.max(1, Math.min(100, Number(process.env.REVIEW_DISCOUNT_PERCENT || 10)));
const parseOrderPayload = (payload: string) => {
  const parsed: unknown = JSON.parse(payload);
  return Array.isArray(parsed)
    ? { items: parsed, contactNumber: '', address: '' }
    : parsed as { items: unknown[]; contactNumber?: string; address?: string };
};

app.get('/api/menu', (_req, res) => res.json(db.prepare('SELECT payload FROM menu_items ORDER BY rowid').all().map((row) => JSON.parse((row as { payload: string }).payload))));
app.get('/api/admin/menu', requireAdmin, (_req, res) => res.json(db.prepare('SELECT payload FROM menu_items ORDER BY rowid').all().map((row) => JSON.parse((row as { payload: string }).payload))));
app.put('/api/admin/menu/:id', requireAdmin, (req, res) => { const item = { ...req.body, id: req.params.id }; db.prepare('INSERT INTO menu_items (id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at').run(req.params.id, JSON.stringify(item), now()); res.json(item); });
app.delete('/api/admin/menu/:id', requireAdmin, (req, res) => { db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id); res.json({ ok: true }); });

app.post('/api/auth/login', (req, res) => {
  const password = String(req.body.password || '');
  const admin = db.prepare('SELECT id, password_hash FROM admins LIMIT 1').get() as { id: number; password_hash: string } | undefined;
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) return res.status(401).json({ error: 'Invalid admin password' });
  res.json({ token: jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '8h' }) });
});

app.post('/api/auth/password', requireAdmin, (req: AuthRequest, res) => {
  const currentPassword = String(req.body.currentPassword || '');
  const nextPassword = String(req.body.nextPassword || '');
  const admin = db.prepare('SELECT password_hash FROM admins WHERE id = ?').get(req.adminId) as { password_hash: string } | undefined;
  if (!admin || !bcrypt.compareSync(currentPassword, admin.password_hash)) return res.status(400).json({ error: 'Current password is incorrect' });
  if (nextPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });
  db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(nextPassword, 12), req.adminId);
  res.json({ ok: true });
});

app.get('/api/blog', (_req, res) => res.json(db.prepare('SELECT payload FROM blog_posts ORDER BY created_at DESC').all().map((row) => JSON.parse((row as { payload: string }).payload))));
app.get('/api/admin/blog', requireAdmin, (_req, res) => res.json(db.prepare('SELECT payload FROM blog_posts ORDER BY created_at DESC').all().map((row) => JSON.parse((row as { payload: string }).payload))));
app.put('/api/admin/blog/:id', requireAdmin, (req, res) => {
  const post = { ...req.body, id: req.params.id };
  if (!String(post.title || '').trim()) return res.status(400).json({ error: 'A blog title is required.' });
  const payload = { ...post, slug: String(post.slug || post.title).trim(), content: Array.isArray(post.content) ? post.content : [String(post.content || '')], tags: Array.isArray(post.tags) ? post.tags : [], image: String(post.image || '/images/hero_bg.png'), date: String(post.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })), readTime: String(post.readTime || '3 min read'), category: String(post.category || 'Coffee Lifestyle'), author: String(post.author || 'Bussin Bean Team'), excerpt: String(post.excerpt || '').trim() || 'Fresh coffee stories from Bussin Bean.' };
  db.prepare('INSERT INTO blog_posts (id, payload, created_at, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at').run(req.params.id, JSON.stringify(payload), now(), now());
  res.json(payload);
});
app.delete('/api/admin/blog/:id', requireAdmin, (req, res) => { db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id); res.json({ ok: true }); });

app.get('/api/reviews', (_req, res) => {
  const reviews = db.prepare('SELECT id, name, rating, comment, item_ordered as itemOrdered, likes, created_at as createdAt FROM reviews WHERE approved = 1 ORDER BY created_at DESC').all();
  res.json(reviews);
});
app.post('/api/reviews', (req, res) => {
  const { name, rating, comment, itemOrdered, customerKey, discountConsent } = req.body;
  if (!String(name || '').trim() || !String(comment || '').trim() || !Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: 'Name, comment, and a rating from 1 to 5 are required' });
  const result = db.prepare('INSERT INTO reviews (name, rating, comment, item_ordered, approved, created_at) VALUES (?, ?, ?, ?, 0, ?)').run(String(name).trim(), rating, String(comment).trim(), itemOrdered ? String(itemOrdered) : null, now());
  if (discountConsent === true && String(customerKey || '').trim()) {
    const key = normalizeKey(String(customerKey));
    db.prepare('INSERT INTO discount_consents (review_id, customer_key, consented, redeemed, created_at) VALUES (?, ?, 1, 0, ?)').run(result.lastInsertRowid, key, now());
    db.prepare('INSERT INTO discounts (customer_key, percent, label, active) VALUES (?, ?, ?, 1) ON CONFLICT(customer_key) DO UPDATE SET percent = excluded.percent, label = excluded.label, active = 1').run(key, reviewDiscountPercent, 'One-time review thank-you');
  }
  res.status(201).json({ id: result.lastInsertRowid, message: 'Review submitted for approval' });
});
app.post('/api/reviews/:id/like', (req, res) => { db.prepare('UPDATE reviews SET likes = likes + 1 WHERE id = ? AND approved = 1').run(req.params.id); res.json({ ok: true }); });
app.get('/api/admin/reviews', requireAdmin, (_req, res) => res.json(db.prepare('SELECT id, name, rating, comment, item_ordered as itemOrdered, approved, likes, created_at as createdAt FROM reviews ORDER BY created_at DESC').all()));
app.patch('/api/admin/reviews/:id', requireAdmin, (req, res) => { db.prepare('UPDATE reviews SET approved = ? WHERE id = ?').run(req.body.approved ? 1 : 0, req.params.id); res.json({ ok: true }); });

app.get('/api/discounts/customer/:key', (req, res) => {
  const key = normalizeKey(req.params.key);
  const discount = db.prepare(`SELECT d.percent, d.label FROM discounts d WHERE d.customer_key = ? AND d.active = 1 AND (NOT EXISTS (SELECT 1 FROM discount_consents c WHERE c.customer_key = d.customer_key AND c.consented = 1) OR EXISTS (SELECT 1 FROM discount_consents c WHERE c.customer_key = d.customer_key AND c.consented = 1 AND c.redeemed = 0))`).get(key);
  res.json(discount || null);
});
app.post('/api/discounts/customer/:key/redeem', (req, res) => { const key = normalizeKey(req.params.key); const result = db.prepare('UPDATE discount_consents SET redeemed = 1 WHERE customer_key = ? AND consented = 1 AND redeemed = 0').run(key); if (!result.changes) return res.status(404).json({ error: 'No unused discount found' }); res.json({ ok: true }); });
app.get('/api/admin/discounts', requireAdmin, (_req, res) => res.json(db.prepare('SELECT id, customer_key as customerKey, percent, label, active FROM discounts ORDER BY id DESC').all()));
app.post('/api/admin/discounts', requireAdmin, (req, res) => { const key = normalizeKey(String(req.body.customerKey || '')); const percent = Math.max(1, Math.min(100, Number(req.body.percent))); if (!key || !Number.isFinite(percent)) return res.status(400).json({ error: 'Customer key and valid percentage are required' }); db.prepare('INSERT INTO discounts (customer_key, percent, label, active) VALUES (?, ?, ?, 1) ON CONFLICT(customer_key) DO UPDATE SET percent = excluded.percent, label = excluded.label, active = 1').run(key, percent, String(req.body.label || 'Customer discount')); res.json({ ok: true }); });
app.delete('/api/admin/discounts/:id', requireAdmin, (req, res) => { db.prepare('DELETE FROM discounts WHERE id = ?').run(req.params.id); res.json({ ok: true }); });

app.post('/api/orders', (req, res) => {
  const items = req.body.items;
  const contactNumber = String(req.body.contactNumber || '').trim();
  const address = String(req.body.address || '').trim();
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Add at least one item to your order.' });
  if (!contactNumber || !address) return res.status(400).json({ error: 'Contact number and delivery address are required.' });
  if (contactNumber.length > 40 || address.length > 500) return res.status(400).json({ error: 'Contact number or address is too long.' });
  const id = `BB-${Date.now().toString().slice(-6)}`;
  db.prepare('INSERT INTO orders (id, payload, total, status, created_at) VALUES (?, ?, ?, ?, ?)').run(id, JSON.stringify({ items, contactNumber, address }), Number(req.body.total || 0), 'Pending', now());
  res.status(201).json({ id, status: 'Pending' });
});
app.get('/api/orders/:id', (req, res) => {
  const order = db.prepare('SELECT id, payload, total, status, created_at as createdAt FROM orders WHERE id = ?').get(req.params.id) as { id: string; payload: string; total: number; status: string; createdAt: string } | undefined;
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const { payload, ...details } = order;
  res.json({ ...details, ...parseOrderPayload(payload) });
});
app.get('/api/admin/orders', requireAdmin, (_req, res) => {
  const orders = db.prepare('SELECT id, payload, total, status, created_at as createdAt FROM orders ORDER BY created_at DESC').all() as { id: string; payload: string; total: number; status: string; createdAt: string }[];
  res.json(orders.map(({ payload, ...details }) => ({ ...details, ...parseOrderPayload(payload) })));
});
app.patch('/api/admin/orders/:id', requireAdmin, (req, res) => { db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(String(req.body.status), req.params.id); res.json({ ok: true }); });

app.use(express.static(path.resolve(projectDir, 'dist')));
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.resolve(projectDir, 'dist/index.html'));
});
app.listen(PORT, () => console.log(`Bussin Bean API listening on http://localhost:${PORT}`));
