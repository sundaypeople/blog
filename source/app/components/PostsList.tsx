// app/components/PostsList.tsx
'use client';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PostData } from '@/app/lib/posts'

interface PostsListProps {
  posts: PostData[]
  groups: string[]
  tags: string[]
}

export default function PostsList({ posts, groups, tags }: PostsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">記事一覧</h1>
      <div className="flex flex-wrap gap-4 mb-6">
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
          <option value="all">全てのグループ</option>
          {groups.map(group => {
            const depth = group.split('/').length - 1
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
      <div className="space-y-6">
        {filteredPosts.map(post => (
          <article key={post.slug} className="border-b pb-4">
            <h2 className="text-2xl font-semibold">
              <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">
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
    </div>
  )
}
