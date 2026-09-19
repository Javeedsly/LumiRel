"use client";

import "./security.css";

const Security = () => {
  return (
    <div className="security-container">
      <h1 className="security-title">
        🔒 Hesap
        Güvenliği
      </h1>

      <p className="security-subtitle">
        LumiReel
        hesabınızı
        korumak için
        aşağıdaki
        güvenlik
        önerilerini
        dikkate alın.
      </p>

      <div className="security-tips">
        <div className="tip-card">
          <h3>
            🛡 Güçlü Bir
            Şifre Kullanın
          </h3>

          <p>
            Şifreniz en
            az 8 karakter
            uzunluğunda
            olmalı ve
            büyük-küçük
            harfler,
            rakamlar ve
            özel
            karakterler
            içermelidir.
          </p>
        </div>

        <div className="tip-card">
          <h3>
            ❌ Şifrenizi
            Kimseyle
            Paylaşmayın
          </h3>

          <p>
            LumiReel ekibi
            sizden asla
            şifre istemez.
            Şifrenizi hiç
            kimseyle
            paylaşmayın.
          </p>
        </div>

        <div className="tip-card">
          <h3>
            📩 E-posta
            Güvenliğinizi
            Sağlayın
          </h3>

          <p>
            Hesabınızı
            korumak için
            doğru e-posta
            adresinizi
            kullanın ve
            şüpheli
            e-postalara
            yanıt
            vermeyin.
          </p>
        </div>

        <div className="tip-card">
          <h3>
            🔗 Güvenilmeyen
            Linklere
            Tıklamayın
          </h3>

          <p>
            Yalnızca
            güvendiğiniz
            LumiReel
            bağlantılarını
            kullanın.
          </p>
        </div>
      </div>

      <div className="extra-security">
        <h2>
          Hesap
          Güvenliğinizi
          Artırmak için
          Öneriler
        </h2>

        <ul>
          <li>
            🛑 Ortak Wi-Fi
            ağlarında
            giriş
            yapmaktan
            kaçının.
          </li>

          <li>
            🔄 Şifrenizi
            düzenli olarak
            değiştirin.
          </li>

          <li>
            🔒
            Tarayıcınızı
            ve
            uygulamalarınızı
            güncel tutun.
          </li>

          <li>
            📩 Şüpheli
            bildirimlere
            karşı dikkatli
            olun.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Security;