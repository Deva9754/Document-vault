import { useState } from 'react'
import { FiFileText, FiEye, FiTrash2 } from 'react-icons/fi'
import ViewDialog from '../ViewDialog/ViewDialog'

function formatDate(createdAt) {
  const date = createdAt?.toDate?.()
  if (!date) return 'Just now'
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function DocumentCard({ document, onDelete }) {
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <div className="document-card">
      <div className="document-card-icon">
        <FiFileText />
      </div>

      <div className="document-card-body">
        <h3 className="document-card-title" title={document.title}>
          {document.title}
        </h3>
        <p className="document-card-meta">
          {document.category} · {formatDate(document.createdAt)}
        </p>
      </div>

      <div className="document-card-actions">
        <button
          type="button"
          className="document-card-btn"
          onClick={() => setViewOpen(true)}
          title="View"
        >
          <FiEye />
        </button>
        {onDelete && (
          <button
            type="button"
            className="document-card-btn danger"
            onClick={() => onDelete(document)}
            title="Delete"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      <ViewDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        document={document}
      />
    </div>
  )
}

export default DocumentCard
