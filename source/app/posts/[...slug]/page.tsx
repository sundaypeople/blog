// app/posts/[...slug]/page.tsx
import { getPostBySlug } from '@/app/lib/posts'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { slug: string[] }
}

export default async function PostPage({ params }: PageProps) {
  // slug 配列をスラッシュで結合して文字列にする
  const slugStr = params.slug.join('/')
  console.log(slugStr)
  const post = await getPostBySlug(slugStr)
  if (!post) {
    // Next.js の notFound を使うなどして 404 ページを表示できます
    return <div>記事が見つかりません</div>
  }

  return (
    <article className="prose lg:prose-xl mx-auto py-8">
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
