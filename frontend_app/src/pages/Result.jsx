import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import '../styles/result.css';
import madiun_logo from '../assets/madiun.png';

export default function Result({ result, onHome }) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onHome();
      return;
    }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onHome]);

  if (!result) {
    return (
      <div className="pb-page pb-center">
        <p>Data hasil tidak ditemukan.</p>
        <PrimaryButton onClick={onHome}>Kembali</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="pb-page pb-result">
      <header className="pb-header">
        <div className="pb-header-left">
          <img src={madiun_logo} alt="Logo Madiun" className="pb-logo-circle" />
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth</div>
          </div>
        </div>
        <div className="pb-result-code">
          Kode: <strong>{result.download_code}</strong>
        </div>
      </header>

      <main className="pb-result-main">
        <div className="pb-result-success">
          <span className="pb-check">✓</span>
          <span>SELESAI</span>
        </div>

        <h1 className="pb-result-title">Hasil Foto Anda</h1>
        <p className="pb-result-desc">
          Scan QR Code untuk mengunduh foto Anda.
        </p>

        {/* Processed photo */}
        <div className="pb-result-photo">
          <img src={result.processed_url} alt="Hasil foto" />
        </div>

        {/* QR Code */}
        <div className="pb-result-qr">
          <img src={result.qr_code_url} alt="QR Code" className="pb-qr-image" />
          <h3>Scan untuk Unduh</h3>
          <p>Arahkan kamera HP ke QR Code ini</p>
        </div>

        {/* Info */}
        <div className="pb-result-info">
          <div className="pb-info-row">
            <span className="pb-info-label">Kode Download:</span>
            <span className="pb-info-value">{result.download_code}</span>
          </div>
          <div className="pb-info-row">
            <span className="pb-info-label">Waktu proses:</span>
            <span className="pb-info-value">{result.processing_time_ms ? `${(result.processing_time_ms / 1000).toFixed(1)}s` : '-'}</span>
          </div>
          <p className="pb-info-note">💡 Foto akan dihapus otomatis dalam 5 menit. Segera scan QR!</p>
        </div>

        {/* Countdown */}
        <div className="pb-result-countdown">
          <p>Reset otomatis dalam {timeLeft} detik</p>
          <div className="pb-countdown-bar">
            <div className="pb-countdown-fill" style={{ width: `${(timeLeft / 60) * 100}%` }} />
          </div>
        </div>
      </main>

      <div className="pb-bottom-action">
        <PrimaryButton onClick={onHome}>📷 Foto Baru</PrimaryButton>
      </div>
    </div>
  );
}
