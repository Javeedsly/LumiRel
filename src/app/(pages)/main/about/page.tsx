"use client";

import {
  useMemo,
} from "react";

import Link from "next/link";

import {
  motion,
} from "framer-motion";

import "./about.css";

const About = () => {
  const aboutData =
    useMemo(
      () => ({
        title:
          "Hakkımızda",

        description:
          "Film dünyası sonsuz bir macera ve biz bu macerayı size daha yakın hale getirmek için buradayız! Platformumuzda en iyi filmleri keşfetme, izleme ve paylaşma imkanı sunuyoruz.",

        mission:
          "Amacımız sadece bir film platformu olmak değil – filmleri daha eğlenceli, rahat ve etkileşimli şekilde izlemenizi sağlamak.",

        cards: [
          {
            icon: "🎬",
            title:
              "Geniş Film Kataloğu",
            text:
              "Klasiklerden en yeni filmlere kadar geniş bir arşiv keşfedin.",
          },
          {
            icon: "🔍",
            title:
              "Akıllı Arama ve Filtreleme",
            text:
              "Zevkinize uygun filmleri kolayca bulun.",
          },
          {
            icon: "🎭",
            title:
              "Etkileşimli Deneyim",
            text:
              "Film önerilerini keşfedin, yorum yapın ve favorilerinizi kaydedin.",
          },
        ],
      }),
      []
    );

  return (
    <section className="about-section">
      <div className="parallax-bg" />

      <motion.div
        className="about-content"
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <h1 className="about-title">
          {
            aboutData.title
          }
        </h1>

        <p className="about-description">
          {
            aboutData.description
          }
        </p>

        <div className="about-cards">
          {aboutData.cards.map(
            (
              card,
              index
            ) => (
              <motion.div
                key={
                  card.title
                }
                className="about-card"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration:
                    0.4,

                  delay:
                    index *
                    0.08,
                }}
                whileHover={{
                  y: -6,
                }}
              >
                <div className="card-icon">
                  {
                    card.icon
                  }
                </div>

                <h3 className="card-title">
                  {
                    card.title
                  }
                </h3>

                <p className="card-text">
                  {
                    card.text
                  }
                </p>
              </motion.div>
            )
          )}
        </div>

        <p className="about-mission">
          {
            aboutData.mission
          }
        </p>

        <Link
          className="explore-button"
          href="/main/allfilms"
        >
          Filmleri
          Keşfet!
        </Link>
      </motion.div>
    </section>
  );
};

export default About;