import { Link } from 'react-router-dom';
import { FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <FaBuilding />
            <span>Solara<b>Residences</b></span>
          </Link>
          <p className="footer__tagline">
            Premium living in the heart of the city. Where comfort meets elegance.
          </p>
          <div className="footer__socials">
            <a href="#" aria-label="Facebook" className="footer__social-link"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className="footer__social-link"><FaInstagram /></a>
          </div>
        </div>

        <div className="footer__links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/apartments">Apartments</Link></li>
            <li><Link to="/announcements">Announcements</Link></li>
            <li><Link to="/apply">Apply Now</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__contact">
          <h4>Contact Us</h4>
          <ul>
            <li><FaMapMarkerAlt /> 123 Solara Tower, Metro City</li>
            <li><FaPhone /> +63 912 345 6789</li>
            <li><FaEnvelope /> info@solaraResidences.ph</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Solara Residences. All rights reserved.</p>
        <Link to="/admin/login" className="footer__admin-link">Admin Portal</Link>
      </div>
    </footer>
  );
}
