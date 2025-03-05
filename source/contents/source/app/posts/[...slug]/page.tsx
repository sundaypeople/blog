// app/posts/[...slug]/page.tsx
import { getPostBySlug,getAllPosts } from '@/app/lib/posts'
interface MyProps {
  params: Promise<{ slug: string[] }>
}

export default async function PostPage({ params }: MyProps) {
  // slug 配列をスラッシュで結合して文字列にする
  const slug = (await params).slug
  const slugStr = slug.join('/')
  console.log(slugStr)
  const post = await getPostBySlug(slugStr)
  if (!post) {
    // Next.js の notFound を使うなどして 404 ページを表示できます
    return <div>記事が見つかりません</div>
  }

  return (
    <>
      <article className="prose lg:prose-xl mx-auto py-8">
        <div className='mb-16'>
          <h1>{post.title}</h1>
          <p className='-mt-8'>{post.date}</p>
        </div>

        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  )
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return (await posts).map((post) => ({
    slug: post.slug.split("/"),
  }));
}
