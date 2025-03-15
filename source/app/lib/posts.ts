// app/lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import remarkExpressiveCode from 'rehype-expressive-code'
import { execSync } from 'child_process'

export interface PostData {
  slug: string
  title: string
  date: string
  content: string
  group: string
  tags: string[]
}

export interface MarkdownTree {
  files: PostData[];
  subdirs: { [dirName: string]: MarkdownTree };
}

// 記事は contents/posts 以下に置く前提
const env = process.env.NEXT_PUBLIC_ENV

let postsDir = ""
if (env === "dev") {
  postsDir = path.join(process.cwd(), 'test-contents', 'posts')
} else {
  postsDir = path.join(process.cwd(), 'contents', 'posts')
}
export const postsDirectory = postsDir

// Git リポジトリのルートディレクトリ（contents）を取得
const repoRoot = path.join(postsDirectory, '..')


export async function getMarkdownTree(dir: string): Promise<MarkdownTree> {
  const tree: MarkdownTree = { files: [], subdirs: {} };
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // サブディレクトリの場合、再帰的に処理して subdirs に追加
      tree.subdirs[entry.name] = await getMarkdownTree(fullPath);
      console.log(entry.name)
    // } else if (entry.isFile() && entry.name.endsWith('.md')) {
    } else if (entry.isFile() ) {

      // Markdown ファイルなら、getPostData の結果（PostData）を files に追加
      const post = await getPostData(fullPath);
      tree.files.push(post);
    }
  }
  return tree;
}

// 指定ファイルの git 最新コミット日時を ISO 8601 形式で取得
function getGitCommitDate(filePath: string): string {
  try {
    // リポジトリルートを cwd に設定して、対象ファイルのパスを相対パスで指定
    const relativeFilePath = path.relative(repoRoot, filePath)
    const stdout = execSync(
      `git log -1 --format=%aI ${relativeFilePath}`,
      { cwd: repoRoot }
    )
      .toString()
      .trim()
    return stdout.split('T')[0]
  } catch (error) {
    console.error(`Error retrieving git commit date for ${filePath}: `, error)
    return ''
  }
}

async function  getPostData(filePath:string): Promise<PostData>{
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  if (!data.title) {
    data.title = "---no title---"
  }
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .use(remarkExpressiveCode, { themes: ["material-theme"] })
    .process(content)

  const contentHtml = processedContent.toString()

  // カテゴリーは posts/ 以下の最初のディレクトリ名とする
  const relativePath = path.relative(postsDirectory, filePath)
  const group = relativePath.split(path.sep)[0]
  // slug は拡張子除去後、パス区切りをスラッシュに置換
  // const slug = relativePath.replace(/\.md$/, '').replace(new RegExp(`\\${path.sep}`, 'g'), '/')
  const slug = relativePath


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
}
async function getPostList(tree: MarkdownTree, currentDir: string): Promise<PostData[]> {
  // 現在のディレクトリ内の PostData は既に tree.files に格納されているので、そのまま利用する
  const currentPosts: PostData[] = tree.files;

  // 各サブディレクトリからも再帰的に PostData を取得
  let subPosts: PostData[] = [];
  for (const key in tree.subdirs) {
    if (Object.prototype.hasOwnProperty.call(tree.subdirs, key)) {
      // currentDir はディレクトリパスの管理に利用できますが、今回は必要なければそのままキーを渡すか、正しいパスを計算してください
      const newDir = path.join(currentDir, key, "/");
      const postsFromSubdir = await getPostList(tree.subdirs[key], newDir);
      subPosts = subPosts.concat(postsFromSubdir);
    }
  }
  return [...currentPosts, ...subPosts];
}

export async function getAllPosts(): Promise<PostData[]> {
  const tree = await getMarkdownTree(postsDirectory);
  const posts = await getPostList(tree,"/");
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const posts = await getAllPosts()
  const post = posts.find((p) => p.slug === slug)
  return post ?? null
}

// 再帰的にディレクトリを巡回して、カテゴリーの相対パスを取得する
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
