// src/components/Hero3DErrorBoundary.jsx
import React from 'react';

class Hero3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Aggiorna lo stato in modo che il prossimo rendering mostri l'UI di fallback.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puoi anche loggare l'errore su un servizio di reporting
    console.error("Errore critico nel componente Hero3D:", error, errorInfo);
    this.state.errorInfo = errorInfo;
  }

  render() {
    if (this.state.hasError) {
      // --- UI DI FALLBACK ---
      // Questo è quello che vedrai al posto del 3D se crasha.
      // Puoi personalizzarlo come vuoi (un'immagine, un colore, un avviso).
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          background: '#1a1a1a', // Colore simile al tuo obsidiana
          color: '#ff4444', 
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h2 style={{fontSize: '2rem', marginBottom: '10px'}}>⚠️ Il sistema grafico 3D non è riuscito a caricare.</h2>
          <p>Stiamo lavorando per risolvere il problema. Il resto del sito è comunque navigabile.</p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '10px', color: '#aaa', fontSize: '0.8rem' }}>
              <summary>Dettagli Tecnici (solo sviluppatore)</summary>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    // Se non c'è errore, renderizza il componente figlio (Hero3D)
    return this.props.children;
  }
}

export default Hero3DErrorBoundary;