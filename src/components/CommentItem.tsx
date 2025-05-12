import { useState } from "react";
import { Comment } from "./CommentSection"
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  comment: Comment & {
    children?: Comment[];
  }
  postId: number
}
const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) throw new Error("You must be logged in to reply.")

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author
  })

  if (error) throw new Error(error.message)
}

const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [replyText, setReplyText] = useState<string>("")
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(replyContent, postId, comment.id, user?.id, user?.user_metadata.user_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
      setReplyText("")
    }
  })

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText) return
    mutate(replyText)
    // setReplyText("")
    setShowReply(false)
  }

  return (
    <div className="pl-4 border-l border-white/10">
      <div className="mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>

          <span className="text-xs text-gray-400">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>

        <p className="text-gray-300">{comment.content}</p>
        <button onClick={() => setShowReply((prev) => !prev)} className="text-blue-500 text-sm mt-1">
          {showReply ? "Cancel" : "Reply"}
        </button>
      </div>

      {
        showReply && user && (
          <form onSubmit={handleReplySubmit} className="mb-4">
            <textarea
              rows={2}
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full border border-white/10 bg-transparent p-2 rounded"
            ></textarea>

            <button type="submit" className="mt-1 bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
              {
                isPending ? "Sending..." : "Send"
              }
            </button>
            {
              isError && (<p className="text-red-500 mt-2">Error posting reply</p>)
            }
          </form>
        )
      }

      {
        comment.children && comment.children.length > 0 && (
          <div>
            <button onClick={() => setIsCollapsed((prev) => !prev)} title={isCollapsed ? "Show Replies" : "Hide Replies"}>
              {isCollapsed ? "Show Replies" : "Hide Replies"}
            </button>

            {
              !isCollapsed && (
                <div className="space-y-2">
                  {comment.children.map((child, key) => (
                    <CommentItem key={key} comment={child} postId={postId} />
                  ))}
                </div>
              )
            }
          </div>
        )
      }

    </div>
  )
}

export default CommentItem