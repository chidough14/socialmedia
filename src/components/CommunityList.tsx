import { useQuery } from '@tanstack/react-query'
import { supabase } from '../supabase-client'
import { Link } from 'react-router'

export interface Community {
  id: number
  name: string
  description: string
  created_at: string
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase.from("communities").select("*").order("created_at", { ascending: false })

  if (error) throw new Error(error.message)

  return data as Community[]
}

const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({ queryKey: ["communities"], queryFn: fetchCommunities })

  if (isLoading) return <div className='text-center py-4'>...Loading</div>

  if (error) {
    return <div className='text-center py-4 text-red-500'>Error: {error.message}</div>
  }

  return (
    <div>
      {
        data?.map((community, key) => (
          <div key={key} className='border border-white/10 p-4 rounded hover:-translate-y-1 transition transform'>
            <Link 
              to={`/community/${community.id}`} 
              state={{name: community.name}} 
              className='text-2xl font-bold text-purple-500 hover:underline'
            >
              { community.name }
            </Link>

            <p className='text-gray-400 mt-2'>{ community.description }</p>
          </div>
        ))
      }
    </div>
  )
}

export default CommunityList