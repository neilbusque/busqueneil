export type PostType = 'status' | 'article' | 'project' | 'now';

export interface PostImage {
  path: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ProjectMeta {
  name?: string;
  stack?: string[];
  repo_url?: string;
  live_url?: string;
  screenshot?: string;
}

export interface Post {
  id: string;
  type: PostType;
  slug: string;
  title: string | null;
  body_md: string;
  body_html: string;
  excerpt: string | null;
  link_url: string | null;
  project_meta: ProjectMeta | null;
  images: PostImage[];
  tags: string[];
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
