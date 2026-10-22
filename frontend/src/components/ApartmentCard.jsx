import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaTag } from 'react-icons/fa';

const STATUS_COLORS = {
  available: 'badge--green',
  occupied: 'badge--red',
  maintenance: 'badge--amber',
};

const STATUS_LABELS = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
};

export default function ApartmentCard({ apartment }) {
  const {
    apartment_id,
    unit_number,
    description,
    rent_price,
    bedrooms,
    bathrooms,
    floor_area,
    status,
    images,
    amenities,
  } = apartment;

  const imgSrc = images && images.length > 0
    ? `http://localhost:8000${images[0]}`
    : null;

  return (
    <Link to={`/apartments/${apartment_id}`} className="apt-card">
      <div className="apt-card__img-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={`Unit ${unit_number}`} className="apt-card__img" />
        ) : (
          <div className="apt-card__img-placeholder">
            <span>Unit {unit_number}</span>
          </div>
        )}
        <span className={`badge ${STATUS_COLORS[status] || 'badge--gray'}`}>
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      <div className="apt-card__body">
        <div className="apt-card__header">
          <h3 className="apt-card__unit">Unit {unit_number}</h3>
          <span className="apt-card__price">
            <FaTag className="icon-sm" />
            ₱{rent_price.toLocaleString()}<small>/mo</small>
          </span>
        </div>

        {description && (
          <p className="apt-card__desc">{description}</p>
        )}

        <div className="apt-card__meta">
          <span><FaBed /> {bedrooms} Bed</span>
          <span><FaBath /> {bathrooms} Bath</span>
          {floor_area && <span><FaRulerCombined /> {floor_area}㎡</span>}
        </div>

        {amenities && amenities.length > 0 && (
          <div className="apt-card__amenities">
            {amenities.slice(0, 3).map((a) => (
              <span key={a} className="chip">{a}</span>
            ))}
            {amenities.length > 3 && (
              <span className="chip chip--more">+{amenities.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
