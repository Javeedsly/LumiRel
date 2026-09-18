"use client"
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './carousel.css'; 

gsap.registerPlugin(ScrollTrigger);

const Carousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!CSS.supports('animation-timeline: scroll()')) {
      gsap.set(sectionRef.current, { '--unique-base': 0 });
      gsap.to(sectionRef.current, {
        '--unique-base': 320,
        ease: 'none',
        scrollTrigger: {
          horizontal: true,
          scrub: true,
          scroller: ulRef.current,
        },
      });

      const ITEMS = ulRef.current?.querySelectorAll('.unique-carousel-item');
      ITEMS?.forEach((ITEM) => {
        gsap
          .timeline()
          .set(ITEM, { '--unique-sat': 0 })
          .to(ITEM, {
            '--unique-sat': 100,
            scrollTrigger: {
              trigger: ITEM,
              start: 'right 75%',
              end: 'center center',
              horizontal: true,
              scrub: true,
              scroller: ulRef.current,
            },
          })
          .fromTo(
            ITEM,
            { '--unique-sat': 100 },
            {
              '--unique-sat': 0,
              scrollTrigger: {
                trigger: ITEM,
                end: 'left 25%',
                start: 'center center',
                horizontal: true,
                scrub: true,
                scroller: ulRef.current,
              },
            }
          );
      });
    }
  }, []);

  const syncPointer = ({ clientX: x, clientY: y }: { clientX: number; clientY: number }) => {
    document.documentElement.style.setProperty('--unique-px', x.toFixed(2));
    document.documentElement.style.setProperty('--unique-py', y.toFixed(2));
  };

  useEffect(() => {
    document.body.addEventListener('pointermove', syncPointer);
    return () => document.body.removeEventListener('pointermove', syncPointer);
  }, []);

  return (
    <section className="unique-slider-section" ref={sectionRef}>
      <ul className="unique-slider-list" ref={ulRef}>
        <li className="unique-carousel-item">
          <article className="unique-glow-card" data-glow>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="unique-icon">
                <path
                  fillRule="evenodd"
                  d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="unique-card-title">Premium</h2>
              <span className="unique-card-subtitle">Full HD Movies</span>
            </div>
            <hr className="unique-card-divider" />
            <span className="unique-card-text">Monthly Plan</span>
            <span className="unique-card-text">7$</span>
          </article>
        </li>
        <li className="unique-carousel-item">
          <article className="unique-glow-card" data-glow>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="unique-icon">
                <path
                  fillRule="evenodd"
                  d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="unique-card-title">Film Recommender</h2>
              <span className="unique-card-subtitle">For You</span>
            </div>
            <hr className="unique-card-divider" />
            <span className="unique-card-text">Q&A Picks</span>
            <span className="unique-card-text">Best Match</span>
          </article>
        </li>
        <li className="unique-carousel-item">
        <article className="unique-glow-card" data-glow>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="unique-icon">
      <path
        fillRule="evenodd"
        d="M4 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2h-3v16h3a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2h3V4H5a1 1 0 0 1-1-1Zm9 1h-2v16h2V4Z"
        clipRule="evenodd"
      />
    </svg>
    <h2 className="unique-card-title">Popular Movies</h2>
    <span className="unique-card-subtitle">Most Watched</span>
  </div>
  <hr className="unique-card-divider" />
  <span className="unique-card-text">All categories</span>
  <span className="unique-card-text">Including IMDb Top 10</span>
</article>

        </li>
        <li className="unique-carousel-item">
          <article className="unique-glow-card" data-glow>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="unique-icon">
                <path
                  fillRule="evenodd"
                  d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                  clipRule="evenodd"
                />
                <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
              </svg>
              <h2 className="unique-card-title">Comments</h2>
              <span className="unique-card-subtitle">Share your thoughts</span>
            </div>
            <hr className="unique-card-divider" />
            <span className="unique-card-text">Movie Discussions</span>
            <span className="unique-card-text">Discuss & rate movies</span>
          </article>
        </li>
      </ul>
    </section>
  );
};

export default Carousel;

