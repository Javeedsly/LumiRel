"use client";
import React from "react";
import "./plans.css";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";

const Plans = () => {
  return (
    <ProtectedRoute>
      <div className="plans-container">
        <h1 className="plans-title">🎬 LumiReel Abonelik Planları</h1>
        <p className="plans-subtitle">
          LumiReel ile **sınırsız film keyfi** yaşayın!  
          Sizin için en uygun **Ücretsiz ve Premium** planlarımızı keşfedin.
        </p>

        <div className="plans-table">
          <div className="plan-card free">
            <h3>🔒 Ücretsiz Plan</h3>
            <p>✅ LumiReel platformunu **tanıyın ve keşfedin**</p>
            <p>🚫 **Tüm filmlere erişim kısıtlıdır**</p>
            <p>🚫 **Çevrimdışı izleme yoktur**</p>
            <p>🚫 **4K HDR kalitesi desteklenmez**</p>
            <p>🚫 **Reklamlı kullanım**</p>
          </div>

          <div className="plan-card premium">
            <h3>✨ Premium Plan</h3>
            <p>✔ **Tüm filmlere sınırsız erişim**</p>
            <p>✔ **Ultra HD 4K HDR kalitesinde izleme**</p>
            <p>✔ **Reklamsız ve kesintisiz sinema deneyimi**</p>
            <p>✔ **Çevrimdışı izleme** – Filmlerinizi **istediğiniz zaman, istediğiniz yerde izleyin**</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Plans;
