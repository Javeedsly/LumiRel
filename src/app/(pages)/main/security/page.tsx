"use client";

import React from "react";
import "./security.css";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";

const Security = () => {
  return (
    <ProtectedRoute>
      <div className="security-container">
        <h1 className="security-title">🔒 Hesap Güvenliği</h1>
        <p className="security-subtitle">
          LumiReel hesabınızı korumak için aşağıdaki **güvenlik önerilerini** dikkate alın.
        </p>

        <div className="security-tips">
          <div className="tip-card">
            <h3>🛡 Güçlü Bir Şifre Kullanın</h3>
            <p>
              Şifreniz **en az 8 karakter** uzunluğunda olmalı ve **büyük-küçük harfler, rakamlar ve özel karakterler** içermelidir.
            </p>
          </div>
          <div className="tip-card">
            <h3>❌ Şifrenizi Kimseyle Paylaşmayın</h3>
            <p>
              LumiReel ekibi sizden asla şifre istemez. **Şifrenizi hiç kimseyle paylaşmayın.**
            </p>
          </div>
          <div className="tip-card">
            <h3>📩 E-posta Güvenliğinizi Sağlayın</h3>
            <p>
              Hesabınızı korumak için doğru e-posta adresinizi kullanın ve **şüpheli e-postalara yanıt vermeyin**.
            </p>
          </div>
          <div className="tip-card">
            <h3>🔗 Güvenilmeyen Linklere Tıklamayın</h3>
            <p>
              LumiReel’in resmi web sitesi sadece **www.lumireel.com** adresidir. Farklı linklere tıklamayın.
            </p>
          </div>
        </div>

        <div className="extra-security">
          <h2>Hesap Güvenliğinizi Artırmak için Öneriler</h2>
          <ul>
            <li>🛑 **Ortak Wi-Fi ağlarında giriş yapmaktan kaçının.**</li>
            <li>🔄 **Şifrenizi düzenli olarak değiştirin.**</li>
            <li>🔒 **Tarayıcınızı ve uygulamalarınızı her zaman güncel tutun.**</li>
            <li>📩 **Resmi LumiReel bildirimlerine dikkat edin.**</li>
          </ul>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Security;
