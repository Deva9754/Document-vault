import { useState, useEffect } from 'react'
import { FiUploadCloud } from 'react-icons/fi'
import { auth } from '../../services/firebase'
import {
  subscribeRecentDocuments,
  deleteDocument,
} from '../../services/documents'
import UploadDialog from '../../components/UploadDialog/UploadDialog'
import DocumentCard from '../../components/DocumentCard/DocumentCard'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { Box, CircularProgress, Typography } from '@mui/material'

function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [docToDelete, setDocToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return

    const unsubscribe = subscribeRecentDocuments(uid, (docs) => {
      setDocuments(docs)
      setLoading(false)
    })

    return unsubscribe
  }, [])

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
          <h2>Dashboard</h2>
          <p className="page-subtitle">Overview of your vault.</p>
        </div>
        {/* <button
          type="button"
          className="upload-btn"
          onClick={() => setDialogOpen(true)}
        >
          <FiUploadCloud />
          Upload document
        </button> */}
      </div>

      <section className="recent-section">
        <h3 className="recent-title">Recent Documents</h3>

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
            No documents yet. Click “Upload document” to add your first one.
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

      <UploadDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

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

export default Dashboard
