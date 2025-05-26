
import CommunityDisplay from '../components/CommunityDisplay'
import { useLocation, useParams } from 'react-router'

const CommunityPage = () => {
  const { id } = useParams<{id: string}>()
  const location = useLocation()
  const name = location.state?.name

  return (
    <div className='pt-20'>
      <CommunityDisplay communityId={Number(id)} name={name} />
    </div>
  )
}

export default CommunityPage