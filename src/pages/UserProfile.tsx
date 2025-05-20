import { useAuth } from "../context/AuthContext"


const UserProfile = () => {
  const { user } = useAuth()
  console.log(user)

  return (
    <div>UserProfile</div>
  )
}

export default UserProfile