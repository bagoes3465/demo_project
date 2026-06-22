import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import '../styles/home.css';
import madiun_logo from '../assets/madiun.png';

export default function Home({ onStart }) {
  return (
    <div className="pb-page">
      <header className="pb-header">
        <div className="pb-header-left">
          <img src={madiun_logo} alt="Logo Madiun" className="pb-logo-circle" />
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth Service</div>
          </div>
        </div>
        <div className="pb-status">
          <span className="pb-status-dot" />
          <span>Siap Digunakan</span>
        </div>
      </header>

      <main className="pb-home-main">
        <div className="pb-hero">
          <div className="pb-hero-icon">📷</div>
          <h1 className="pb-hero-title">AI PHOTOBOOTH<br />KOTA MADIUN</h1>
          <p className="pb-hero-desc">
            Abadikan momen Anda dengan latar belakang landmark Kota Madiun
            menggunakan teknologi AI terkini.
          </p>
        </div>

        <section className="pb-features">
          <div className="pb-feature">
            <div className="pb-feature-icon">🖼️</div>
            <div className="pb-feature-title">Latar Kota Madiun</div>
            <div className="pb-feature-desc">Landmark ikonik kota</div>
          </div>
          <div className="pb-feature">
            <div className="pb-feature-icon">🎨</div>
            <div className="pb-feature-title">Maskot Interaktif</div>
            <div className="pb-feature-desc">Relo, Madya & Rasa</div>
          </div>
          <div className="pb-feature">
            <div className="pb-feature-icon">✨</div>
            <div className="pb-feature-title">Filter & Efek AI</div>
            <div className="pb-feature-desc">Kualitas profesional</div>
          </div>
        </section>
      </main>

      <footer className="pb-footer">
        <span>v2.0.0 • Pemerintah Kota Madiun</span>
        <span>Perlu bantuan? Hubungi petugas di sekitar.</span>
      </footer>

      <div className="pb-bottom-action">
        <PrimaryButton onClick={onStart}>📷 Mulai Foto</PrimaryButton>
      </div>
    </div>
  );
}
