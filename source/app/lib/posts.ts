// app/lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import remarkExpressiveCode from 'rehype-expressive-code'


import rehypeAddCopyButton from './rehype-clustom-plugin' // 下記で作成するカスタムプラグイン

import { execSync } from 'child_process'

export interface PostData {
  slug: string
  title: string
  date: string
  content: string
  group: string
  tags: string[]
}

// 記事は contests 以下に置く前提
const env = process.env.NEXT_PUBLIC_ENV

let dir = ""
if(env == "dev") {
   dir = path.join(process.cwd(), 'test-contents')
}else {
   dir = path.join(process.cwd(), 'contents')
}
console.log(dir)
const postsDirectory = dir
// 再帰的に Markdown ファイルを取得
function getMarkdownFiles(dir: string): string[] {
  let files: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(getMarkdownFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  return files
}

// 指定ファイルの git 最新コミット日時を ISO 8601 形式で取得
function getGitCommitDate(filePath: string): string {
  try {
    // cwd を postsDirectory に設定して、対象ファイルのパスを相対パスで指定
    const relativeFilePath = path.relative(postsDirectory, filePath)
    const stdout = execSync(
      `git log -1 --format=%aI ${relativeFilePath}`,
      { cwd: postsDirectory }
    )
      .toString()
      .trim()
    return stdout.split('T')[0]
  } catch (error) {
    console.error(`Error retrieving git commit date for ${filePath}: `, error)
    return ''
  }
}

export async function getAllPosts(): Promise<PostData[]> {
  const filePaths = getMarkdownFiles(postsDirectory)
  const posts = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const processedContent = await  unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .use(remarkExpressiveCode,{ themes: ["material-theme"]})
      .process(content)

      const contentHtml = processedContent.toString()

      // グループは contests/ 以下の最初のディレクトリ名とする
      const relativePath = path.relative(postsDirectory, filePath)
      const group = relativePath.split(path.sep)[0]
      // slug は拡張子除去後、パス区切りをスラッシュに置換
      const slug = relativePath.replace(/\.md$/, '').replace(new RegExp(`\\${path.sep}`, 'g'), '/')

      // git の最新コミット日時を date に利用
      const commitDate = getGitCommitDate(filePath)

      // front matter の tags を配列で取得（存在しない場合は空配列）
      const tags = data.tags
        ? (Array.isArray(data.tags) ? data.tags : [data.tags])
        : []

      return {
        slug,
        title: data.title,
        date: commitDate,
        content: contentHtml,
        group,
        tags,
      } as PostData
    })
  )
  // 日付降順（新しい順）にソート
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const posts = await getAllPosts()
  const post = posts.find((p) => p.slug === slug)
  return post ?? null
}

// 再帰的にディレクトリを巡回して、グループの相対パスを取得する
export async function getAllGroups(): Promise<string[]> {
  const groups: string[] = []

  function walk(dir: string, relativePath: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== '.git') {
        const groupPath = relativePath ? `${relativePath}/${entry.name}` : entry.name
        groups.push(groupPath)
        walk(path.join(dir, entry.name), groupPath)
      }
    }
  }

  walk(postsDirectory)
  return groups
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet)
}

