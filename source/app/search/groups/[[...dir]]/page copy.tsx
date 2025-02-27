// app/search/group/[...dir]/page.tsx
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {getDirectoryTree} from '@/app/lib/directory'

interface GroupSearchPageProps {
  params: { dir?: string[] }
  searchParams: { q?: string; sort?: 'asc' | 'desc' }
}

const contestsDirectory = path.join(process.cwd(), 'contents')

export default function GroupSearchPage({ params, searchParams }: GroupSearchPageProps) {
  // 現在のディレクトリをキャッチオールパラメーターから決定（未指定ならルート）
  const dirParam = params.dir || []
  const currentPath = path.join(contestsDirectory, ...dirParam)

  const directory = getDirectoryTree(contestsDirectory )
  console.log(directory)
  if (!fs.existsSync(currentPath) || !fs.statSync(currentPath).isDirectory()) {
    notFound()
  }

  // 現在のディレクトリ内のエントリを取得
  let entries = fs.readdirSync(currentPath, { withFileTypes: true })

  // ディレクトリ（.git を除外）と Markdown ファイル（記事）に振り分け
  let directories = entries.filter(entry => entry.isDirectory() && entry.name !== '.git')
  let files = entries.filter(entry => entry.isFile() && entry.name.endsWith('.md'))

  // GET パラメーター q による検索（ディレクトリ名・ファイル名両方）
  const query = searchParams.q ? searchParams.q.toLowerCase() : ''
  if (query) {
    directories = directories.filter(dir =>
      dir.name.toLowerCase().includes(query)
    )
    files = files.filter(file =>
      file.name.toLowerCase().includes(query)
    )
  }

  // sort パラメーターでソート（デフォルトは降順）
  const sortOrder = searchParams.sort === 'asc' ? 'asc' : 'desc'
  directories = directories.sort((a, b) =>
    sortOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  )
  files = files.sort((a, b) =>
    sortOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  )

  // 親ディレクトリへのパス（ルートでなければ）
  const parentPath = dirParam.length > 0 ? dirParam.slice(0, -1).join('/') : ''

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        {dirParam.length > 0 ? `グループ: ${dirParam.join('/')}` : 'グループ一覧'}
      </h1>
      
      
      {dirParam.length > 0 && (
        <div className="mb-6">
          <Link
            href={parentPath ? `/search/group/${parentPath}` : '/search/group'}
            className="text-blue-600 hover:underline"
          >
            ← 戻る
          </Link>
        </div>
      )}

      {/* PostsList と同じデザインの検索・ソートフォーム */}
      <div className="flex flex-wrap gap-4 mb-6">
        <form method="GET" className="flex gap-2">
          <input
            type="text"
            name="q"
            placeholder="検索..."
            defaultValue={searchParams.q || ''}
            className="border px-3 py-2"
          />
          <select
            name="sort"
            defaultValue={sortOrder}
            className="border px-3 py-2"
          >
            <option value="desc">新しい順</option>
            <option value="asc">古い順</option>
          </select>
          <button
            type="submit"
            className="border px-3 py-2 text-blue-600 hover:underline"
          >
            検索
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {files.map(post => (
          <article key={post.name} className="border-b pb-4">
            <h2 className="text-2xl font-semibold">
              <Link href={`/posts/${post.name}`} className="text-blue-600 hover:underline">
                {post.name}
              </Link>
            </h2>
            {/* <p className="text-gray-500 text-sm">
              {post.date} | {post.group} | {post.tags.join(', ')}
            </p>
            <p className="text-gray-700 mt-2">
              {post.content.substring(0, 100).replace(/<[^>]+>/g, '')}...
            </p> */}
          </article>
        ))}
        {files.length === 0 && <p></p>}
      </div>
      <div className="space-y-6">
        {directories.map(post => (
          <article key={post.name} className="border-b pb-4">
            <h2 className="text-2xl font-semibold">
              <Link href={`/search/groups/${post.name}`} className="text-blue-600 hover:underline">
                {post.name}
              </Link>
            </h2>
          </article>
        ))}
        {directories.length === 0 && <p></p>}
      </div>
      {/* <div className="space-y-6">
        {directories.length > 0 && (
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold mb-2">ディレクトリ</h2>
            <ul className="list-disc pl-5">
              {directories.map(dir => {
                const nextPath = [...dirParam, dir.name].join('/')
                return (
                  <li key={dir.name}>
                    <Link
                      href={`/search/group/${nextPath}`}
                      className="text-blue-600 hover:underline"
                    >
                      {dir.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {files.length > 0 && (
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold mb-2">記事一覧</h2>
            <ul className="list-disc pl-5">
              {files.map(file => {
                const fileSlug = file.name.replace(/\.md$/, '')
                const fullSlug = [...dirParam, fileSlug].join('/')
                return (
                  <li key={file.name}>
                    <Link
                      href={`/posts/${fullSlug}`}
                      className="text-blue-600 hover:underline"
                    >
                      {fileSlug}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        {directories.length === 0 && files.length === 0 && (
          <p>該当するディレクトリや記事が見つかりません。</p>
        )}
      </div> */}
    </div>
  )
}
