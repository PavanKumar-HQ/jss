import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBF8F2', padding: '20px', fontFamily: 'sans-serif' }}>
          <div style={{ maxWidth: '520px', textAlign: 'center', backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '12px', border: '1px solid #E2DACB', boxShadow: '0 8px 24px rgba(94, 22, 36, 0.08)' }}>
            <h2 style={{ color: '#5E1624', marginBottom: '12px', fontSize: '1.4rem' }}>JSS Publications</h2>
            <p style={{ color: '#6B625D', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
              We encountered a display issue while loading the application.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{ backgroundColor: '#5E1624', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem' }}
            >
              Reload Website
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
