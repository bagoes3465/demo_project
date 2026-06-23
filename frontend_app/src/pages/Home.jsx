import React, { useState, useEffect } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import '../styles/home.css';
import madiun_logo from '../assets/madiun.png';
import { api } from '../services/api';

const MOOD_CONFIG = {
  happy:  { emoji: '😊', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
  normal: { emoji: '😐', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.3)' },
  sad:    { emoji: '😢', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
};

export default function Home({ onStart }) {
  const [weeklyMood, setWeeklyMood] = useState(null);

  useEffect(() => {
    api.getMoodWeekly()
      .then(setWeeklyMood)
      .catch(() => {}); // silent fail, fitur non-kritis
  }, []);

  const dominant = weeklyMood?.dominant;
  const moodCfg = dominant ? MOOD_CONFIG[dominant] : null;

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
          <div className="pb-hero-icon">
            <img src={madiun_logo} alt="Madiun City" className="pb-hero-logo" />
          </div>
          <h1 className="pb-hero-title">AI Photobooth</h1>
          <p className="pb-hero-subtitle">Kota Madiun</p>
          <p className="pb-hero-desc">
            Abadikan momen istimewa Anda dengan latar belakang landmark ikonik Kota Madiun menggunakan teknologi AI terkini.
          </p>
        </div>

        {/* ── Mood Madiun Minggu Ini ── */}
        {weeklyMood && weeklyMood.total > 0 && (
          <section
            className="pb-mood-weekly"
            style={{ borderColor: moodCfg?.border, background: moodCfg?.bg }}
          >
            <div className="pb-mood-weekly-header">
              <span className="pb-mood-weekly-title">Mood Kota Minggu Ini</span>
              <span className="pb-mood-weekly-total">{weeklyMood.total} foto</span>
            </div>
            <div className="pb-mood-dominant">
              <span className="pb-mood-dominant-emoji">{moodCfg?.emoji}</span>
              <div>
                <div className="pb-mood-dominant-label">{weeklyMood.dominant_label}</div>
                <div className="pb-mood-dominant-sub">ekspresi terbanyak minggu ini</div>
              </div>
            </div>
            <div className="pb-mood-bars">
              {weeklyMood.breakdown.map((item) => {
                const cfg = MOOD_CONFIG[item.expression] || {};
                return (
                  <div key={item.expression} className="pb-mood-bar-row">
                    <span className="pb-mood-bar-label">{item.label}</span>
                    <div className="pb-mood-bar-track">
                      <div
                        className="pb-mood-bar-fill"
                        style={{ width: `${item.percent}%`, background: cfg.color }}
                      />
                    </div>
                    <span className="pb-mood-bar-pct">{item.percent}%</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="pb-features">
          <div className="pb-feature">
            <div className="pb-feature-icon pb-icon-bg">🏛️</div>
            <div className="pb-feature-title">Landmark Madiun</div>
            <div className="pb-feature-desc">Latar belakang kota terbaik</div>
          </div>
          <div className="pb-feature">
            <div className="pb-feature-icon pb-icon-bg">🎭</div>
            <div className="pb-feature-title">Maskot Karakter</div>
            <div className="pb-feature-desc">Relo, Madya & Rasa</div>
          </div>
          <div className="pb-feature">
            <div className="pb-feature-icon pb-icon-bg">⚡</div>
            <div className="pb-feature-title">Teknologi AI</div>
            <div className="pb-feature-desc">Hasil profesional instan</div>
          </div>
        </section>
      </main>

      <footer className="pb-footer">
        <span>v2.0.0 • Pemerintah Kota Madiun</span>
        <span>Perlu bantuan? Hubungi petugas di sekitar.</span>
      </footer>

      <div className="pb-bottom-action">
        <PrimaryButton onClick={onStart}>Mulai Foto</PrimaryButton>
      </div>
    </div>
  );
}
