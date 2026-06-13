import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const DOCS_COLLECTION = 'documents'
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Flow: React -> Cloudinary (file upload) -> get secure URL -> save metadata in Firestore.
export function uploadDocument({ file, title, category, uid, onProgress }) {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(
        new Error(
          'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
        )
      )
      return
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', endpoint)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress((e.loaded / e.total) * 100)
      }
    }

    xhr.onload = async () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error('Cloudinary upload failed'))
        return
      }

      const res = JSON.parse(xhr.responseText)
      try {
        const docRef = await addDoc(collection(db, DOCS_COLLECTION), {
          uid,
          title,
          fileUrl: res.secure_url,
          publicId: res.public_id,
          resourceType: res.resource_type,
          category: category || 'General',
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
          size: file.size,
          createdAt: serverTimestamp(),
        })
        resolve({ id: docRef.id, fileUrl: res.secure_url })
      } catch (err) {
        if (err.code === 'permission-denied') {
          reject(
            new Error(
              'Firestore permission denied. Sign in again, then publish Firestore rules for project document-vault-c334f (allow read, write: if request.auth != null).'
            )
          )
          return
        }
        reject(err)
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(formData)
  })
}

// Real-time subscription to a user's documents (newest first).
// Optionally filter by category. Filtering/sorting is done client-side to
// avoid needing composite Firestore indexes.
// options: { category, max }
export function subscribeDocuments(uid, callback, options = {}) {
  const { category, max } = options
  const q = query(collection(db, DOCS_COLLECTION), where('uid', '==', uid))

  return onSnapshot(
    q,
    (snapshot) => {
      let docs = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
        )

      if (category) {
        docs = docs.filter((d) => d.category === category)
      }
      if (max) {
        docs = docs.slice(0, max)
      }
      callback(docs)
    },
    (err) => {
      console.error('Failed to load documents:', err)
      callback([])
    }
  )
}

// Convenience wrapper used by the Dashboard for the most recent documents.
export function subscribeRecentDocuments(uid, callback, max = 12) {
  return subscribeDocuments(uid, callback, { max })
}

// MVP: removes the Firestore record only. Deleting the Cloudinary asset
// requires a signed/admin request from a backend, so the file stays in Cloudinary.
export async function deleteDocument(docItem) {
  await deleteDoc(doc(db, DOCS_COLLECTION, docItem.id))
}
