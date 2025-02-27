// app/posts/page/[page]/page.tsx
import Link from 'next/link'
import { getAllPosts, PostData } from '@/app/lib/posts'

const POSTS_PER_PAGE = 5

interface PageProps {
  params: { page: string }
}

export default async function PostsPage({ params }: PageProps) {
  const currentPage = parseInt(params.page, 10) || 1
  const allPosts: PostData[] = await getAllPosts()
  console.log(allPosts)
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)

  const start = (currentPage - 1) * POSTS_PER_PAGE
  const currentPosts = allPosts.slice(start, start + POSTS_PER_PAGE)
  console.log(currentPage)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">ブログ一覧</h1>
      <ul>
        {currentPosts.map((post) => (
          <li key={post.slug} className="mb-4">
            <Link href={`/posts/${post.slug}`} className="text-xl text-blue-600 hover:underline">
            {post.title}
            </Link>
            <p className="text-gray-500">{post.date}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-8">
        {currentPage > 1 ? (
          <Link href={`/posts/page/${currentPage - 1}`}>
            <a className="text-blue-600 hover:underline">前のページ</a>
          </Link>
        ) : <span /> }
        {currentPage < totalPages ? (
          <Link href={`/posts/page/${currentPage + 1}`}>
            <a className="text-blue-600 hover:underline">次のページ</a>
          </Link>
        ) : <span /> }
      </div>
    </div>
  )
}
