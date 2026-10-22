import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  FaHome, FaCheckCircle, FaUserClock, FaEnvelope,
  FaImages, FaCalendarAlt, FaExclamationCircle
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/stats')
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Units', value: stats.total_apartments, icon: <FaHome />, color: 'card-blue' },
    { label: 'Available', value: stats.available_units, icon: <FaCheckCircle />, color: 'card-green' },
    { label: 'Occupied', value: stats.occupied_units, icon: <FaCalendarAlt />, color: 'card-amber' },
    { label: 'Applications', value: stats.total_applications, icon: <FaUserClock />, color: 'card-purple' },
    { label: 'Pending', value: stats.pending_applications, icon: <FaExclamationCircle />, color: 'card-orange' },
    { label: 'Inquiries', value: stats.total_inquiries, icon: <FaEnvelope />, color: 'card-teal' },
    { label: 'Unread', value: stats.unread_inquiries, icon: <FaEnvelope />, color: 'card-red' },
    { label: 'Gallery', value: stats.total_gallery, icon: <FaImages />, color: 'card-pink' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <LoadingSpinner size="lg" text="Loading stats…" />
      ) : (
        <div className="dashboard">
          <p className="dashboard__welcome">
            Welcome back! Here's a quick overview of Solara Residences.
          </p>
          <div className="stats-grid">
            {cards.map(({ label, value, icon, color }) => (
              <div className={`stat-card ${color}`} key={label}>
                <div className="stat-card__icon">{icon}</div>
                <div className="stat-card__body">
                  <span className="stat-card__value">{value}</span>
                  <span className="stat-card__label">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
