import { useEffect, useState } from 'react';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaBullhorn, FaCalendarAlt } from 'react-icons/fa';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/announcements/')
      .then((r) => setAnnouncements(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-hero page-hero--sm">
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Stay Informed</p>
          <h1>Announcements</h1>
          <p>Latest news, updates, and important notices from Solara Residences.</p>
        </div>
      </div>

      <section className="section">
        <div className="section__inner section__inner--narrow">
          {loading ? (
            <LoadingSpinner text="Loading announcements…" size="lg" />
          ) : announcements.length === 0 ? (
            <div className="empty-state">
              <p>No announcements at this time. Check back soon!</p>
            </div>
          ) : (
            <div className="ann-list">
              {announcements.map((ann, i) => (
                <div className={`ann-item${i === 0 ? ' ann-item--featured' : ''}`} key={ann.announcement_id}>
                  <div className="ann-item__icon">
                    <FaBullhorn />
                  </div>
                  <div className="ann-item__body">
                    {i === 0 && <span className="ann-item__new-badge">Latest</span>}
                    <h2 className="ann-item__title">{ann.title}</h2>
                    <p className="ann-item__content">{ann.content}</p>
                    <span className="ann-item__date">
                      <FaCalendarAlt />
                      {new Date(ann.created_at).toLocaleDateString('en-PH', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
