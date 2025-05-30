import { useQuery } from '@tanstack/react-query'
import { Post } from './PostList'
import { supabase } from '../supabase-client'
import PostItem from './PostItem'

interface Props {
  communityId: number
  name: string
}

interface PostWithCommunity extends Post {
  communities: {
    name: string
  }
}

export const fetchCommunityPosts = async (communityId: number): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase.from("posts").select("*, communities(name)").eq("community_id", communityId).order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data as PostWithCommunity[]
}

const CommunityDisplay = ({ communityId, name }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({ 
    queryKey: ["communityPost", communityId], 
    queryFn: () => fetchCommunityPosts(communityId) 
  })

  if (isLoading) return <div className='text-center py-4'>...Loading</div>

  if (error) {
    return <div className='text-center py-4 text-red-500'>Error: {error.message}</div>
  }
  
  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        { name } Community Posts
      </h2>

      {
        data && data.length > 0 ? (
          <div className='flex flex-wrap gap-6 justify-center'>
            {
              data.map((post, key) => (<PostItem key={key} post={post} />))
            }
          </div>
        ) : (<p className='text-center text-gray-400'>No post in this community yet</p>)
      }
    </div>
  )
}

export default CommunityDisplay