"use client";

import React from "react";
import "./premium.css";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";

const Premium = () => {
  return (
    <ProtectedRoute>
      <div className="premium-container">
        <h1 className="premium-title">🎬 LumiReel Premium ile Sınırsız Film Keyfi!</h1>

        <div className="premium-benefits">
          <div className="benefit-card">
            <h3>🎥 4K Ultra HD Kalite</h3>
            <p>Filmleri **4K HDR** kalitesinde izleyin ve sinema salonu deneyimi yaşayın!</p>
          </div>
          <div className="benefit-card">
            <h3>🚀 Reklamsız İzleme</h3>
            <p>Filmleri ve dizileri **tamamen reklamsız** izleyin.</p>
          </div>
          <div className="benefit-card">
            <h3>📥 Çevrimdışı İzleme</h3>
            <p>İstediğiniz filmi **indirip internet olmadan izleyin**.</p>
          </div>
          <div className="benefit-card">
            <h3>🔓 Özel İçerikler</h3>
            <p>Diğer platformlarda olmayan **özel filmlere erişim sağlayın**.</p>
          </div>
        </div>

        <div className="premium-plans">
          <h2>Abonelik Planlarımız</h2>
          <div className="plans">
            <div className="plan-card free">
              <h3>🔒 Ücretsiz</h3>
              <p>🚫 Filmlere erişim yok</p>
              <p>🚫 Çevrimdışı izleme yok</p>
              <p>🚫 4K HDR desteği yok</p>
              <p>🚫 Reklamsız kullanım yok</p>
            </div>
            <div className="plan-card premium">
              <h3>🌟 Premium</h3>
              <p>✔ 4K HDR kalitesinde izleme</p>
              <p>✔ **Tüm filmlere sınırsız erişim**</p>
              <p>✔ **Tamamen reklamsız**</p>
              <p>✔ **Çevrimdışı izleme imkanı**</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Premium;
