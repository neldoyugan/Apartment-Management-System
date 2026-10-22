import { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaUpload, FaTimes } from 'react-icons/fa';

const EMPTY_FORM = {
  unit_number: '', description: '', rent_price: '', bedrooms: '',
  bathrooms: '', floor_area: '', status: 'available', amenities: '', images: [],
};

export default function AdminApartments() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false); // 'create' | 'edit' | false
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await api.get('/api/apartments/', { params: { limit: 200 } });
      setApartments(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create'); };
  const openEdit = (apt) => {
    setForm({
      unit_number: apt.unit_number,
      description: apt.description || '',
      rent_price: apt.rent_price,
      bedrooms: apt.bedrooms,
      bathrooms: apt.bathrooms,
      floor_area: apt.floor_area || '',
      status: apt.status,
      amenities: (apt.amenities || []).join(', '),
      images: apt.images || [],
    });
    setEditId(apt.apartment_id);
    setModal('edit');
  };

  const closeModal = () => { setModal(false); setEditId(null); setUploadFile(null); };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        rent_price: parseFloat(form.rent_price),
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        floor_area: form.floor_area ? parseFloat(form.floor_area) : null,
        amenities: form.amenities ? form.amenities.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (modal === 'create') {
        await api.post('/api/apartments/', payload);
        toast.success('Apartment created!');
      } else {
        await api.put(`/api/apartments/${editId}`, payload);
        toast.success('Apartment updated!');
      }
      closeModal();
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error saving apartment.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this apartment?')) return;
    try {
      await api.delete(`/api/apartments/${id}`);
      toast.success('Apartment deleted.');
      fetch();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const handleUpload = async (aptId) => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', uploadFile);
      await api.post(`/api/apartments/${aptId}/upload-image`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Image uploaded!');
      setUploadFile(null);
      if (fileRef.current) fileRef.current.value = '';
      fetch();
    } catch {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout title="Apartments">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Manage Apartments</h2>
          <button className="btn btn--gold" onClick={openCreate} id="apt-add-btn">
            <FaPlus /> Add Apartment
          </button>
        </div>

        {loading ? <LoadingSpinner text="Loading…" /> : (
          <div className="admin-table-wrap">
            <table className="admin-table" id="apartments-table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Beds</th>
                  <th>Baths</th>
                  <th>Status</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apartments.map((apt) => (
                  <tr key={apt.apartment_id}>
                    <td><strong>Unit {apt.unit_number}</strong></td>
                    <td>₱{apt.rent_price.toLocaleString()}</td>
                    <td>{apt.bedrooms}</td>
                    <td>{apt.bathrooms}</td>
                    <td>
                      <span className={`badge ${apt.status === 'available' ? 'badge--green' : apt.status === 'occupied' ? 'badge--red' : 'badge--amber'}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>{apt.images?.length || 0} photo(s)</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon btn-icon--edit" onClick={() => openEdit(apt)} title="Edit" id={`apt-edit-${apt.apartment_id}`}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon btn-icon--delete" onClick={() => handleDelete(apt.apartment_id)} title="Delete" id={`apt-delete-${apt.apartment_id}`}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{modal === 'create' ? 'Add New Apartment' : `Edit Unit ${form.unit_number}`}</h3>
              <button className="modal__close" onClick={closeModal} id="apt-modal-close-btn"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="modal__body">
              <div className="form-grid form-grid--2">
                <div className="form-group">
                  <label>Unit Number *</label>
                  <input name="unit_number" required value={form.unit_number} onChange={handleChange} placeholder="e.g. 101" />
                </div>
                <div className="form-group">
                  <label>Rent Price (₱) *</label>
                  <input name="rent_price" type="number" required value={form.rent_price} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bedrooms *</label>
                  <input name="bedrooms" type="number" required min={0} value={form.bedrooms} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bathrooms *</label>
                  <input name="bathrooms" type="number" required min={0} value={form.bathrooms} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Floor Area (㎡)</label>
                  <input name="floor_area" type="number" value={form.floor_area} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows={3} value={form.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Amenities (comma-separated)</label>
                <input name="amenities" value={form.amenities} onChange={handleChange} placeholder="Wi-Fi, Air Conditioning, Parking" />
              </div>

              {/* Image upload — only on edit */}
              {modal === 'edit' && (
                <div className="form-group">
                  <label>Upload Image</label>
                  <div className="upload-row">
                    <input type="file" accept="image/*" ref={fileRef} onChange={(e) => setUploadFile(e.target.files[0])} className="file-input" id="apt-img-upload" />
                    <button type="button" className="btn btn--outline" onClick={() => handleUpload(editId)} disabled={!uploadFile || uploading} id="apt-img-upload-btn">
                      {uploading ? 'Uploading…' : <><FaUpload /> Upload</>}
                    </button>
                  </div>
                  {form.images?.length > 0 && (
                    <div className="thumb-row">
                      {form.images.map((img, i) => (
                        <img key={i} src={`http://localhost:8000${img}`} alt={`img-${i}`} className="admin-thumb" />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="modal__footer">
                <button type="button" className="btn btn--outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn--gold" disabled={saving} id="apt-modal-save-btn">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
