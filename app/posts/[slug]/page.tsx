// app/posts/[slug]/page.tsx
import { getPostBySlug } from '@/app/lib/posts'

interface PageProps {
  params: { slug: string }
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)
  console.log(post?.content)
  if (!post) {
    // Next.js の notFound を使って404ページを表示することも可能
    return <div>記事が見つかりません</div>
  }
  return (
    // <article className="prose lg:prose-xl mx-auto py-8">
    <div>
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
    // </article>
  )
}
