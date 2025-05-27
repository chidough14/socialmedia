import { useParams } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { User } from "@supabase/supabase-js"
import { supabase } from "../supabase-client"

const fetchUserByEmail = async (email: string): Promise<User> => {
  const { data, error } = await supabase.from("profiles").select("*").eq("email", email).single()

  if (error) throw new Error(error.message)

  return data 
}


const UserProfile = () => {
  const { user } = useAuth()

  const { email } = useParams<{email: string}>()
  
  const { data, error, isLoading } = useQuery<any, Error>({ queryKey: ["userData", email], queryFn: () => fetchUserByEmail(email!) })

  if (isLoading) return <div>...Loading</div>

  if (error) {
    return <div>Error: {error.message}</div>
  }


  return (
    <div className="space-y-6">

      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data.name}'s Profile
      </h2>
      {data?.avatar && (
        <img
          src={data.avatar}
          alt={data.name}
          className="mt-4 rounded object-cover w-full h-64"
        />
      )}
      <p className="text-gray-400">Email: {data?.email}</p>
      <p className="text-gray-400">
        Bio : {data.bio}
      </p>
    </div>
  )
}

export default UserProfile