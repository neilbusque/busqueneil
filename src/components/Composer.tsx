import { useState } from 'preact/hooks';
import { browserClient } from '../lib/supabase';
import type { Post, PostType, PostImage } from '../lib/types';

const TYPES: { value: PostType; label: string }[] = [
  { value: 'status', label: 'Status' },
  { value: 'article', label: 'Article' },
  { value: 'project', label: 'Project' },
  { value: 'now', label: 'Now' },
];

interface Props {
  recent: Partial<Post>[];
}

/** Downscale to max 1600px and re-encode as WebP before upload. */
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b ?? file), 'image/webp', 0.85)
  );
}

export default function Composer({ recent }: Props) {
  const [type, setType] = useState<PostType>('status');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [bodyMd, setBodyMd] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [tags, setTags] = useState('');
  const [stack, setStack] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [images, setImages] = useState<PostImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState(recent);

  const hasTitle = type !== 'status';

  function reset() {
    setType('status');
    setTitle('');
    setSlug('');
    setBodyMd('');
    setLinkUrl('');
    setTags('');
    setStack('');
    setLiveUrl('');
    setRepoUrl('');
    setImages([]);
    setEditingId(null);
  }

  async function uploadFiles(files: FileList | File[]) {
    const sb = browserClient();
    if (!sb) {
      setMessage('Supabase is not configured.');
      return;
    }
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const blob = await compressImage(file);
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.webp`;
        const { error } = await sb.storage.from('post-images').upload(path, blob, {
          contentType: 'image/webp',
        });
        if (error) {
          setMessage(`Upload failed: ${error.message}`);
          continue;
        }
        const bitmap = await createImageBitmap(blob);
        setImages((prev) => [...prev, { path, width: bitmap.width, height: bitmap.height }]);
      }
    } finally {
      setBusy(false);
    }
  }

  async function save(status: 'draft' | 'published') {
    setBusy(true);
    setMessage('');
    try {
      const payload: Record<string, unknown> = {
        id: editingId ?? undefined,
        type,
        title: hasTitle && title ? title : null,
        slug: slug || undefined,
        body_md: bodyMd,
        link_url: linkUrl || null,
        images,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        status,
      };
      if (type === 'project') {
        payload.project_meta = {
          name: title || undefined,
          stack: stack.split(',').map((s) => s.trim()).filter(Boolean),
          live_url: liveUrl || undefined,
          repo_url: repoUrl || undefined,
        };
      }
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? 'Save failed.');
        return;
      }
      setPosts((prev) => {
        const rest = prev.filter((p) => p.id !== data.post.id);
        return [data.post, ...rest];
      });
      setMessage(status === 'published' ? 'Published. Live within a minute.' : 'Draft saved.');
      reset();
    } finally {
      setBusy(false);
    }
  }

  function edit(p: Partial<Post>) {
    setEditingId(p.id ?? null);
    setType((p.type as PostType) ?? 'status');
    setTitle(p.title ?? '');
    setSlug(p.slug ?? '');
    setBodyMd(p.body_md ?? '');
    setLinkUrl(p.link_url ?? '');
    setTags((p.tags ?? []).join(', '));
    setImages(p.images ?? []);
    setStack((p.project_meta?.stack ?? []).join(', '));
    setLiveUrl(p.project_meta?.live_url ?? '');
    setRepoUrl(p.project_meta?.repo_url ?? '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function remove(id: string) {
    if (!confirm('Delete this post for good?')) return;
    const res = await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">
        {TYPES.map((t) => (
          <button
            key={t.value}
            class={type === t.value ? 'btn' : 'btn ghost'}
            style="padding:8px 16px; font-size:13px;"
            onClick={() => setType(t.value)}
            type="button"
          >
            {t.label}
          </button>
        ))}
        {editingId && (
          <span style="align-self:center; font-size:13px; color:var(--muted);">
            editing · <a href="#" onClick={(e) => { e.preventDefault(); reset(); }}>cancel</a>
          </span>
        )}
      </div>

      <div style="display:grid; gap:12px;">
        {hasTitle && (
          <input
            type="text"
            placeholder={type === 'project' ? 'Project name' : 'Title'}
            value={title}
            onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          />
        )}
        {hasTitle && (
          <input
            type="text"
            placeholder="Slug (optional, auto from title)"
            value={slug}
            onInput={(e) => setSlug((e.target as HTMLInputElement).value)}
          />
        )}
        <textarea
          rows={type === 'article' ? 16 : 6}
          placeholder={
            type === 'status'
              ? 'What did you ship or learn? Markdown works.'
              : 'Markdown body. Code blocks get syntax highlighting.'
          }
          value={bodyMd}
          onInput={(e) => setBodyMd((e.target as HTMLTextAreaElement).value)}
          onPaste={(e) => {
            const files = Array.from(e.clipboardData?.files ?? []);
            if (files.length) {
              e.preventDefault();
              uploadFiles(files);
            }
          }}
        />
        {type === 'project' && (
          <>
            <input type="text" placeholder="Stack (comma separated)" value={stack}
              onInput={(e) => setStack((e.target as HTMLInputElement).value)} />
            <input type="url" placeholder="Live URL" value={liveUrl}
              onInput={(e) => setLiveUrl((e.target as HTMLInputElement).value)} />
            <input type="url" placeholder="Repo URL" value={repoUrl}
              onInput={(e) => setRepoUrl((e.target as HTMLInputElement).value)} />
          </>
        )}
        {type === 'status' && (
          <input type="url" placeholder="Link (optional)" value={linkUrl}
            onInput={(e) => setLinkUrl((e.target as HTMLInputElement).value)} />
        )}
        <input type="text" placeholder="Tags (comma separated)" value={tags}
          onInput={(e) => setTags((e.target as HTMLInputElement).value)} />

        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
          <label class="btn ghost" style="cursor:pointer;">
            {busy ? 'Working…' : 'Add image'}
            <input
              type="file"
              accept="image/*"
              multiple
              style="display:none;"
              onChange={(e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files?.length) uploadFiles(files);
              }}
            />
          </label>
          {images.map((img) => (
            <span key={img.path} style="font-size:12px; color:var(--muted);">
              {img.path}{' '}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setImages((prev) => prev.filter((i) => i.path !== img.path));
              }}>×</a>
            </span>
          ))}
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn" disabled={busy || !bodyMd.trim()} onClick={() => save('published')} type="button">
            Publish
          </button>
          <button class="btn ghost" disabled={busy || !bodyMd.trim()} onClick={() => save('draft')} type="button">
            Save draft
          </button>
          {message && <span style="align-self:center; font-size:13.5px; color:var(--ink-soft);">{message}</span>}
        </div>
      </div>

      <h2 style="font-family:var(--serif); font-size:22px; margin:42px 0 14px; padding-top:24px; border-top:2px solid var(--ink);">
        Recent
      </h2>
      <div>
        {posts.map((p) => (
          <div key={p.id} style="display:flex; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid var(--hairline); font-size:14px;">
            <div style="min-width:0;">
              <span style="font-size:10.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--coral); margin-right:8px;">
                {p.type}
              </span>
              {p.status === 'draft' && (
                <span style="font-size:10.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-right:8px;">
                  draft
                </span>
              )}
              <span style="color:var(--ink-soft); overflow:hidden; text-overflow:ellipsis;">
                {p.title ?? p.body_md?.slice(0, 60)}
              </span>
            </div>
            <div style="flex-shrink:0;">
              <a href="#" onClick={(e) => { e.preventDefault(); edit(p); }} style="color:var(--coral); margin-right:12px;">Edit</a>
              <a href="#" onClick={(e) => { e.preventDefault(); if (p.id) remove(p.id); }} style="color:var(--muted);">Delete</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
