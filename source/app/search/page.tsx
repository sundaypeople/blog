// app/search/posts/page.tsx
import PostsList from '@/app/components/PostsList'
import { getAllPosts, getAllGroups, getAllTags } from '@/app/lib/posts'

export default async function PostsSearchPage() {
    console.log("rifejwaoifeio")
    const posts = await getAllPosts()
    const groups = await getAllGroups()
    const tags = await getAllTags()
    return <PostsList posts={posts} groups={groups} tags={tags} />
}
