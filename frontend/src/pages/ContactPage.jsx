import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', subject: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/inquiries/', form);
      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you soon.');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-hero page-hero--sm">
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Get in Touch</p>
          <h1>Contact Us</h1>
          <p>Have questions? We're here to help you find your perfect home.</p>
        </div>
      </div>

      <section className="section">
        <div className="section__inner">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <h2>Visit or Reach Us</h2>
              <p>Our friendly staff is available Monday to Saturday, 8AM–6PM, to assist with inquiries, unit viewings, and applications.</p>

              <ul className="contact-info__list">
                <li>
                  <span className="contact-info__icon"><FaMapMarkerAlt /></span>
                  <div>
                    <strong>Address</strong>
                    <p>123 Solara Tower, Metro City, Philippines</p>
                  </div>
                </li>
                <li>
                  <span className="contact-info__icon"><FaPhone /></span>
                  <div>
                    <strong>Phone</strong>
                    <p>+63 912 345 6789</p>
                  </div>
                </li>
                <li>
                  <span className="contact-info__icon"><FaEnvelope /></span>
                  <div>
                    <strong>Email</strong>
                    <p>info@solaraResidences.ph</p>
                  </div>
                </li>
              </ul>

              <div className="contact-hours">
                <h4>Office Hours</h4>
                <table>
                  <tbody>
                    <tr><td>Monday – Friday</td><td>8:00 AM – 6:00 PM</td></tr>
                    <tr><td>Saturday</td><td>9:00 AM – 4:00 PM</td></tr>
                    <tr><td>Sunday</td><td>Closed</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrap">
              {submitted ? (
                <div className="success-card">
                  <div className="success-card__icon">✅</div>
                  <h2>Message Sent!</h2>
                  <p>Thank you for reaching out. We'll respond to your inquiry within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ full_name: '', email: '', phone: '', subject: '', message: '' }); }} className="btn btn--outline mt-lg" id="contact-another-btn">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="form-card" onSubmit={handleSubmit} id="contact-form">
                  <div className="form-card__header">
                    <FaEnvelope />
                    <h2>Send a Message</h2>
                  </div>
                  <div className="form-grid form-grid--2">
                    <div className="form-group">
                      <label htmlFor="full_name">Full Name *</label>
                      <input id="full_name" name="full_name" type="text" required value={form.full_name} onChange={handleChange} placeholder="Juan Dela Cruz" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="juan@email.com" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="+63 912 345 6789" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="Unit inquiry, viewing request…" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea id="message" name="message" rows={5} required value={form.message} onChange={handleChange} placeholder="Tell us how we can help you…" />
                  </div>
                  <button type="submit" className="btn btn--gold btn--lg btn--block" disabled={submitting} id="contact-submit-btn">
                    {submitting ? 'Sending…' : <><FaPaperPlane /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
