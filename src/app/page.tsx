"use client";

import Link from "next/link";

import {
  motion,
} from "framer-motion";

import {
  FaArrowRight,
  FaFilm,
  FaMagic,
  FaPlay,
} from "react-icons/fa";

import Slider from "./Components/Slider/Slider";
import Carousel from "./Components/Carousel/Carousel";
import Box from "./Components/Box/Box";

import styles from "./page.module.css";

const Page = () => {
  return (
    <div className={styles.home}>
      <div className={styles.ambientOne} />
      <div className={styles.ambientTwo} />

      <section className={styles.hero}>
        <Slider />
      </section>

      <motion.section
        className={styles.intro}
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.6,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
      >
        <div className={styles.sectionBadge}>
          <FaFilm />

          <span>
            Curated for you
          </span>
        </div>

        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>
              LumiReel Selection
            </p>

            <h2>
              Movies worth
              your attention.
            </h2>
          </div>

          <Link
            href="/main/allfilms"
            className={styles.textLink}
          >
            View all

            <FaArrowRight />
          </Link>
        </div>

        <p className={styles.sectionDescription}>
          Discover high-rated movies from
          different genres, selected from
          the LumiReel library.
        </p>
      </motion.section>

      <Box />

      <motion.section
        className={styles.experienceSection}
        initial={{
          opacity: 0,
          y: 35,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.15,
        }}
        transition={{
          duration: 0.65,
        }}
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>
              More than watching
            </p>

            <h2>
              Your cinematic
              playground.
            </h2>
          </div>

          <FaMagic className={styles.magicIcon} />
        </div>

        <p className={styles.sectionDescription}>
          Search, discover, save favorites,
          get movie recommendations and join
          discussions — all in one place.
        </p>
      </motion.section>

      <Carousel />

      <motion.section
        className={styles.cta}
        initial={{
          opacity: 0,
          scale: 0.97,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <div className={styles.ctaGlow} />

        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}>
            <FaPlay />
          </div>

          <div>
            <p className={styles.eyebrow}>
              Unlimited discovery
            </p>

            <h2>
              Your next movie is
              one click away.
            </h2>

            <p>
              Explore the complete LumiReel
              catalog and find something
              worth watching tonight.
            </p>
          </div>

          <Link
            href="/main/allfilms"
            className={styles.ctaButton}
          >
            Explore Movies

            <FaArrowRight />
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Page;