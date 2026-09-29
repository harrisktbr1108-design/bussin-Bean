import React, { useMemo, useState } from 'react';
import { Edit3, Plus, Trash2 } from 'lucide-react';

export interface BlogPostDraft {
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

export interface BlogPost extends BlogPostDraft {}

interface Props {
  posts: BlogPost[];
  onChange: (posts: BlogPost[]) => void;
}

const defaultDraft = (): BlogPostDraft => ({
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: [''],
  author: 'Bussin Bean Team',
  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  readTime: '3 min read',
  category: 'Coffee Lifestyle',
  image: '/images/hero_bg.png',
  tags: ['Bussin Bean'],
});

const normalizeDraft = (draft: BlogPostDraft): BlogPost => {
  const title = draft.title.trim();
  const slug = (draft.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).trim();
  const content = draft.content
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return {
    ...draft,
    id: draft.id || slug || `blog-${Date.now()}`,
    title,
    slug,
    excerpt: draft.excerpt.trim() || content[0]?.slice(0, 180) || 'Fresh coffee stories from Bussin Bean.',
    content: content.length ? content : ['Coffee is always a good idea.'],
    author: draft.author.trim() || 'Bussin Bean Team',
    date: draft.date || new Date().toISOString().slice(0, 10),
    readTime: draft.readTime.trim() || '3 min read',
    category: draft.category.trim() || 'Coffee Lifestyle',
    image: draft.image.trim() || '/images/hero_bg.png',
    tags: draft.tags.filter(Boolean),
  };
};

export const AdminBlogManager: React.FC<Props> = ({ posts, onChange }) => {
  const [draft, setDraft] = useState<BlogPostDraft>(defaultDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');

  const preview = useMemo(() => normalizeDraft(draft), [draft]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Please choose an image smaller than 2 MB.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('image', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setDraft(defaultDraft());
    setEditingId(null);
    setError('');
  };

  const handleSave = () => {
    if (!draft.title.trim()) {
      setError('Add a blog title before saving.');
      return;
    }

    const normalized = normalizeDraft(draft);
    const nextPosts = editingId
      ? posts.map((post) => (post.id === editingId ? normalized : post))
      : [normalized, ...posts];

    onChange(nextPosts);
    resetForm();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setDraft({
      ...post,
      content: post.content,
      tags: post.tags,
    });
    setError('');
  };

  const handleDelete = (postId: string) => {
    onChange(posts.filter((post) => post.id !== postId));
    if (editingId === postId) resetForm();
  };

  const updateField = <K extends keyof BlogPostDraft>(field: K, value: BlogPostDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  return (
    <div>
      <div style={toolbar}>
        <div>
          <p style={eyebrow}>STORE CONTENT</p>
          <h2 style={heading}>Blog posts</h2>
        </div>
        <button onClick={resetForm} style={primary}>
          <Plus size={15} /> NEW POST
        </button>
      </div>

      <div style={panel}>
        <div style={grid}>
          <label style={field}>
            <span>Title</span>
            <input value={draft.title} onChange={(event) => updateField('title', event.target.value)} style={input} placeholder="Coffee Is Always a Good Idea" />
          </label>
          <label style={field}>
            <span>Category</span>
            <input value={draft.category} onChange={(event) => updateField('category', event.target.value)} style={input} placeholder="Coffee Lifestyle" />
          </label>
          <label style={field}>
            <span>Author</span>
            <input value={draft.author} onChange={(event) => updateField('author', event.target.value)} style={input} placeholder="Bussin Bean Team" />
          </label>
          <label style={field}>
            <span>Read time</span>
            <input value={draft.readTime} onChange={(event) => updateField('readTime', event.target.value)} style={input} placeholder="3 min read" />
          </label>
          <label style={field}>
            <span>Date</span>
            <input value={draft.date} onChange={(event) => updateField('date', event.target.value)} style={input} placeholder="29 Sep 2026" />
          </label>
          <label style={field}>
            <span>Image URL / upload</span>
            <input value={draft.image} onChange={(event) => updateField('image', event.target.value)} style={input} placeholder="/images/hero_bg.png" />
            <input type="file" accept="image/png,image/jpeg,image/webp,image/jpg" onChange={handleImageUpload} style={fileInput} />
            {imageError && <span style={errorText}>{imageError}</span>}
          </label>
        </div>

        <label style={field}>
          <span>Excerpt</span>
          <textarea value={draft.excerpt} onChange={(event) => updateField('excerpt', event.target.value)} style={{ ...input, minHeight: 80, resize: 'vertical' }} placeholder="A short summary for the storefront card" />
        </label>

        <label style={field}>
          <span>Tags</span>
          <input value={draft.tags.join(', ')} onChange={(event) => updateField('tags', event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean))} style={input} placeholder="Coffee Mood, Daily Ritual" />
        </label>

        <label style={field}>
          <span>Article text</span>
          <textarea value={draft.content.join('\n\n')} onChange={(event) => updateField('content', event.target.value.split(/\n{2,}/).map((line) => line.trim()).filter(Boolean))} style={{ ...input, minHeight: 160, resize: 'vertical' }} placeholder="Paragraph 1\n\nParagraph 2" />
        </label>

        {error && <p style={errorText}>{error}</p>}

        <div style={previewCard}>
          <img src={preview.image || '/images/hero_bg.png'} alt={preview.title || 'Blog preview'} style={previewImage} />
          <div>
            <p style={tag}>{preview.category}</p>
            <h3 style={previewTitle}>{preview.title || 'Your new blog title'}</h3>
            <p style={previewExcerpt}>{preview.excerpt || 'Your article summary will appear here.'}</p>
          </div>
        </div>

        <div style={actions}>
          <button onClick={handleSave} style={primary}>
            {editingId ? <><Edit3 size={15} /> UPDATE POST</> : <><Plus size={15} /> SAVE POST</>}
          </button>
          {editingId && (
            <button onClick={resetForm} style={secondary}>
              CANCEL
            </button>
          )}
        </div>
      </div>

      <div style={listWrap}>
        {posts.length === 0 ? (
          <p style={empty}>No blog posts yet. Create the first article for the storefront.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={row}>
              <img src={post.image} alt={post.title} style={thumb} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 13 }}>{post.title}</strong>
                <span style={meta}>{post.category} · {post.date}</span>
              </div>
              <button onClick={() => handleEdit(post)} style={iconButton}><Edit3 size={14} /></button>
              <button onClick={() => handleDelete(post.id)} style={{ ...iconButton, color: '#963E2E' }}><Trash2 size={14} /></button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const toolbar: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 };
const eyebrow: React.CSSProperties = { color: '#B67538', fontSize: 10, fontWeight: 800, letterSpacing: '.14em', margin: 0 };
const heading: React.CSSProperties = { fontFamily: "'Playfair Display',serif", fontSize: 28, margin: '7px 0 0' };
const primary: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 7, border: 0, borderRadius: 10, padding: '11px 14px', background: '#302016', color: '#FFF9F0', fontWeight: 800, fontSize: 10, cursor: 'pointer' };
const secondary: React.CSSProperties = { border: 0, borderRadius: 10, padding: '11px 14px', background: '#F1E4D4', color: '#302016', fontWeight: 800, fontSize: 10, cursor: 'pointer' };
const panel: React.CSSProperties = { background: '#FFF9F2', border: '1px solid #E4D7C7', borderRadius: 18, padding: 18, marginBottom: 18 };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 };
const field: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8, color: '#5C3318', fontSize: 11, fontWeight: 700, marginBottom: 12 };
const input: React.CSSProperties = { border: '1px solid #E4D7C7', borderRadius: 10, padding: '10px 12px', background: '#FFF', fontSize: 13, fontFamily: 'inherit', color: '#120703', width: '100%' };
const previewCard: React.CSSProperties = { display: 'flex', gap: 16, alignItems: 'center', background: '#F8E9D4', border: '1px solid #E9D5B7', borderRadius: 16, padding: 12, marginTop: 12 };
const previewImage: React.CSSProperties = { width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(18,7,3,0.08)' };
const tag: React.CSSProperties = { margin: '0 0 4px', fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#B67538' };
const previewTitle: React.CSSProperties = { margin: 0, fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#120703' };
const previewExcerpt: React.CSSProperties = { margin: '8px 0 0', color: '#5C3318', fontSize: 12, lineHeight: 1.5 };
const actions: React.CSSProperties = { display: 'flex', gap: 10, marginTop: 18 };
const listWrap: React.CSSProperties = { background: '#FFF9F2', border: '1px solid #E4D7C7', borderRadius: 16, overflow: 'hidden' };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderBottom: '1px solid #EEE3D7' };
const thumb: React.CSSProperties = { width: 52, height: 52, borderRadius: 10, objectFit: 'cover' };
const meta: React.CSSProperties = { display: 'block', color: '#765A43', fontSize: 11, marginTop: 4 };
const iconButton: React.CSSProperties = { border: 0, background: '#F1E4D4', color: '#6D4A2D', width: 32, height: 32, borderRadius: 8, display: 'grid', placeItems: 'center', cursor: 'pointer' };
const empty: React.CSSProperties = { color: '#765A43', fontSize: 13, padding: 24, margin: 0 };
const errorText: React.CSSProperties = { color: '#963E2E', fontWeight: 700, fontSize: 12, margin: '8px 0 0' };
const fileInput: React.CSSProperties = { padding: '8px 10px', border: '1px solid #E4D7C7', borderRadius: 10, background: '#FFF', cursor: 'pointer' };
