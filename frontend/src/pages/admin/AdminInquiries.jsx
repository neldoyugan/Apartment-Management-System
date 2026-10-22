import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaEye, FaTrash, FaTimes, FaEnvelopeOpen, FaEnvelope } from 'react-icons/fa';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const r = await api.get('/api/inquiries/');
      setInquiries(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const viewInquiry = async (inq) => {
    try {
      const r = await api.get(`/api/inquiries/${inq.inquiry_id}`);
      setSelected(r.data);
      setInquiries((list) => list.map((i) => i.inquiry_id === inq.inquiry_id ? { ...i, is_read: 1 } : i));
    } catch {
      toast.error('Failed to load inquiry.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.delete(`/api/inquiries/${id}`);
      toast.success('Inquiry deleted.');
      setInquiries((list) => list.filter((i) => i.inquiry_id !== id));
      if (selected?.inquiry_id === id) setSelected(null);
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <AdminLayout title="Inquiries">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Customer Inquiries</h2>
          <span className="badge badge--red">
            {inquiries.filter((i) => !i.is_read).length} unread
          </span>
        </div>

        {loading ? <LoadingSpinner text="Loading…" /> : (
          <div className="admin-table-wrap">
            <table className="admin-table" id="inquiries-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Read</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.inquiry_id} className={!inq.is_read ? 'row--unread' : ''}>
                    <td>{inq.inquiry_id}</td>
                    <td><strong>{inq.full_name}</strong></td>
                    <td>{inq.email}</td>
                    <td>{inq.subject || '—'}</td>
                    <td>{inq.inquiry_date ? new Date(inq.inquiry_date).toLocaleDateString() : '—'}</td>
                    <td>
                      {inq.is_read
                        ? <FaEnvelopeOpen className="icon-muted" title="Read" />
                        : <FaEnvelope className="icon-gold" title="Unread" />}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon btn-icon--view" onClick={() => viewInquiry(inq)} title="View" id={`inq-view-${inq.inquiry_id}`}>
                          <FaEye />
                        </button>
                        <button className="btn-icon btn-icon--delete" onClick={() => handleDelete(inq.inquiry_id)} title="Delete" id={`inq-delete-${inq.inquiry_id}`}>
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

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Inquiry #{selected.inquiry_id}</h3>
              <button className="modal__close" onClick={() => setSelected(null)} id="inq-modal-close-btn"><FaTimes /></button>
            </div>
            <div className="modal__body detail-view">
              <div className="detail-view__grid">
                <div><strong>From</strong><p>{selected.full_name}</p></div>
                <div><strong>Email</strong><p>{selected.email}</p></div>
                <div><strong>Phone</strong><p>{selected.phone || '—'}</p></div>
                <div><strong>Date</strong><p>{selected.inquiry_date ? new Date(selected.inquiry_date).toLocaleString() : '—'}</p></div>
              </div>
              {selected.subject && <div className="detail-view__row"><strong>Subject</strong><p>{selected.subject}</p></div>}
              <div className="detail-view__row">
                <strong>Message</strong>
                <p className="inq-message">{selected.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
