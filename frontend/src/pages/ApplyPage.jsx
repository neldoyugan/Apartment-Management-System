import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FaFileAlt, FaPaperPlane } from 'react-icons/fa';

export default function ApplyPage() {
  const [searchParams] = useSearchParams();
  const defaultUnit = searchParams.get('unit') || '';

  const [form, setForm] = useState({
    applicant_name: '',
    contact_number: '',
    email: '',
    address: '',
    occupation: '',
    monthly_income: '',
    desired_unit: defaultUnit,
    move_in_date: '',
    notes: '',
  });
  const [document, setDocument] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (document) fd.append('document', document);
      await api.post('/api/applications/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page center">
        <div className="success-card">
          <div className="success-card__icon">✅</div>
          <h2>Application Submitted!</h2>
          <p>Thank you for applying to Solara Residences. Our team will review your application and get back to you shortly.</p>
          <button onClick={() => setSubmitted(false)} className="btn btn--outline mt-lg" id="apply-again-btn">
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-hero page-hero--sm">
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Start Your Journey</p>
          <h1>Apply for a Unit</h1>
          <p>Fill out the form below and our team will get back to you within 24 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="section__inner section__inner--narrow">
          <div className="form-card">
            <div className="form-card__header">
              <FaFileAlt />
              <h2>Rental Application Form</h2>
            </div>

            <form onSubmit={handleSubmit} id="apply-form">
              <div className="form-section-title">Personal Information</div>
              <div className="form-grid form-grid--2">
                <div className="form-group">
                  <label htmlFor="applicant_name">Full Name *</label>
                  <input id="applicant_name" name="applicant_name" type="text" required value={form.applicant_name} onChange={handleChange} placeholder="Juan Dela Cruz" />
                </div>
                <div className="form-group">
                  <label htmlFor="contact_number">Contact Number *</label>
                  <input id="contact_number" name="contact_number" type="text" required value={form.contact_number} onChange={handleChange} placeholder="+63 912 345 6789" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="juan@email.com" />
                </div>
                <div className="form-group">
                  <label htmlFor="occupation">Occupation</label>
                  <input id="occupation" name="occupation" type="text" value={form.occupation} onChange={handleChange} placeholder="Software Engineer" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Current Address</label>
                <textarea id="address" name="address" rows={2} value={form.address} onChange={handleChange} placeholder="Your current home address" />
              </div>

              <div className="form-section-title">Unit Preferences</div>
              <div className="form-grid form-grid--2">
                <div className="form-group">
                  <label htmlFor="desired_unit">Desired Unit Number</label>
                  <input id="desired_unit" name="desired_unit" type="text" value={form.desired_unit} onChange={handleChange} placeholder="e.g. 201" />
                </div>
                <div className="form-group">
                  <label htmlFor="move_in_date">Preferred Move-in Date</label>
                  <input id="move_in_date" name="move_in_date" type="date" value={form.move_in_date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="monthly_income">Monthly Income (₱)</label>
                  <input id="monthly_income" name="monthly_income" type="number" value={form.monthly_income} onChange={handleChange} placeholder="50000" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="Any special requests or additional information…" />
              </div>

              <div className="form-group">
                <label htmlFor="document">Supporting Document (optional)</label>
                <input id="document" name="document" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setDocument(e.target.files[0])} className="file-input" />
                <small className="form-hint">Accepted: PDF, JPG, PNG, DOC (max 10MB)</small>
              </div>

              <button type="submit" className="btn btn--gold btn--lg btn--block" disabled={submitting} id="apply-submit-btn">
                {submitting ? 'Submitting…' : <><FaPaperPlane /> Submit Application</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
