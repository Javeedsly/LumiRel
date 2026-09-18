"use client";

import React, { useMemo } from "react";
import "./about.css";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";
import Link from "next/link";

const About: React.FC = () => {
  const aboutData = useMemo(
    () => ({
      title: "Hakkımızda",
      description:
        "Film dünyası sonsuz bir macera ve biz bu macerayı size daha yakın hale getirmek için buradayız! Platformumuzda en iyi filmleri keşfetme, izleme ve paylaşma imkanı sunuyoruz.",
      mission:
        "Amacımız sadece bir film platformu olmak değil – filmleri daha eğlenceli, rahat ve etkileşimli şekilde izlemenizi sağlamak.",
      cards: [
        {
          icon: "🎬",
          title: "Geniş Film Kataloğu",
          text: "Klasiklerden en yeni filmlere kadar geniş bir arşiv keşfedin.",
        },
        {
          icon: "🔍",
          title: "Akıllı Arama ve Filtreleme",
          text: "Zevkinize uygun filmleri kolayca bulun.",
        },
        {
          icon: "🎭",
          title: "Etkileşimli Deneyim",
          text: "Zar atarak indirimler kazanın ve size özel filmleri keşfedin.",
        },
      ],
    }),
    []
  );

  return (
    <ProtectedRoute>
      <section className="about-section">
        <div className="parallax-bg"></div>
        <div className="about-content">
          <h1 className="about-title">{aboutData.title}</h1>
          <p className="about-description">{aboutData.description}</p>

          <div className="about-cards">
            {aboutData.cards.map((card, index) => (
              <div key={index} className="about-card">
                <div className="card-icon">{card.icon}</div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-text">{card.text}</p>
              </div>
            ))}
          </div>

          <p className="about-mission">{aboutData.mission}</p>

          <button className="explore-button">
            <Link href="../../main/movies">Filmleri Keşfet!</Link>
          </button>
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default About;
