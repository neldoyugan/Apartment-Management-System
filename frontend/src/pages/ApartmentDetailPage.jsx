import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FaBed, FaBath, FaRulerCombined, FaTag, FaArrowLeft,
  FaCheckCircle, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

const STATUS_COLORS = {
  available: 'badge--green',
  occupied: 'badge--red',
  maintenance: 'badge--amber',
};

export default function ApartmentDetailPage() {
  const { id } = useParams();
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    api.get(`/api/apartments/${id}`)
      .then((r) => setApt(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page center"><LoadingSpinner size="lg" text="Loading unit…" /></div>;
  if (!apt) return <div className="page center"><p className="empty-state">Unit not found.</p></div>;

  const images = apt.images && apt.images.length > 0 ? apt.images : [];
  const imgSrc = images.length > 0 ? `http://localhost:8000${images[imgIdx]}` : null;

  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

  return (
    <div className="page page--detail">
      <div className="section__inner">
        <Link to="/apartments" className="back-link" id="apt-detail-back-btn">
          <FaArrowLeft /> Back to Apartments
        </Link>

        <div className="detail-grid">
          {/* Image Gallery */}
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              {imgSrc ? (
                <>
                  <img src={imgSrc} alt={`Unit ${apt.unit_number}`} className="detail-gallery__img" />
                  {images.length > 1 && (
                    <>
                      <button className="gallery-nav gallery-nav--prev" onClick={prevImg} id="gallery-prev-btn">
                        <FaChevronLeft />
                      </button>
                      <button className="gallery-nav gallery-nav--next" onClick={nextImg} id="gallery-next-btn">
                        <FaChevronRight />
                      </button>
                      <span className="gallery-counter">{imgIdx + 1} / {images.length}</span>
                    </>
                  )}
                </>
              ) : (
                <div className="detail-gallery__placeholder">
                  <span>Unit {apt.unit_number}</span>
                  <small>No images uploaded</small>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="detail-gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb${i === imgIdx ? ' gallery-thumb--active' : ''}`}
                    onClick={() => setImgIdx(i)}
                    id={`gallery-thumb-${i}`}
                  >
                    <img src={`http://localhost:8000${img}`} alt={`Thumb ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-info__header">
              <h1 className="detail-info__unit">Unit {apt.unit_number}</h1>
              <span className={`badge ${STATUS_COLORS[apt.status] || 'badge--gray'}`}>
                {apt.status}
              </span>
            </div>

            <div className="detail-info__price">
              <FaTag />
              ₱{apt.rent_price.toLocaleString()}
              <small>/month</small>
            </div>

            <div className="detail-info__specs">
              <div className="spec-item">
                <FaBed />
                <span>{apt.bedrooms} Bedroom{apt.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="spec-item">
                <FaBath />
                <span>{apt.bathrooms} Bathroom{apt.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              {apt.floor_area && (
                <div className="spec-item">
                  <FaRulerCombined />
                  <span>{apt.floor_area} ㎡</span>
                </div>
              )}
            </div>

            {apt.description && (
              <div className="detail-info__section">
                <h3>Description</h3>
                <p>{apt.description}</p>
              </div>
            )}

            {apt.amenities && apt.amenities.length > 0 && (
              <div className="detail-info__section">
                <h3>Amenities</h3>
                <ul className="amenities-list">
                  {apt.amenities.map((a) => (
                    <li key={a}><FaCheckCircle className="icon-green" /> {a}</li>
                  ))}
                </ul>
              </div>
            )}

            {apt.status === 'available' && (
              <Link
                to={`/apply?unit=${apt.unit_number}`}
                className="btn btn--gold btn--lg mt-lg"
                id="apt-detail-apply-btn"
              >
                Apply for This Unit
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
