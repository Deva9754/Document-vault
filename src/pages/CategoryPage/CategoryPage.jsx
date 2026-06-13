import { useState, useEffect } from 'react'
import { FiUploadCloud } from 'react-icons/fi'
import { auth } from '../../services/firebase'
import { subscribeDocuments, deleteDocument } from '../../services/documents'
import UploadDialog from '../../components/UploadDialog/UploadDialog'
import DocumentCard from '../../components/DocumentCard/DocumentCard'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { Box, CircularProgress, Typography } from '@mui/material'
function CategoryPage({ title, group, category, showAll = false }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [docToDelete, setDocToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Re-subscribe whenever the active category changes (navigating between pages).
  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    setLoading(true)
    const unsubscribe = subscribeDocuments(
      uid,
      (docs) => {
        setDocuments(docs)
        setLoading(false)
      },
      showAll ? {} : { category }
    )

    return unsubscribe
  }, [category, showAll])

  const handleConfirmDelete = async () => {
    if (!docToDelete) return
    setDeleting(true)
    try {
      await deleteDocument(docToDelete)
      setDocToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>{title}</h2>
          <p className="page-subtitle">
            {group ? `${group} · ` : ''}
            {showAll
              ? 'All your stored documents.'
              : `Documents in ${title}.`}
          </p>
        </div>
        {/* <button
          type="button"
          className="upload-btn"
          onClick={() => setDialogOpen(true)}
        >
          <FiUploadCloud />
          Upload to {title}
        </button> */}
      </div>

      <section className="recent-section">
        {loading ? (
        <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      gap: 2,
    }}
  >
    <CircularProgress size={50} />
    <Typography variant="body2" color="text.secondary">
      Loading documents...
    </Typography>
  </Box>
        ) : documents.length === 0 ? (
          <p className="recent-empty">
            No documents in {title} yet. Click “Upload to {title}” to add one.
          </p>
        ) : (
          <div className="document-grid">
            {documents.map((docItem) => (
              <DocumentCard
                key={docItem.id}
                document={docItem}
                onDelete={setDocToDelete}
              />
            ))}
          </div>
        )}
      </section>

      <UploadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        category={showAll ? 'General' : category}
        categoryLabel={title}
      />

      <ConfirmDialog
        open={Boolean(docToDelete)}
        title="Delete document"
        message={`Are you sure you want to delete "${docToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDocToDelete(null)}
      />
    </div>
  )
}

export default CategoryPage
