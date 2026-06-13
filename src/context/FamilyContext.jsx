import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'familyMembers'

const DEFAULT_MEMBERS = [
  { label: 'Father', slug: 'father' },
  { label: 'Mother', slug: 'mother' },
  { label: 'Sister', slug: 'sister' },
  { label: 'Me', slug: 'me' },
]

const FamilyContext = createContext(null)

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function FamilyProvider({ children }) {
  const [members, setMembers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length) return parsed
      }
    } catch {
      // ignore malformed storage and fall back to defaults
    }
    return DEFAULT_MEMBERS
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
  }, [members])

  const addMember = (name) => {
    const label = name.trim()
    const slug = slugify(label)
    if (!label || !slug) return null
    setMembers((prev) =>
      prev.some((m) => m.slug === slug) ? prev : [...prev, { label, slug }]
    )
    return slug
  }

  const removeMember = (slug) => {
    setMembers((prev) => prev.filter((m) => m.slug !== slug))
  }

  return (
    <FamilyContext.Provider value={{ members, addMember, removeMember }}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) {
    throw new Error('useFamily must be used within a FamilyProvider')
  }
  return ctx
}
