import React, { useRef, useState } from "react";

const QRCodeScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const startScan = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setScanning(true);
      
      // Add QR code scanning logic here
      // This would typically use a library like jsQR
      // For now, we'll just simulate a successful scan
      setTimeout(() => {
        onScan("simulated-digital-id");
        stopScan();
      }, 2000);
    } catch (err) {
      setError("Failed to access camera. Please ensure camera permissions are granted.");
      console.error(err);
    }
  };

  const stopScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setScanning(false);
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-48 object-cover rounded-lg"
        autoPlay
        playsInline
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-2">
          {error}
        </div>
      )}

      <div className="mt-2">
        {scanning ? (
          <button
            onClick={stopScan}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Stop Scan
          </button>
        ) : (
          <button
            onClick={startScan}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Start Scan
          </button>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;
