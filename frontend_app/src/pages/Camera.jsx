import React, { useEffect, useRef, useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import '../styles/camera.css';
import madiun_logo from '../assets/madiun.png';

export default function Camera({ onBack, onCaptured }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    let mounted = true;

    navigator.mediaDevices
      .getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then((stream) => {
        if (mounted) {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
      })
      .catch(() => alert('Tidak dapat mengakses kamera.'));

    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleCapture = () => {
    setCapturing(true);
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null || countdown < 0) return;

    if (countdown === 0) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (canvas && video) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        stopCamera();
        onCaptured(dataUrl);
      }
      setCapturing(false);
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onCaptured]);

  return (
    <div className="pb-page">
      <header className="pb-header">
        <div className="pb-header-left">
          <img src={madiun_logo} alt="Logo Madiun" className="pb-logo-circle" />
          <div className="pb-title-block">
            <div className="pb-appname">Kota Madiun</div>
            <div className="pb-subtitle">AI Photobooth</div>
          </div>
        </div>
      </header>

      <main className="pb-camera-main">
        <h2 className="pb-camera-title">Silahkan Berpose</h2>
        <div className="pb-camera-container">
          <video ref={videoRef} autoPlay playsInline className="pb-camera-video" />
          {capturing && countdown > 0 && (
            <div className="pb-countdown-overlay">
              <div className="pb-countdown-number">{countdown}</div>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </main>

      <div className="pb-camera-actions">
        <PrimaryButton variant="secondary" onClick={() => { stopCamera(); onBack(); }}>
          Kembali
        </PrimaryButton>
        <PrimaryButton onClick={handleCapture} disabled={capturing}>
          {capturing ? `${countdown}...` : 'Ambil Foto'}
        </PrimaryButton>
      </div>
    </div>
  );
}
