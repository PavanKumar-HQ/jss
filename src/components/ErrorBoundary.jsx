import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught unhandled component error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 16px',
            backgroundColor: '#FAF7F2',
            textAlign: 'center',
            fontFamily: 'var(--font-sans)'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--color-border)',
              borderTop: '4px solid var(--color-maroon)',
              borderRadius: '8px',
              padding: '32px 24px',
              boxShadow: '0 8px 24px rgba(94, 22, 36, 0.08)'
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(94, 22, 36, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--color-maroon)'
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-serif" style={{ fontSize: '1.45rem', color: 'var(--color-maroon)', marginBottom: '8px' }}>
              Unexpected Interface Interruption
            </h2>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              An unexpected display issue occurred in this section. Your cart, study reading list, and recorded orders remain safe and preserved.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={13} />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/';
                }}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Home size={13} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
