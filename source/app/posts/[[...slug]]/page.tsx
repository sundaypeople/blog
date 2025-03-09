// app/posts/[...slug]/page.tsx

import { getPostBySlug,getMarkdownTree,MarkdownTree,postsDirectory } from '@/app/lib/posts'
import DirList from "@/app/components/DirList";

interface PostsProps {
  params: Promise<{ slug: string[] }>
}

export default async function PostPage({ params }: PostsProps) {
  // slug 配列をスラッシュで結合して文字列にする
  const slug = (await params).slug
  let a = ""
  if (slug != undefined) {
    a = slug.join('/')
  }
  const slugStr = a
  if (slugStr.endsWith(".md")) {
    const post = await getPostBySlug(slugStr)
    const tree = await getMarkdownTree(postsDirectory)
    console.log(tree)
    if (!post) {
      // Next.js の notFound を使うなどして 404 ページを表示できます
      return <div>記事が見つかりません</div>
    }

    return (
      <>
        <article className="prose mx-auto py-8  leading-snug">
          <div className='mb-2 -mt-16'>
            <h1>{post.title}</h1>
            <p className=''>{post.date}</p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </>
    )

  }else {
    const tree = await getMarkdownTree(postsDirectory + "/" + slugStr)
    // const posts = await getAllPosts()
    
    console.log(tree)
    return (
      <>
        <DirList tree={tree}/>
         {/* <PostsList posts={posts} groups={groups} tags={tags} /> */}
      </>
    )  }
}

export async function generateStaticParams() {
  const tree = await getMarkdownTree(postsDirectory)

  const paths:string[] = []
  const aaa = (tree:MarkdownTree) =>  {
    tree.files.map((v) => {
      paths.push(v.slug)
    })
    for(const key in tree.subdirs){
      if (Object.prototype.hasOwnProperty.call(tree.subdirs, key)) {
        paths.push(key)
        aaa(tree.subdirs[key])
      }
    }
  }
  aaa(tree)
  paths.push("");


  return paths.map((p) => ({ slug: p.split('/') }))
}
