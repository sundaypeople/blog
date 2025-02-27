// lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostData {
  slug: string
  title: string
  date: string
  content: string
  // 他に必要なフィールドがあれば追加
}

export async function getAllPosts(): Promise<PostData[]> {
  const fileNames = fs.readdirSync(postsDirectory)
  console.log(fileNames)
  const allPosts = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      const { data, content } = matter(fileContents)
      const processedContent = await remark().use(html).process(content)
      const contentHtml = processedContent.toString()

      return {
        slug,
        title: data.title,
        date: data.date,
        content: contentHtml,
      }
    })
  )
  // 例：日付順にソート
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) {
    return null
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    title: data.title,
    date: data.date,
    content: contentHtml,
  }
}
