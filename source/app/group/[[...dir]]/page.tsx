// app/group/[...dir]/page.tsx
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const postsDirectory = path.join(process.cwd(), 'contents')

interface GroupPageProps {
  params: { dir?: string[] }
}

export default function GroupPage({ params }: GroupPageProps) {
  // URL のキャッチオールパラメーターから現在のパスを決定（なければルート）
  const dirParam = params.dir || [] // 例: ['dir-test']
  const currentPath = path.join(postsDirectory, ...dirParam)

  // 指定パスが存在しない場合やディレクトリでない場合は404
  if (!fs.existsSync(currentPath) || !fs.statSync(currentPath).isDirectory()) {
      return <div>記事が見つかりません</div>
  }

  // 現在のディレクトリの中身を取得
  const entries = fs.readdirSync(currentPath, { withFileTypes: true })
  // ディレクトリ（.git は除外）と Markdown ファイルに分ける
  const directories = entries.filter(
    (entry) => entry.isDirectory() && entry.name !== '.git'
  )
  const files = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith('.md')
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        {dirParam.length > 0 ? `Group: ${dirParam.join('/')}` : 'All Groups'}
      </h1>
      {/* ルートでなければ「戻る」リンクを表示 */}
      {dirParam.length > 0 && (
        <div className="mb-4">
          <Link href={`/group/${dirParam.slice(0, -1).join('/')}`}>
            ← Back
          </Link>
        </div>
      )}

      {/* サブディレクトリ一覧 */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Directories</h2>
        {directories.length > 0 ? (
          <ul className="list-disc pl-5">
            {directories.map((dir) => {
              const nextPath = [...dirParam, dir.name].join('/')
              return (
                <li key={dir.name}>
                  <Link href={`/group/${nextPath}`} className="text-blue-600 hover:underline">
                    {dir.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p>No directories found.</p>
        )}
      </div>

      {/* Markdown ファイル（記事）一覧 */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Posts</h2>
        {files.length > 0 ? (
          <ul className="list-disc pl-5">
            {files.map((file) => {
              // 拡張子を除去して slug として扱う
              const fileSlug = file.name.replace(/\.md$/, '')
              const fullSlug = [...dirParam, fileSlug].join('/')
              return (
                <li key={file.name}>
                  <Link href={`/posts/${fullSlug}`} className="text-blue-600 hover:underline">
                    {fileSlug}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  )
}
