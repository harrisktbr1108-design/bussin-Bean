import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesStrip } from './components/FeaturesStrip';
import { MenuSection } from './components/MenuSection';
import { About } from './components/About';
import { ReviewsSection } from './components/ReviewsSection';
import { BlogSection, DEFAULT_BLOG_POSTS, BlogPost } from './components/BlogSection';
import { StatsBar } from './components/StatsBar';
import { ValueStrip } from './components/ValueStrip';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { OrderModal, CartItem } from './components/OrderModal';
import { CoffeeAddOn, MENU_ITEMS, MenuItem } from './data/menu';
import { AdminLayout } from './components/AdminLayout';
import { CustomerDiscount, CustomerOrder } from './adminTypes';
import { getStoreHoursState } from './operatingHours';
import { apiRequest, apiToken } from './api';

const buildCartKey = (itemId: string, addOns: CoffeeAddOn[] = []) => `${itemId}:${addOns.map(addOn => addOn.id).sort().join('|')}`;

export function App() {
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [override, setOverride] = useState(false);
  const [discounts, setDiscounts] = useState<CustomerDiscount[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);

  useEffect(() => { apiRequest<MenuItem[]>('/menu').then(setItems).catch(() => undefined); }, []);
  useEffect(() => { apiRequest<BlogPost[]>('/blog').then(setBlogPosts).catch(() => undefined); }, []);
  useEffect(() => {
    if (!isAdmin || !apiToken()) return;
    const token = apiToken();
    Promise.all([
      apiRequest<MenuItem[]>('/admin/menu', {}, token),
      apiRequest<CustomerOrder[]>('/admin/orders', {}, token),
      apiRequest<CustomerDiscount[]>('/admin/discounts', {}, token),
      apiRequest<BlogPost[]>('/admin/blog', {}, token),
    ]).then(([menu, loadedOrders, loadedDiscounts, loadedBlogPosts]) => { setItems(menu); setOrders(loadedOrders); setDiscounts(loadedDiscounts); setBlogPosts(loadedBlogPosts.length ? loadedBlogPosts : DEFAULT_BLOG_POSTS); }).catch(() => undefined);
  }, [isAdmin]);

  const handleAddToCart = (item: MenuItem, addOns: CoffeeAddOn[] = []) => {
    const key = buildCartKey(item.id, addOns);
    setCart(prev => {
      const ex = prev.find(c => c.key === key);
      if (ex) return prev.map(c => c.key === key ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { item, quantity: 1, addOns, key }];
    });
  };

  const handleUpdateQuantity = (key: string, delta: number) =>
    setCart(prev =>
      prev.map(c => c.key === key ? { ...c, quantity: c.quantity + delta } : c)
          .filter(c => c.quantity > 0));

  const handleRemoveItem = (key: string) =>
    setCart(prev => prev.filter(c => c.key !== key));

  const totalCount = cart.reduce((a, c) => a + c.quantity, 0);

  const createOrder = async (orderItems: CartItem[], total: number, contactNumber: string, address: string) => {
    const order = await apiRequest<{ id: string; status: CustomerOrder['status'] }>('/orders', { method: 'POST', body: JSON.stringify({ items: orderItems, total, contactNumber, address }) });
    const savedOrder: CustomerOrder = { id: order.id, items: orderItems, total, contactNumber, address, status: order.status, createdAt: new Date().toISOString() };
    setOrders(prev => [...prev, savedOrder]);
    return savedOrder;
  };

  const saveItems = async (nextItems: MenuItem[]) => {
    const token = apiToken();
    const previousIds = new Set(items.map(item => item.id));
    const nextIds = new Set(nextItems.map(item => item.id));
    await Promise.all(nextItems.map(item => apiRequest(`/admin/menu/${item.id}`, { method: 'PUT', body: JSON.stringify(item) }, token)));
    await Promise.all([...previousIds].filter(id => !nextIds.has(id)).map(id => apiRequest(`/admin/menu/${id}`, { method: 'DELETE' }, token)));
    setItems(nextItems);
  };

  const saveOrders = async (nextOrders: CustomerOrder[]) => {
    const changed = nextOrders.find(next => orders.find(current => current.id === next.id)?.status !== next.status);
    if (changed) await apiRequest(`/admin/orders/${changed.id}`, { method: 'PATCH', body: JSON.stringify({ status: changed.status }) }, apiToken());
    setOrders(nextOrders);
  };

  const saveDiscounts = async (nextDiscounts: CustomerDiscount[]) => {
    const previous = new Map(discounts.map(discount => [discount.id, discount]));
    await Promise.all(nextDiscounts.filter(discount => !previous.has(discount.id)).map(discount => apiRequest('/admin/discounts', { method: 'POST', body: JSON.stringify(discount) }, apiToken())));
    await Promise.all(discounts.filter(discount => !nextDiscounts.some(next => next.id === discount.id)).map(discount => apiRequest(`/admin/discounts/${discount.id}`, { method: 'DELETE' }, apiToken())));
    setDiscounts(nextDiscounts);
  };

  const saveBlogPosts = async (nextPosts: BlogPost[]) => {
    const token = apiToken();
    const previousIds = new Set(blogPosts.map(post => post.id));
    const nextIds = new Set(nextPosts.map(post => post.id));
    await Promise.all(nextPosts.map(post => apiRequest(`/admin/blog/${post.id}`, { method: 'PUT', body: JSON.stringify(post) }, token)));
    await Promise.all([...previousIds].filter(id => !nextIds.has(id)).map(id => apiRequest(`/admin/blog/${id}`, { method: 'DELETE' }, token)));
    setBlogPosts(nextPosts);
  };

  if (isAdmin) return <AdminLayout items={items} orders={orders} discounts={discounts} blogPosts={blogPosts} setItems={saveItems} setOrders={saveOrders} setDiscounts={saveDiscounts} setBlogPosts={saveBlogPosts} override={override} setOverride={setOverride} onExit={() => setIsAdmin(false)} />;

  const storeOpen = getStoreHoursState(new Date(), override).isOpen;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FAF6F0', color: '#120703' }}>

      {/* ── Global fixed background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=70&w=1920"
          alt="Bussin Bean Ambiance"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) contrast(1.05)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(250,246,240,0.82) 0%, rgba(250,246,240,0.78) 50%, rgba(250,246,240,0.88) 100%)' }} />
      </div>

      {/* ── All page content sits above bg ── */}
      <main className="relative z-10">
        <Navbar items={items} cartCount={totalCount} onOpenCart={() => setIsCartOpen(true)} onOpenAdmin={() => setIsAdmin(true)} />
        <Hero />
        <FeaturesStrip />
        <MenuSection items={items} onAddToCart={handleAddToCart} />
        <About />
        <ReviewsSection />
        <BlogSection posts={blogPosts} />
        <StatsBar />
        <ValueStrip />
        <CTA />
        <Footer />
        <OrderModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={() => setCart([])}
          storeOpen={storeOpen}
          onCreateOrder={createOrder}
          orders={orders}
          discounts={discounts}
        />
      </main>
    </div>
  );
}
export default App;
