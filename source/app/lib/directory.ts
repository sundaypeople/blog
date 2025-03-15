// app/lib/directory.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { execSync } from 'child_process'

export type TreeNode = DirectoryNode | ArticleNode

export interface DirectoryNode {
  type: "directory"
  name: string
  path: string // content/contests 以下の相対パス
  children: TreeNode[]
}

export interface ArticleNode {
  type: "file"
  name: string // ファイル名（拡張子除く）
  path: string // content/contests 以下の相対パス（拡張子除く）
  title: string
  date: string
  tags: string[]
}

// 記事は contests 以下に置く前提
const baseDirectory = path.join(process.cwd(), 'contents')

// git の最新コミット日時を YYYY-MM-DD 形式で取得
function getGitCommitDate(filePath: string): string {
  try {
    const relativeFilePath = path.relative(baseDirectory, filePath)
    const stdout = execSync(
      `git log -1 --format=%aI ${relativeFilePath}`,
      { cwd: baseDirectory }
    ).toString().trim()
    return stdout.split('T')[0]
  } catch (error) {
    console.error(`Error retrieving git commit date for ${filePath}: `, error)
    return ''
  }
}

// 再帰的にディレクトリを巡回してツリーを構築
export function getDirectoryTree(dir: string = baseDirectory, relativePath: string = ''): DirectoryNode {
  const node: DirectoryNode = {
    type: "directory",
    name: relativePath === '' ? 'Root' : path.basename(dir),
    path: relativePath,
    children: []
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    // .git ディレクトリは除外
    if (entry.name === '.git') continue

    const fullPath = path.join(dir, entry.name)
    const entryRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      const childDir = getDirectoryTree(fullPath, entryRelativePath)
      node.children.push(childDir)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Markdown ファイルの場合、front matter から情報を取得
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      const title = data.title || entry.name.replace(/\.md$/, '')
      const tags = data.tags
        ? (Array.isArray(data.tags) ? data.tags : [data.tags])
        : []
      const date = getGitCommitDate(fullPath)

      const articleNode: ArticleNode = {
        type: "file",
        name: entry.name.replace(/\.md$/, ''),
        path: entryRelativePath.replace(/\.md$/, ''),
        title,
        date,
        tags,
      }
      node.children.push(articleNode)
    }
  }
  // ソート：ディレクトリを先、次に記事。各カテゴリー内は名前順に並べる
  node.children.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name)
    }
    return a.type === "directory" ? -1 : 1
  })
  return node
}
