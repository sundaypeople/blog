// app/page.tsx
import Link from 'next/link'
import { getAllPosts, PostData } from '@/app/lib/posts'

export default async function HomePage() {
  const posts: PostData[] = await getAllPosts()
  const latestPosts = posts.slice(0, 5) // 最新記事5件を表示

  return (
    <main className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Tech Blog</h1>
        <p className="text-lg text-gray-600">
          最新の技術情報と知見をお届けします。記事を通じて日々の学びを共有していきます。
        </p>
      </section>

      {/* 最新記事一覧 */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">最新記事</h2>
        <ul className="space-y-6">
          {latestPosts.map((post) => (
            <li key={post.slug} className="border-b pb-4">
              <Link href={`/posts/${post.slug}`} className="text-xl text-blue-600 hover:underline">
                  {post.title}
              </Link>
              <p className="text-gray-500">{post.date}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link href="/posts/page/1" className="inline-block text-blue-600 hover:underline">
              すべての記事を見る →
          </Link>
        </div>
      </section>
    </main>
  )
}
