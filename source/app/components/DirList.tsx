// app/components/PostsList.tsx
'use client';

import { useState } from 'react'
import Link from 'next/link'
import { MarkdownTree } from '@/app/lib/posts'
import { useRouter } from 'next/navigation';

interface PostsListProps {
  tree: MarkdownTree
}

export default function DirList({ tree }: PostsListProps) {
  const router = useRouter();
  // const [searchTerm, setSearchTerm] = useState('')
  // const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  // const [groupFilter, setGroupFilter] = useState<string>('all')
  // const [tagFilter, setTagFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'articles' | 'categories'>('categories')


  const handleViewModeChange = (mode: 'articles' | 'categories') => {
    setViewMode(mode);
    // 「articles」が /posts、「categories」が /all に遷移する例
    if (mode === 'articles') {
      router.push('/all');
    } else {
      router.push('/posts');
    }
  };

  // const filteredPosts = useMemo(() => {
  //   let filtered = posts
  //   if (searchTerm.trim() !== '') {
  //     filtered = filtered.filter(post =>
  //       (post.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   }
  //   if (groupFilter !== 'all') {
  //     filtered = filtered.filter(post => post.group.startsWith(groupFilter))
  //   }
  //   if (tagFilter !== 'all') {
  //     filtered = filtered.filter(post => post.tags.includes(tagFilter))
  //   }
  //   filtered = filtered.sort((a, b) => {
  //     if (sortOrder === 'asc') {
  //       return new Date(a.date).getTime() - new Date(b.date).getTime()
  //     } else {
  //       return new Date(b.date).getTime() - new Date(a.date).getTime()
  //     }
  //   })
  //   return filtered
  // }, [posts, searchTerm, sortOrder, groupFilter, tagFilter])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">カテゴリー</h1>
      <div className="flex space-x-4 mb-4 md:mb-2">
        <button
          onClick={() => handleViewModeChange('articles')}
          className={`px-4 py-2 border ${
            viewMode === 'articles'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600'
          }`}
        >
          記事一覧
        </button>
        <button
          onClick={() => handleViewModeChange('categories')}
          className={`px-4 py-2 border ${
            viewMode === 'categories'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600'
          }`}
        >
          カテゴリー
        </button>
      </div>
      {/* <div className="flex flex-wrap gap-4 mb-6">
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
      </div> */}
      <div className='mt-10'>
        <div className="space-y-6">
          {Object.keys(tree.subdirs).map(key => (
            <article key={key} className="border-b pb-4">
              <h2 className="text-2xl font-semibold">
                <Link href={`/posts/${key}`} className="text-blue-600 hover:underline">
                  {key}
                </Link>
              </h2>
              {/* <p className="text-gray-500 text-sm">
                {post.date} | {post.group} | {key.tags.join(', ')}
              </p> */}
              <p className="text-gray-700 mt-2">
                {/* {post.content.substring(0, 100).replace(/<[^>]+>/g, '')}... */}
              </p>
            </article>
          ))}
          {/* {tree.files.length === 0 && <p>該当する記事が見つかりません。</p>} */}
        </div>
        {/* <hr/> */}
        {tree.files.length !== 0 && 
            <div className="space-y-6 mt-20">
            <h2 className='text-3xl font-bold mb-6'>記事</h2>
            {tree.files.map(post => (
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
          </div>
        }

      </div>

    </div>
  )
}
