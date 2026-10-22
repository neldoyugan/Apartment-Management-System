import { useEffect, useState } from 'react';
import api from '../api/axios';
import ApartmentCard from '../components/ApartmentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    bedrooms: '',
    min_price: '',
    max_price: '',
    status: 'available',
  });

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.status) params.status = filters.status;
      const res = await api.get('/api/apartments/', { params });
      setApartments(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const handleChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApartments();
  };

  return (
    <div className="page">
      <div className="page-hero page-hero--sm">
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Explore Our Collection</p>
          <h1>Available Units</h1>
          <p>Find the perfect apartment that matches your lifestyle and budget.</p>
        </div>
      </div>

      <section className="section">
        <div className="section__inner">
          {/* Filter Bar */}
          <form className="filter-bar" onSubmit={handleSearch} id="apt-filter-form">
            <div className="filter-bar__search">
              <FaSearch className="filter-bar__icon" />
              <input
                type="text"
                name="search"
                placeholder="Search units…"
                value={filters.search}
                onChange={handleChange}
                className="filter-bar__input"
                id="apt-search-input"
              />
            </div>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="filter-bar__select"
              id="apt-bedrooms-select"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
            </select>
            <input
              type="number"
              name="min_price"
              placeholder="Min Price (₱)"
              value={filters.min_price}
              onChange={handleChange}
              className="filter-bar__input filter-bar__input--sm"
              id="apt-min-price"
            />
            <input
              type="number"
              name="max_price"
              placeholder="Max Price (₱)"
              value={filters.max_price}
              onChange={handleChange}
              className="filter-bar__input filter-bar__input--sm"
              id="apt-max-price"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="filter-bar__select"
              id="apt-status-select"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <button type="submit" className="btn btn--gold" id="apt-search-btn">
              <FaFilter /> Filter
            </button>
          </form>

          {loading ? (
            <LoadingSpinner text="Loading apartments…" size="lg" />
          ) : apartments.length === 0 ? (
            <div className="empty-state">
              <p>No apartments found matching your criteria.</p>
            </div>
          ) : (
            <>
              <p className="results-count">{apartments.length} unit{apartments.length !== 1 ? 's' : ''} found</p>
              <div className="apt-grid">
                {apartments.map((apt) => (
                  <ApartmentCard key={apt.apartment_id} apartment={apt} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
