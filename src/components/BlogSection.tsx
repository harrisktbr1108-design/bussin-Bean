import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, ArrowRight, BookOpen, X } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
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
    date: 'September 29, 2026',
    readTime: '3 min read',
    category: 'Coffee Lifestyle',
    image: '/images/hero_bg.png',
    tags: ['Coffee Mood', 'Good Idea', 'Daily Ritual', 'Bussin Bean']
  },
  {
    id: 'shikarpur-arabica-craft',
    title: 'The Secrets of Crafting Premium 100% Arabica Coffee in Shikarpur',
    slug: 'secrets-crafting-arabica-coffee-shikarpur',
    excerpt: 'Discover how Bussin Bean brings world-class 100% Arabica coffee beans and artisanal roasting techniques straight to coffee lovers in Shikarpur.',
    content: [
      'Coffee is more than a beverage — it is a daily ritual of precision, passion, and flavor balance. At Bussin Bean in Shikarpur, our mission is simple: to roast and extract the finest 100% specialty Arabica coffee beans for our community.',
      'Unlike standard commercial blends that rely on harsh Robusta beans, our specialty Arabica beans are harvested at peak ripeness from high-altitude plantations. Every bean is small-batch roasted to unlock rich chocolatey undertones, natural sweetness, and a velvety smooth finish.',
      'Whether you are starting your morning with The Original Brew or relaxing late at night with our Spanish Sunset, every cup extracted at Bussin Bean follows strict temperature and pressure guidelines to ensure perfection in every single sip.'
    ],
    author: 'Head Roaster',
    date: 'September 24, 2026',
    readTime: '4 min read',
    category: 'Coffee Craft',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800',
    tags: ['Arabica Coffee', 'Shikarpur Coffee', 'Specialty Roast', 'Craft Brewing']
  },
  {
    id: 'vanilla-velvet-loaded-oreo-guide',
    title: "Why Vanilla Velvet & Loaded Oreo are Pakistan's Favorite Cold Brew Escapes",
    slug: 'vanilla-velvet-loaded-oreo-favorite-cold-brew',
    excerpt: 'An inside look at the creation of our viral Loaded Oreo and Vanilla Velvet signature drinks — crafted with French vanilla, cold foam, and Belgian chocolate.',
    content: [
      'In the warm climate of Sindh, nothing brings instant refreshment like a handcrafted cold coffee beverage. Our signature Loaded Oreo and Vanilla Velvet drinks have quickly captured the hearts of coffee enthusiasts across Shikarpur.',
      'The Loaded Oreo frappe combines slow-extracted cold espresso with crushed Oreo cookies, creamy milk, and rich Belgian chocolate drizzles. It offers the ultimate balance of crunch and velvety sweetness.',
      'Meanwhile, the Vanilla Velvet is crafted for those who adore silky elegance: cold-extracted French vanilla syrup layered with double-shot espresso and crowned with a thick vanilla cold foam cloud. Experience them fresh at Bussin Bean today!'
    ],
    author: 'Beverage Alchemist',
    date: 'September 20, 2026',
    readTime: '5 min read',
    category: 'Signature Drinks',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    tags: ['Loaded Oreo', 'Vanilla Velvet', 'Cold Coffee', 'Shikarpur Drinks']
  },
  {
    id: 'express-delivery-shikarpur',
    title: 'From Bean to Cup: How Bussin Bean Delivers Fresh Brews 11 AM to 1 AM',
    slug: 'express-coffee-delivery-shikarpur-hours',
    excerpt: 'Need late-night coffee or a midday iced latte fix in Shikarpur? Learn about our fast express delivery service active daily from 11:00 AM to 1:00 AM.',
    content: [
      'Great coffee should be accessible whenever cravings strike. That is why Bussin Bean offers express local delivery in Shikarpur from 11:00 AM all the way until 1:00 AM at night.',
      'Every order placed via our website or WhatsApp (+92 335 3491964) is freshly ground, extracted, and packaged in temperature-insulated branded cups to preserve aroma, crema, and chill.',
      'Whether you are studying late, hanging out with friends, or starting your workday, enjoying authentic specialty coffee in Shikarpur has never been easier.'
    ],
    author: 'Bussin Delivery Team',
    date: 'September 15, 2026',
    readTime: '3 min read',
    category: 'Cafe News',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    tags: ['Express Delivery', 'Late Night Coffee', 'Shikarpur', 'Contact Us']
  }
];

export const BLOG_POSTS = DEFAULT_BLOG_POSTS;

