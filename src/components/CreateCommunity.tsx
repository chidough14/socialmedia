import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { useNavigate } from "react-router"
import { supabase } from "../supabase-client"

interface CommunityInput {
  name: string
  description: string
}

const createCommunity = async (community: CommunityInput) => {
  // if (!userId || !author) throw new Error("You must be logged in to comment.")
console.log("fired")
  const { data, error } = await supabase.from("communities").insert(community)

  if (error) throw new Error(error.message)

  return data
}


const CreateCommunity = () => {
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] })
      navigate("/communities")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ name, description })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Community</h2>

      <div>
        <label htmlFor="name" className="block mb-2 font-medium">Community Name</label>
        <input
          type='text'
          id='name'
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>


      <div>
        <label htmlFor="description" className="block mb-2 font-medium">Description</label>
        <textarea
          id='description'
          rows={3}
          required
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <button className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer" type="submit" >
        {
          isPending ? "Saving.." : "Save"
        }
      </button>

      {isError && (<p className="text-red-500">Error creating community</p>)}
    </form>
  )
}

export default CreateCommunity