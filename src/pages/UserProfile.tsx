import { Link, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { User } from "@supabase/supabase-js"
import { supabase } from "../supabase-client"
import { useState } from "react"
import { Post } from "../components/PostList"

const fetchUserByEmail = async (email: string): Promise<User> => {

  const { data, error } = await supabase.from("profiles").select("*").eq("email", email).single()

  if (error) throw new Error(error.message)

  return data as User
}

const fetchPostsByEmail = async (email: string): Promise<Post[]> => {

  // const { data, error } = await supabase.from("posts").select("*").eq("user_email", email)

  const { data, error } = await supabase.rpc("get_user_posts_with_counts", { user_email_param: email })

  if (error) throw new Error(error.message)

  return data as Post[]
}


const UserProfile = () => {

  const [activeTab, setActiveTab] = useState<"profile" | "posts">("profile");

  const { email } = useParams<{ email: string }>()

  const { data, error, isLoading } = useQuery<any, Error>({ queryKey: ["userData", email], queryFn: () => fetchUserByEmail(email!) })

  const { data: posts = [], error: postsError, isLoading: isPostsLoading } = useQuery<Post[], Error>(
    {
      queryKey: ["userPosts", email],
      queryFn: () => fetchPostsByEmail(email!),
      enabled: !!email
    }
  )

  if (isLoading) return <div>...Loading</div>

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data.name}'s Profile
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium ${activeTab === "profile" ? "border-b-2 border-pink-500 text-pink-500" : "text-gray-400"}`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 font-medium ${activeTab === "posts" ? "border-b-2 border-pink-500 text-pink-500" : "text-gray-400"}`}
        >
          Posts
        </button>
      </div>

      {/* Tab Content */}

      {activeTab === "posts" ? (
        <div className="space-y-4">
          {isPostsLoading ? (
            <p className="text-gray-400">Loading posts...</p>
          ) : postsError ? (
            <p className="text-red-500">Error loading posts: {postsError.message}</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 text-center">No posts yet.</p>
          ) : (
            posts.map((post, key) => (
              <Link to={`/post/${post.id}`} key={key}>
                <div key={post.id} className="border p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-gray-500">{post.content}</p>

                  <div className="flex justify-around items-center">
                    <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
                      ❤️ <span className="ml-2">{post.like_count ?? 0}</span>
                    </span>
                    <span className="cursor-pointer h-10 w-[50px] px-1 flex items-center justify-center font-extrabold rounded-lg">
                      💬 <span className="ml-2">{post.comment_count ?? 0}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {data?.avatar && (
            <img
              src={data.avatar}
              alt={data.name}
              className="mt-4 rounded object-cover w-full h-64"
            />
          )}
          <p className="text-gray-400">Email: {data?.email}</p>
          <p className="text-gray-400">Bio: {data.bio}</p>
        </div>
      )}

    </div>
  );

}

export default UserProfile