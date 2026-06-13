import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material'
import { FiUploadCloud } from 'react-icons/fi'
import { uploadDocument } from '../../services/documents'
import { auth } from '../../services/firebase'

function formatSize(bytes) {
  if (!bytes) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function UploadDialog({ open, onClose, category, categoryLabel }) {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [titleTouched, setTitleTouched] = useState(false)

  const titleError = titleTouched && !title.trim()

  const reset = () => {
    setFile(null)
    setTitle('')
    setProgress(0)
    setUploading(false)
    setError('')
    setTitleTouched(false)
  }

  const handleClose = () => {
    if (uploading) return
    reset()
    onClose()
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setError('')
    }
  }

  const handleUpload = async () => {
    setTitleTouched(true)

    if (!file) {
      setError('Please choose a file to upload.')
      return
    }
    if (!title.trim()) {
      setError('')
      return
    }

    if (!auth.currentUser?.uid) {
      setError('You are not signed in. Please log in again and retry.')
      return
    }

    setUploading(true)
    setError('')

    try {
      await uploadDocument({
        file,
        title: title.trim(),
        category,
        uid: auth.currentUser.uid,
        onProgress: setProgress,
      })
      reset()
      onClose()
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {categoryLabel ? `Upload to ${categoryLabel}` : 'Upload document'}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          component="label"
          variant="outlined"
          fullWidth
          startIcon={<FiUploadCloud />}
          disabled={uploading}
          sx={{
            py: 2,
            borderStyle: 'dashed',
            textTransform: 'none',
            mb: 2,
          }}
        >
          {file ? 'Choose a different file' : 'Choose file'}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {file && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 1.5,
              mb: 2,
              borderRadius: 1,
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatSize(file.size)}
            </Typography>
          </Box>
        )}

        <TextField
          label="Title"
          placeholder="e.g. Aadhaar Card"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTitleTouched(true)}
          disabled={uploading}
          error={titleError}
          helperText={
            titleError
              ? 'Title is required — it is shown when viewing the document.'
              : 'Used as the document title in your vault.'
          }
        />

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="text.secondary">
              Uploading… {Math.round(progress)}%
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UploadDialog
