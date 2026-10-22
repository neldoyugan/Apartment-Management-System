export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 20, md: 36, lg: 52 };
  const px = sizes[size] || sizes.md;
  return (
    <div className="spinner-wrapper">
      <div className="spinner" style={{ width: px, height: px }} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
