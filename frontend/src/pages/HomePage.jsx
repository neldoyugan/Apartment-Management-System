import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FaBuilding, FaShieldAlt, FaConciergeBell, FaArrowRight, FaBullhorn, FaCalendarAlt } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const FEATURES = [
  {
    icon: <FaBuilding />,
    title: 'Premium Units',
    desc: 'Thoughtfully designed apartments ranging from cozy studios to expansive penthouses.',
  },
  {
    icon: <FaShieldAlt />,
    title: '24/7 Security',
    desc: 'Round-the-clock security with CCTV monitoring and controlled access for peace of mind.',
  },
  {
    icon: <FaConciergeBell />,
    title: 'Concierge Service',
    desc: 'Dedicated staff ready to assist with your every need, from move-in to maintenance.',
  },
];

export default function HomePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/announcements/')
      .then((r) => setAnnouncements(r.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page page--home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <p className="hero__eyebrow">Welcome to Luxury Living</p>
          <h1 className="hero__title">
            Discover Your<br />
            <span className="gold">Perfect Home</span>
          </h1>
          <p className="hero__sub">
            Solara Residences offers premium apartments in the heart of the city.
            Experience elegance, comfort, and world-class amenities.
          </p>
          <div className="hero__cta">
            <Link to="/apartments" className="btn btn--gold" id="hero-browse-btn">
              Browse Apartments <FaArrowRight />
            </Link>
            <Link to="/apply" className="btn btn--outline" id="hero-apply-btn">
              Apply Now
            </Link>
          </div>
        </div>
        <div className="hero__scroll-hint">
          <span />
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stats-bar__inner">
          <div className="stat-item">
            <span className="stat-num">50+</span>
            <span className="stat-label">Premium Units</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">10+</span>
            <span className="stat-label">Amenities</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">24/7</span>
            <span className="stat-label">Security</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">5★</span>
            <span className="stat-label">Rated Living</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features">
        <div className="section__inner">
          <div className="section__label">Why Choose Us</div>
          <h2 className="section__title">Living Redefined</h2>
          <p className="section__sub">
            At Solara Residences, we believe every detail matters. Our commitment
            to excellence makes us the premier choice for discerning residents.
          </p>
          <div className="features__grid">
            {FEATURES.map(({ icon, title, desc }) => (
              <div className="feature-card" key={title}>
                <div className="feature-card__icon">{icon}</div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements preview */}
      <section className="section announcements-preview">
        <div className="section__inner">
          <div className="section__label">Latest News</div>
          <h2 className="section__title">Announcements</h2>
          {loading ? (
            <LoadingSpinner text="Loading announcements…" />
          ) : announcements.length === 0 ? (
            <p className="empty-state">No announcements yet.</p>
          ) : (
            <div className="ann-preview__list">
              {announcements.map((ann) => (
                <div className="ann-card" key={ann.announcement_id}>
                  <div className="ann-card__icon"><FaBullhorn /></div>
                  <div className="ann-card__body">
                    <h3 className="ann-card__title">{ann.title}</h3>
                    <p className="ann-card__content">{ann.content}</p>
                    <span className="ann-card__date">
                      <FaCalendarAlt />
                      {new Date(ann.created_at).toLocaleDateString('en-PH', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="center mt-lg">
            <Link to="/announcements" className="btn btn--outline" id="home-all-announcements-btn">
              View All Announcements <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-banner__inner">
          <h2>Ready to Find Your Dream Home?</h2>
          <p>Browse our available units and submit your application today.</p>
          <Link to="/apply" className="btn btn--gold" id="cta-apply-btn">
            Apply Now <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
