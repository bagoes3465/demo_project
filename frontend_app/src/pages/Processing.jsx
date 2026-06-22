import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import '../styles/processing.css';
import madiun_logo from '../assets/madiun.png';

export default function Processing({ onProcess, processingId, onComplete, onError }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Memulai proses...');
  const [called, setCalled] = useState(false);
  const [currentProcessingId, setCurrentProcessingId] = useState(processingId);
  const pollingRef = useRef(null);
  const targetProgressRef = useRef(0);
  const animFrameRef = useRef(null);

  // 1. Call the process API once (returns immediately with processing_id)
  useEffect(() => {
    if (called) return;
    setCalled(true);
    onProcess();
  }, [called, onProcess]);

  // 2. Track processingId from parent (set after onProcess resolves)
  useEffect(() => {
    if (processingId) {
      setCurrentProcessingId(processingId);
    }
  }, [processingId]);

  // 3. Smooth progress animation — lerp toward target
  useEffect(() => {
    const animate = () => {
      setProgress((prev) => {
        const target = targetProgressRef.current;
        if (Math.abs(prev - target) < 0.5) return target;
        return prev + (target - prev) * 0.08;
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // 4. Poll backend for real status
  useEffect(() => {
    if (!currentProcessingId) return;

    const poll = async () => {
      try {
        const data = await api.getProcessingStatus(currentProcessingId);

        targetProgressRef.current = data.progress;
        setStatus(data.status_text);

        if (data.status === 'completed') {
          clearInterval(pollingRef.current);
          targetProgressRef.current = 100;
          setProgress(100);
          setStatus('Selesai!');
          // Small delay for the 100% animation to show
          setTimeout(() => onComplete(data), 600);
          return;
        }

        if (data.status === 'failed') {
          clearInterval(pollingRef.current);
          onError(data.error_message || 'Proses gagal');
          return;
        }
      } catch {
        // Network error — keep polling, don't crash
      }
    };

    // Poll every 1.5 seconds
    poll();
    pollingRef.current = setInterval(poll, 1500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [currentProcessingId, onComplete, onError]);

  return (
    <div className="pb-page pb-processing">
      <header className="pb-header">
        <div className="pb-header-left">
          <img src={madiun_logo} alt="Logo Madiun" className="pb-logo-circle" />
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth</div>
          </div>
        </div>
      </header>

      <main className="pb-processing-main">
        <div className="pb-processing-center">
          <div className="pb-loading-animation">
            <div className="pb-pulse-ring" />
            <div className="pb-pulse-ring" />
            <div className="pb-pulse-ring" />
            <div className="pb-pulse-center">✨</div>
          </div>

          <h2 className="pb-processing-title">Sedang Memproses Foto...</h2>
          <p className="pb-processing-status">{status}</p>

          <div className="pb-progress-bar">
            <div className="pb-progress-fill" style={{ width: `${Math.floor(progress)}%` }} />
          </div>
          <p className="pb-progress-text">{Math.floor(progress)}%</p>
          <p className="pb-processing-note">
            Mohon tunggu, AI sedang memproses foto Anda.
          </p>
        </div>
      </main>
    </div>
  );
}
