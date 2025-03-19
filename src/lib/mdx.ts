import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PhotoPost } from '@/types/photo';

const contentDirectory = path.join(process.cwd(), 'content/photos');

export function getAllPhotoPosts(): PhotoPost[] {
  // 确保目录存在
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  
  const directories = fs.readdirSync(contentDirectory);
  
  return directories.map(dir => {
    const fullPath = path.join(contentDirectory, dir, 'index.mdx');
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      slug: dir,
      ...data as Omit<PhotoPost, 'slug'>
    };
  }).filter((post): post is PhotoPost => post !== null);
}

export function getPhotoPostBySlug(slug: string): PhotoPost | null {
  const fullPath = path.join(contentDirectory, slug, 'index.mdx');
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    content,
    ...data as Omit<PhotoPost, 'slug' | 'content'>
  };
}