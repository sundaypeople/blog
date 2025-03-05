// pages/index.js or similar (Next.jsページコンポーネント)
import Link from 'next/link'  // 必要に応じてNext.jsのLinkをインポート
import { getAllPosts } from '@/app/lib/posts';

export default async function HomePage() {
  const posts = (await getAllPosts()).slice(0, 2)
  
  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 px-6 text-center mt-28">  
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          学習記録ブログ
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          最新のインフラ技術や開発ノウハウをお届けしたいブログです。
        </p>
        <Link href="/search" className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded">
            記事を読む
        </Link>
      </section>

      {/* Article List Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">最新記事</h2>
        <ul className="divide-y divide-gray-200">
          {posts.map(post => (
            <li key={post.slug} className="py-6 flex flex-col">  
              {/* 記事タイトル */}
              <Link href={`/posts/${post.slug}`} className="text-xl font-semibold text-gray-900 hover:underline">
                  {post.title}
              </Link>
              {/* 概要 */}
              <p className="text-gray-700 text-sm mt-2">
                {post.date} | {post.group} | {post.tags.join(', ')}
              </p>
              <p className="text-gray-700 text-sm mt-2">
                {post.content.substring(0, 100).replace(/<[^>]+>/g, '')}...
              </p>
              {/* 日付などのメタ情報 */}
              <span className="text-gray-500 text-xs mt-2">
                公開日: {post.date}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
