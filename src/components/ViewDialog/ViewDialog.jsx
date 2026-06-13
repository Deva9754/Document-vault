// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   IconButton,
// } from '@mui/material'
// import { FiX, FiDownload, FiExternalLink } from 'react-icons/fi'

// // Cloudinary forces a file download (instead of opening in the browser) when
// // the `fl_attachment` flag is inserted right after `/upload/`. The optional
// // value becomes the downloaded file name.
// function buildDownloadUrl(document) {
//   const url = document.fileUrl || ''
//   if (!url.includes('/upload/')) return url

//   const safeName = (document.title || document.fileName || 'document')
//     .replace(/[^\w.-]+/g, '_')
//     .replace(/_+/g, '_')

//   return url.replace('/upload/', `/upload/fl_attachment:${safeName}/`)
// }

// function getKind(document) {
//   if (!document) return 'other'
//   const type = document.fileType || ''
//   const url = document.fileUrl || ''
//   const ext = url.split('?')[0].split('.').pop()?.toLowerCase()

//   if (type.startsWith('image/') || document.resourceType === 'image') {
//     return 'image'
//   }
//   if (type === 'application/pdf' || ext === 'pdf') {
//     return 'pdf'
//   }
//   if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
//     return 'image'
//   }
//   return 'other'
// }

// function ViewDialog({ open, onClose, document }) {
//   if (!document) return null

//   const kind = getKind(document)

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle
//         sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
//       >
//         <span>{document.title}</span>
//         <IconButton onClick={onClose} size="small" aria-label="Close">
//           <FiX />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers>
//         {kind === 'image' && (
//           <Box sx={{ textAlign: 'center' }}>
//             <img
//               src={document.fileUrl}
//               alt={document.title}
//               style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8 }}
//             />
//           </Box>
//         )}

//         {kind === 'pdf' && (
//           <Box
//             component="iframe"
//             src={document.fileUrl}
//             title={document.title}
//             sx={{ width: '100%', height: '70vh', border: 'none' }}
//           />
//         )}

//         {kind === 'other' && (
//           <Box sx={{ textAlign: 'center', py: 6 }}>
//             <Typography variant="body1" gutterBottom>
//               This file type can&apos;t be previewed here.
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {document.fileName}
//             </Typography>
//           </Box>
//         )}
//       </DialogContent>

//       <DialogActions>
//         <Button
//           startIcon={<FiExternalLink />}
//           href={document.fileUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Open in new tab
//         </Button>
//         <Button
//           variant="contained"
//           startIcon={<FiDownload />}
//           href={buildDownloadUrl(document)}
//         >
//           Download
//         </Button>
//       </DialogActions>
//     </Dialog>
//   )
// }

// export default ViewDialog


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material'

import {
  FiX,
  FiDownload,
  FiExternalLink,
  FiMail,
  FiShare2,
} from 'react-icons/fi'

import { FaWhatsapp } from 'react-icons/fa'

function buildDownloadUrl(document) {
  const url = document.fileUrl || ''

  if (!url.includes('/upload/')) return url

  const safeName = (document.title || document.fileName || 'document')
    .replace(/[^\w.-]+/g, '_')
    .replace(/_+/g, '_')

  return url.replace(
    '/upload/',
    `/upload/fl_attachment:${safeName}/`
  )
}

function getKind(document) {
  if (!document) return 'other'

  const type = document.fileType || ''
  const url = document.fileUrl || ''

  const ext = url
    .split('?')[0]
    .split('.')
    .pop()
    ?.toLowerCase()

  if (
    type.startsWith('image/') ||
    document.resourceType === 'image'
  ) {
    return 'image'
  }

  if (type === 'application/pdf' || ext === 'pdf') {
    return 'pdf'
  }

  if (
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(
      ext
    )
  ) {
    return 'image'
  }

  return 'other'
}

function ViewDialog({ open, onClose, document }) {
  if (!document) return null

  const kind = getKind(document)

  const handleWhatsAppShare = () => {
    const text = `📄 ${document.title}\n\n${document.fileUrl}`

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  const handleEmailShare = () => {
    const subject = `Shared Document - ${document.title}`

    const body = `
Document: ${document.title}

View Document:
${document.fileUrl}
`

    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: document.title,
          url: document.fileUrl,
        })
      } else {
        handleWhatsAppShare()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>{document.title}</span>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close"
        >
          <FiX />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {kind === 'image' && (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={document.fileUrl}
              alt={document.title}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 8,
              }}
            />
          </Box>
        )}

        {kind === 'pdf' && (
          <Box
            component="iframe"
            src={document.fileUrl}
            title={document.title}
            sx={{
              width: '100%',
              height: '70vh',
              border: 'none',
            }}
          />
        )}

        {kind === 'other' && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography
              variant="body1"
              gutterBottom
            >
              This file type can't be previewed here.
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {document.fileName}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          flexWrap: 'wrap',
          gap: 1,
          px: 2,
          py: 1.5,
        }}
      >
        <Button
          color="success"
          startIcon={<FaWhatsapp />}
          onClick={handleWhatsAppShare}
        >
          WhatsApp
        </Button>

        <Button
          color="primary"
          startIcon={<FiMail />}
          onClick={handleEmailShare}
        >
          Email
        </Button>

        <Button
          color="secondary"
          startIcon={<FiShare2 />}
          onClick={handleNativeShare}
        >
          Share
        </Button>

        <Button
          startIcon={<FiExternalLink />}
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
        </Button>

        <Button
          variant="contained"
          startIcon={<FiDownload />}
          href={buildDownloadUrl(document)}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewDialog