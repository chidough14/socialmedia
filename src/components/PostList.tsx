import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import PostItem from './PostItem'

export interface Post {
  id: number
  title: string
  content: string
  created_at: string
  image_url: string
  avatar_url: string
  user_name: string
  like_count?: number
  comment_count?: number
  community: {
    id: number
    name: string
    description: string
    created_at: string
  }
}


const fetchPosts = async (): Promise<Post[]> => {
  // const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

  const { data, error } = await supabase.rpc("get_posts_with_counts")

  if (error) throw new Error(error.message)

  return data as Post[]
}

const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({ queryKey: ["posts"], queryFn: fetchPosts })

  if (isLoading) return <div>...Loading</div>

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {
        data?.map((post, key) => (<PostItem post={post} key={key} />))
      }
    </div>
  )
}

export default PostList