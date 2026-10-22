import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaEye, FaTrash, FaTimes } from 'react-icons/fa';

const STATUS_OPTIONS = ['pending', 'under_review', 'approved', 'rejected'];
const STATUS_COLORS = {
  pending: 'badge--amber',
  under_review: 'badge--blue',
  approved: 'badge--green',
  rejected: 'badge--red',
};

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const r = await api.get('/api/applications/', { params });
      setApplications(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [filter]);

  const handleStatus = async (id, status) => {
    try {
      const r = await api.put(`/api/applications/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      setApplications((apps) => apps.map((a) => a.application_id === id ? r.data : a));
      if (selected?.application_id === id) setSelected(r.data);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/api/applications/${id}`);
      toast.success('Application deleted.');
      setApplications((apps) => apps.filter((a) => a.application_id !== id));
      if (selected?.application_id === id) setSelected(null);
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <AdminLayout title="Applications">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Rental Applications</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select" id="apps-filter-select">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>

        {loading ? <LoadingSpinner text="Loading…" /> : (
          <div className="admin-table-wrap">
            <table className="admin-table" id="applications-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Unit</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.application_id}>
                    <td>{app.application_id}</td>
                    <td><strong>{app.applicant_name}</strong></td>
                    <td>{app.email}</td>
                    <td>{app.desired_unit || '—'}</td>
                    <td>{app.application_date ? new Date(app.application_date).toLocaleDateString() : '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_COLORS[app.status] || 'badge--gray'}`}>
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon btn-icon--view" onClick={() => setSelected(app)} title="View" id={`app-view-${app.application_id}`}>
                          <FaEye />
                        </button>
                        <button className="btn-icon btn-icon--delete" onClick={() => handleDelete(app.application_id)} title="Delete" id={`app-delete-${app.application_id}`}>
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

      {/* Detail Panel */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Application #{selected.application_id} — {selected.applicant_name}</h3>
              <button className="modal__close" onClick={() => setSelected(null)} id="app-modal-close-btn"><FaTimes /></button>
            </div>
            <div className="modal__body detail-view">
              <div className="detail-view__grid">
                <div><strong>Name</strong><p>{selected.applicant_name}</p></div>
                <div><strong>Email</strong><p>{selected.email}</p></div>
                <div><strong>Phone</strong><p>{selected.contact_number}</p></div>
                <div><strong>Occupation</strong><p>{selected.occupation || '—'}</p></div>
                <div><strong>Monthly Income</strong><p>{selected.monthly_income ? `₱${selected.monthly_income.toLocaleString()}` : '—'}</p></div>
                <div><strong>Desired Unit</strong><p>{selected.desired_unit || '—'}</p></div>
                <div><strong>Move-in Date</strong><p>{selected.move_in_date || '—'}</p></div>
                <div><strong>Date Applied</strong><p>{selected.application_date ? new Date(selected.application_date).toLocaleString() : '—'}</p></div>
              </div>
              {selected.address && <div className="detail-view__row"><strong>Address</strong><p>{selected.address}</p></div>}
              {selected.notes && <div className="detail-view__row"><strong>Notes</strong><p>{selected.notes}</p></div>}
              {selected.document_path && (
                <div className="detail-view__row">
                  <strong>Document</strong>
                  <a href={`http://localhost:8000${selected.document_path}`} target="_blank" rel="noreferrer" className="btn btn--outline btn--sm" id="app-doc-link">
                    View Document
                  </a>
                </div>
              )}
              <div className="detail-view__status">
                <strong>Update Status:</strong>
                <div className="status-btn-group">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      className={`btn btn--sm ${selected.status === s ? 'btn--gold' : 'btn--outline'}`}
                      onClick={() => handleStatus(selected.application_id, s)}
                      id={`app-status-${s}-btn`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