export const BlogSection: React.FC<{ posts?: BlogPost[] }> = ({ posts = DEFAULT_BLOG_POSTS }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const visiblePosts = posts.length ? posts : DEFAULT_BLOG_POSTS;

  useEffect(() => {
    const title = 'Coffee Is Always a Good Idea | Bussin Bean Coffee Co.';
    const description = 'Read a warm coffee lifestyle story from Bussin Bean and explore our signature brews, craft coffee culture, and daily rituals in Shikarpur.';

    const updateMeta = (selector: string, value: string, attr: 'content' | 'property') => {
      const element = document.querySelector(selector) as HTMLMetaElement | null;
      if (element) {
        element.setAttribute(attr, value);
      }
    };

    document.title = title;
    updateMeta('meta[name="description"]', description, 'content');
    updateMeta('meta[property="og:title"]', title, 'content');
    updateMeta('meta[property="og:description"]', description, 'content');
    updateMeta('meta[property="twitter:title"]', title, 'content');
    updateMeta('meta[property="twitter:description"]', description, 'content');
  }, []);

  return (
    <section id="blog" style={{ padding: '72px 24px', maxWidth: 1280, margin: '0 auto' }}>
      
      {/* Container */}
      <div style={{
        background: 'rgba(250,246,240,0.80)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(18,7,3,0.10)',
        borderRadius: 28,
        padding: 'clamp(24px,4vw,56px)',
        boxShadow: '0 16px 48px rgba(18,7,3,0.08)',
      }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(196,126,56,0.30)', borderRadius: 999,
            padding: '6px 18px', fontSize: 10, fontWeight: 800,
            letterSpacing: '0.14em', color: '#C47E38', textTransform: 'uppercase',
            marginBottom: 14, boxShadow: '0 4px 12px rgba(18,7,3,0.05)',
          }}>
            <BookOpen size={13} color="#C47E38" />
            COFFEE JOURNAL & ARTICLES
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 'clamp(28px,4.5vw,48px)',
            fontWeight: 800, color: '#120703', margin: '0 0 10px', letterSpacing: '-0.01em'
          }}>
            Stories From Our Roastery
          </h2>
          <p style={{ fontSize: 14, color: '#5C3318', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
            Explore artisanal brewing guides, flavor profiles, and news about specialty coffee culture in Shikarpur.
          </p>
          <div style={{ width: 60, height: 3, background: '#C47E38', borderRadius: 999, margin: '18px auto 0' }} />
        </div>

        {/* Blog Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28
        }}>
          {visiblePosts.map(post => (
            <article
              key={post.id}
              style={{
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(18,7,3,0.10)',
                borderRadius: 20,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(18,7,3,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Cover Image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  loading="lazy"
                />
                <span style={{
                  position: 'absolute', top: 12, left: 12,
                  background: 'rgba(18,7,3,0.85)', color: '#FAF6F0',
                  backdropFilter: 'blur(8px)',
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
                  textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999,
                  border: '1px solid rgba(196,126,56,0.30)',
                }}>
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: '#5C3318', marginBottom: 10, fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} color="#C47E38" /> {post.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} color="#C47E38" /> {post.readTime}</span>
                </div>

                <h3 style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 18, fontWeight: 800, color: '#120703',
                  margin: '0 0 10px', lineHeight: 1.3
                }}>
                  {post.title}
                </h3>

                <p style={{
                  fontSize: 13, color: '#4A2710', lineHeight: 1.6,
                  margin: '0 0 16px', flex: 1
                }}>
                  {post.excerpt}
                </p>

                {/* Read Full Article Button */}
                <button
                  onClick={() => setSelectedPost(post)}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    color: '#C47E38', fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', gap: 6,
                    cursor: 'pointer', marginTop: 'auto',
                  }}
                >
                  READ ARTICLE <ArrowRight size={14} color="#C47E38" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Detail Modal */}
      {selectedPost && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(18,7,3,0.65)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            background: '#FAF6F0', borderRadius: 28,
            maxWidth: 680, width: '100%', maxHeight: '90vh',
            overflowY: 'auto', padding: 'clamp(24px,4vw,40px)',
            border: '1px solid rgba(18,7,3,0.12)',
            boxShadow: '0 32px 80px rgba(18,7,3,0.25)',
            position: 'relative',
          }}>
            <button
              onClick={() => setSelectedPost(null)}
              style={{
                position: 'absolute', top: 20, right: 20,
                background: '#F4ECE1', border: '1px solid rgba(18,7,3,0.10)',
                borderRadius: '50%', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10,
              }}
              aria-label="Close Modal"
            >
              <X size={18} color="#120703" />
            </button>

            <span style={{
              background: '#3D2314', color: '#FAF6F0',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '5px 12px', borderRadius: 999,
              display: 'inline-block', marginBottom: 12,
            }}>
              {selectedPost.category}
            </span>

            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(22px,3.5vw,32px)',
              fontWeight: 800, color: '#120703', margin: '0 0 12px', lineHeight: 1.25
            }}>
              {selectedPost.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: '#5C3318', marginBottom: 20, fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={13} color="#C47E38" /> {selectedPost.author}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} color="#C47E38" /> {selectedPost.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} color="#C47E38" /> {selectedPost.readTime}</span>
            </div>

            <div style={{ borderRadius: 16, overflow: 'hidden', height: 260, marginBottom: 24 }}>
              <img src={selectedPost.image} alt={selectedPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14, color: '#2A160A', lineHeight: 1.75 }}>
              {selectedPost.content.map((p, idx) => (
                <p key={idx} style={{ margin: 0 }}>{p}</p>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(18,7,3,0.10)' }}>
              {selectedPost.tags.map(t => (
                <span key={t} style={{
                  fontSize: 10, fontWeight: 700, background: '#F4ECE1',
                  color: '#5C3318', padding: '4px 10px', borderRadius: 8,
                  border: '1px solid rgba(18,7,3,0.08)',
                }}>
                  #{t}
                </span>
              ))}
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
