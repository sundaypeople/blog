// app/posts/[slug]/page.tsx
import { getPostBySlug } from '@/app/lib/posts'

interface PageProps {
  params: { slug: string } | Promise<{ slug: string }>
}

export default async function PostPage(props: PageProps) {
  // params を await してから利用
  const { slug } = await props.params
  const post = await getPostBySlug(slug)

  if (!post) {
    // Next.js の notFound を使うなどして 404 ページを表示できます
    return <div>記事が見つかりません</div>
  }

  return (
    <article className="prose lg:prose-xl mx-auto py-8">
      <h1 className='text-xl'>{post.title}</h1>
      <p>{post.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
