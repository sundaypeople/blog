// app/components/PostsFilter.tsx
'use client';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PostData } from '@/app/lib/posts'

interface PostsFilterProps {
  posts: PostData[]
  groups: string[]
  tags: string[]
}

export default function PostsFilter({ posts, groups, tags }: PostsFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'articles' | 'groups'>('articles')

  // 記事一覧用フィルター
  const filteredPosts = useMemo(() => {
    let filtered = posts
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(post =>
        (post.title || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (groupFilter !== 'all') {
      filtered = filtered.filter(post => post.group.startsWith(groupFilter))
    }
    if (tagFilter !== 'all') {
      filtered = filtered.filter(post => post.tags.includes(tagFilter))
    }
    filtered = filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })
    return filtered
  }, [posts, searchTerm, sortOrder, groupFilter, tagFilter])

  // カテゴリー一覧用フィルター：カテゴリー名に対して検索とソート（昇順・降順）
  const filteredGroups = useMemo(() => {
    let fg = groups.filter(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
    fg = fg.sort((a, b) =>
      sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
    )
    return fg
  }, [groups, searchTerm, sortOrder])

  return (
    <div className="container mx-auto py-10">
      {/* タブ切り替え */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <button
            onClick={() => setViewMode('articles')}
            className={`px-4 py-2 border ${
              viewMode === 'articles'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600'
            }`}
          >
            記事一覧
          </button>
          <button
            onClick={() => setViewMode('groups')}
            className={`px-4 py-2 border ${
              viewMode === 'groups'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600'
            }`}
          >
            カテゴリー一覧
          </button>
        </div>
        {viewMode === 'articles' ? (
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2"
            />
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="border px-3 py-2"
            >
              <option value="all">全てのカテゴリー</option>
              {groups.map(group => {
                const depth = group.split('/').length - 1
                // 最下層の名前だけを表示し、深さに応じてインデントを付与
                const displayName = `${'　'.repeat(depth)}${group.split('/').pop()}`
                return (
                  <option key={group} value={group}>
                    {displayName}
                  </option>
                )
              })}
            </select>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="border px-3 py-2"
            >
              <option value="all">全てのタグ</option>
              {tags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border px-3 py-2"
            >
              <option value="desc">新しい順</option>
              <option value="asc">古い順</option>
            </select>
          </div>
        ) : (
          // カテゴリー一覧用の検索・ソートUI
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="カテゴリー検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border px-3 py-2"
            >
              <option value="asc">昇順</option>
              <option value="desc">降順</option>
            </select>
          </div>
        )}
      </div>

      {/* コンテンツ表示部分 */}
      {viewMode === 'articles' ? (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <article key={post.slug} className="border-b pb-4">
              <h2 className="text-2xl font-semibold">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-500 text-sm">
                {post.date} | {post.group} | {post.tags.join(', ')}
              </p>
              <p className="text-gray-700 mt-2">
                {post.content.substring(0, 100).replace(/<[^>]+>/g, '')}...
              </p>
            </article>
          ))}
          {filteredPosts.length === 0 && <p>該当する記事が見つかりません。</p>}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredGroups.map(group => (
            <div key={group} className="border-b pb-4">
              <h3 className="text-2xl font-semibold">{group}</h3>
              <p className="text-gray-500 text-sm">
                {posts.filter(post => post.group.startsWith(group)).length} 件の記事
              </p>
              <Link
                href={`/group/${group}`}
                className="text-blue-600 hover:underline"
              >
                このカテゴリーの記事を見る →
              </Link>
            </div>
          ))}
          {filteredGroups.length === 0 && <p>該当するカテゴリーが見つかりません。</p>}
        </div>
      )}
    </div>
  )
}
