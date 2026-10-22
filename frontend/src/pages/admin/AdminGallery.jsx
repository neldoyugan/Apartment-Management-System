import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaUpload, FaTrash } from 'react-icons/fa';

const CATEGORIES = ['apartment', 'building', 'facility'];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', category: 'apartment' });
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const fetch = async () => {
    setLoading(true);
    try {
      const params = filter ? { category: filter } : {};
      const r = await api.get('/api/gallery/', { params });
      setImages(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [filter]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select an image file.'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', uploadForm.category);
      if (uploadForm.title) fd.append('title', uploadForm.title);
      await api.post('/api/gallery/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded!');
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setUploadForm({ title: '', category: 'apartment' });
      fetch();
    } catch {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/api/gallery/${id}`);
      toast.success('Image deleted.');
      setImages((imgs) => imgs.filter((i) => i.gallery_id !== id));
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <AdminLayout title="Gallery">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Photo Gallery</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select" id="gallery-filter-select">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Upload Form */}
        <div className="upload-card">
          <h3><FaUpload /> Upload New Image</h3>
          <form onSubmit={handleUpload} className="form-grid form-grid--3" id="gallery-upload-form">
            <div className="form-group">
              <label htmlFor="gallery-title">Title (optional)</label>
              <input id="gallery-title" value={uploadForm.title} onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Lobby View" />
            </div>
            <div className="form-group">
              <label htmlFor="gallery-category">Category</label>
              <select id="gallery-category" value={uploadForm.category} onChange={(e) => setUploadForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="gallery-file">Image File *</label>
              <input id="gallery-file" type="file" accept="image/*" ref={fileRef} onChange={(e) => setFile(e.target.files[0])} className="file-input" />
            </div>
            <div className="form-group form-group--submit">
              <button type="submit" className="btn btn--gold" disabled={uploading} id="gallery-upload-btn">
                {uploading ? 'Uploading…' : <><FaUpload /> Upload</>}
              </button>
            </div>
          </form>
        </div>

        {/* Gallery Grid */}
        {loading ? <LoadingSpinner text="Loading gallery…" /> : images.length === 0 ? (
          <p className="empty-state">No images found.</p>
        ) : (
          <div className="admin-gallery-grid" id="gallery-grid">
            {images.map((img) => (
              <div className="admin-gallery-item" key={img.gallery_id}>
                <img src={`http://localhost:8000${img.image_path}`} alt={img.title || 'Gallery'} />
                <div className="admin-gallery-item__overlay">
                  <span className="chip">{img.category}</span>
                  {img.title && <p>{img.title}</p>}
                  <button className="btn-icon btn-icon--delete" onClick={() => handleDelete(img.gallery_id)} id={`gallery-delete-${img.gallery_id}`}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
