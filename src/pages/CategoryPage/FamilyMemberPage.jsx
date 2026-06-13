import { useParams } from 'react-router-dom'
import { useFamily } from '../../context/FamilyContext'
import CategoryPage from './CategoryPage'

function FamilyMemberPage() {
  const { slug } = useParams()
  const { members } = useFamily()
  const member = members.find((m) => m.slug === slug)
  const label = member?.label || slug

  // `key` forces CategoryPage to re-mount (and re-subscribe) when navigating
  // between members, since the route component stays the same.
  return (
    <CategoryPage key={slug} title={label} group="Family" category={label} />
  )
}

export default FamilyMemberPage
