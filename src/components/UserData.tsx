import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

const fetchUserByEmail = async (email: string): Promise<User> => {

  const { data, error } = await supabase.from("profiles").select("*").eq("email", email).single()

  if (error) throw new Error(error.message)

  return data as User
}

export default function UserData({  email }: { email: string | undefined }) {
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { data,  isLoading } = useQuery<any, Error>(
    { 
      queryKey: ["userData", email!], 
      queryFn: () => fetchUserByEmail(email!),
      // enabled: !!email,
      // onSuccess: (data: any) => setBio(data.bio || "")
    }
  )

  useEffect(() => {
    if (data) {
      setBio(data.bio || "")
    }
  }, [data])

  const handleUpdateBio = async () => {
    setLoading(true);
    setMessage("");
    const { error } = await supabase
      .from("profiles")
      .update({ bio })
      .eq("email", email); // assuming `user_id` links profiles to auth.users

    if (error) {
      setMessage("Failed to update bio.");
    } else {
      setMessage("Bio updated successfully!");
    }

    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      {/* <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {data.name}'s Profile
      </h2> */}

      {data?.avatar && (
        <img
          src={data.avatar}
          alt={data.name}
          className="mt-4 rounded object-cover w-full h-64"
        />
      )}

      <p className="text-gray-400">Email: {data?.email}</p>

      <div>
        <p className="text-gray-400 font-semibold">Bio:</p>

        {isEditing ? (
          <>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md text-sm"
              rows={4}
              placeholder="Enter your bio"
            />
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleUpdateBio}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between mt-2">
              {isLoading ? "...Loading" : <p className="text-gray-300">{bio || "No bio added yet."}</p>}
            {/* {bio === "" ? <p className="text-gray-300">No bio added yet.</p> : null} */}
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 text-sm underline hover:text-blue-700"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {message && <p className="text-sm text-green-500 mt-2">{message}</p>}
    </div>
  );
}