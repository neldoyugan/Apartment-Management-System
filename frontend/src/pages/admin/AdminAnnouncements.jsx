import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const EMPTY = { title: '', content: '', is_published: 1 };

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await api.get('/api/announcements/all');
      setItems(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (ann) => {
    setForm({ title: ann.title, content: ann.content, is_published: ann.is_published });
    setEditId(ann.announcement_id);
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditId(null); };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!editId) {
        await api.post('/api/announcements/', form);
        toast.success('Announcement created!');
      } else {
        await api.put(`/api/announcements/${editId}`, form);
        toast.success('Announcement updated!');
      }
      closeModal();
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error saving announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/api/announcements/${id}`);
      toast.success('Announcement deleted.');
      setItems((list) => list.filter((a) => a.announcement_id !== id));
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <AdminLayout title="Announcements">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Manage Announcements</h2>
          <button className="btn btn--gold" onClick={openCreate} id="ann-add-btn">
            <FaPlus /> New Announcement
          </button>
        </div>

        {loading ? <LoadingSpinner text="Loading…" /> : (
          <div className="ann-admin-list">
            {items.map((ann) => (
              <div className={`ann-admin-item${ann.is_published ? '' : ' ann-admin-item--draft'}`} key={ann.announcement_id}>
                <div className="ann-admin-item__body">
                  <div className="ann-admin-item__header">
                    <h3>{ann.title}</h3>
                    <span className={`badge ${ann.is_published ? 'badge--green' : 'badge--gray'}`}>
                      {ann.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="ann-admin-item__content">{ann.content}</p>
                  <small className="ann-admin-item__date">
                    {ann.created_at ? new Date(ann.created_at).toLocaleString() : ''}
                  </small>
                </div>
                <div className="ann-admin-item__actions">
                  <button className="btn-icon btn-icon--edit" onClick={() => openEdit(ann)} id={`ann-edit-${ann.announcement_id}`}><FaEdit /></button>
                  <button className="btn-icon btn-icon--delete" onClick={() => handleDelete(ann.announcement_id)} id={`ann-delete-${ann.announcement_id}`}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{editId ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button className="modal__close" onClick={closeModal} id="ann-modal-close-btn"><FaTimes /></button>
            </div>
            <form onSubmit={handleSave} className="modal__body">
              <div className="form-group">
                <label>Title *</label>
                <input name="title" required value={form.title} onChange={handleChange} placeholder="Announcement title" />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea name="content" rows={5} required value={form.content} onChange={handleChange} placeholder="Write your announcement…" />
              </div>
              <div className="form-group form-group--checkbox">
                <label>
                  <input type="checkbox" name="is_published" checked={form.is_published === 1} onChange={handleChange} id="ann-published-check" />
                  Publish immediately
                </label>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn--gold" disabled={saving} id="ann-modal-save-btn">
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
