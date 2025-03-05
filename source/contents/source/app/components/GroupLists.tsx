// app/components/GroupsList.tsx
'use client';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PostData } from '@/app/lib/posts'

interface GroupsListProps {
  groups: string[]
  posts: PostData[]
}

export default function GroupsList({ groups, posts }: GroupsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const filteredGroups = useMemo(() => {
    let filtered = groups.filter(g =>
      g.toLowerCase().includes(searchTerm.toLowerCase())
    )
    filtered = filtered.sort((a, b) =>
      sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
    )
    return filtered
  }, [groups, searchTerm, sortOrder])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">グループ一覧</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="検索..."
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
      <div className="space-y-6">
        {filteredGroups.map(group => {
          // 同じグループ階層の場合、グループ名にインデントを付与
          const depth = group.split('/').length - 1
          const displayName = `${'　'.repeat(depth)}${group.split('/').pop()}`
          // このグループに属する記事数を算出
          const count = posts.filter(post => post.group.startsWith(group)).length
          return (
            <article key={group} className="border-b pb-4">
              <h2 className="text-2xl font-semibold">
                <Link href={`/search/group/${group}`} className="text-blue-600 hover:underline">
                  {displayName}
                </Link>
              </h2>
              <p className="text-gray-500 text-sm">
                {count} 件の記事
              </p>
            </article>
          )
        })}
        {filteredGroups.length === 0 && <p>該当するグループが見つかりません。</p>}
      </div>
    </div>
  )
}
