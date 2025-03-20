import Link from 'next/link';
import Image from 'next/image';
import { getAllPhotoPosts } from '@/lib/mdx';
import { getAssetPath } from '@/lib/utils';

export default async function Home() {
  // 使用server component异步获取数据
  const posts = await Promise.resolve(getAllPhotoPosts());
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8">LensRoute</h1>
        <p className="text-xl mb-12">我的摄影旅途与作品展示</p>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/photos/${post.slug}`} 
                className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 w-full">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage.startsWith('./') 
                        ? getAssetPath(`/images/${post.slug}/${post.coverImage.substring(2)}`)
                        : post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      无封面图片
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-600">{post.date}</p>
                  {post.location?.name && (
                    <p className="text-sm text-gray-600 mt-1">{post.location.name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p>还没有摄影作品。开始添加你的第一个摄影集吧！</p>
          </div>
        )}
      </div>
    </main>
  );
}