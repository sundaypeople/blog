// app/search/posts/page.tsx
import PostsList from '@/app/components/PostsList'
import { getAllPosts, getAllGroups, getAllTags } from '@/app/lib/posts'

export default async function PostsSearchPage() {
    const posts = await getAllPosts()
    const groups = await getAllGroups()
    const tags = await getAllTags()
    console.log(posts)

    return <PostsList posts={posts} groups={groups} tags={tags} />
}
