import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import '../styles/error.css';
import madiun_logo from '../assets/madiun.png';

export default function ErrorPage({ message, detail, onRetry, onHome }) {
  return (
    <div className="pb-page pb-error-page">
      <header className="pb-header">
        <div className="pb-header-left">
          <img src={madiun_logo} alt="Logo Madiun" className="pb-logo-circle" />
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth</div>
          </div>
        </div>
        <div className="pb-status pb-status-error">
          <span className="pb-status-dot error" />
          <span>Terjadi Kendala</span>
        </div>
      </header>

      <main className="pb-error-main">
        <div className="pb-error-center">
          <div className="pb-error-icon">⚠️</div>
          <h2>Terjadi Kendala</h2>
          <p className="pb-error-msg">{message || 'Proses gagal.'}</p>
          {detail && <p className="pb-error-detail">{detail}</p>}
        </div>
      </main>

      <div className="pb-bottom-action pb-bottom-duo">
        <PrimaryButton onClick={onRetry}>🔄 Coba Lagi</PrimaryButton>
        <PrimaryButton variant="secondary" onClick={onHome}>🏠 Kembali</PrimaryButton>
      </div>
    </div>
  );
}
