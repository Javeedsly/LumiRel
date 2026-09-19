"use client";

import {
  useEffect,
  useRef,
} from "react";

import gsap from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import "./carousel.css";

gsap.registerPlugin(
  ScrollTrigger
);

const Carousel = () => {
  const sectionRef =
    useRef<HTMLElement>(
      null
    );

  const ulRef =
    useRef<HTMLUListElement>(
      null
    );

  useEffect(() => {
    const list =
      ulRef.current;

    const section =
      sectionRef.current;

    if (
      !list ||
      !section
    ) {
      return;
    }

    const context =
      gsap.context(
        () => {
          if (
            !CSS.supports(
              "animation-timeline: scroll()"
            )
          ) {
            gsap.set(
              section,
              {
                "--unique-base":
                  0,
              }
            );

            gsap.to(
              section,
              {
                "--unique-base":
                  320,

                ease: "none",

                scrollTrigger:
                  {
                    horizontal:
                      true,

                    scrub:
                      true,

                    scroller:
                      list,
                  },
              }
            );

            const items =
              list.querySelectorAll(
                ".unique-carousel-item"
              );

            items.forEach(
              (item) => {
                gsap
                  .timeline()
                  .set(
                    item,
                    {
                      "--unique-sat":
                        0,
                    }
                  )
                  .to(
                    item,
                    {
                      "--unique-sat":
                        100,

                      scrollTrigger:
                        {
                          trigger:
                            item,

                          start:
                            "right 75%",

                          end:
                            "center center",

                          horizontal:
                            true,

                          scrub:
                            true,

                          scroller:
                            list,
                        },
                    }
                  );
              }
            );
          }
        },
        sectionRef
      );

    return () => {
      context.revert();
    };
  }, []);

  useEffect(() => {
    const syncPointer = (
      event: PointerEvent
    ) => {
      document.documentElement.style.setProperty(
        "--unique-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--unique-y",
        `${event.clientY}px`
      );
    };

    window.addEventListener(
      "pointermove",
      syncPointer
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        syncPointer
      );
    };
  }, []);

  return (
    <section
      className="unique-slider-section"
      ref={
        sectionRef
      }
    >
      <ul
        className="unique-slider-list"
        ref={
          ulRef
        }
      >
        <li className="unique-carousel-item">
          <article
            className="unique-glow-card"
            data-glow
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="unique-icon"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm4.3 8.3-5 5a1 1 0 0 1-1.4 0l-2.2-2.2 1.4-1.4 1.5 1.5 4.3-4.3Z" />
              </svg>

              <h2 className="unique-card-title">
                Free Access
              </h2>

              <span className="unique-card-subtitle">
                All movies are open
              </span>
            </div>

            <hr className="unique-card-divider" />

            <span className="unique-card-text">
              No subscription
            </span>

            <span className="unique-card-text">
              Unlimited discovery
            </span>
          </article>
        </li>

        <li className="unique-carousel-item">
          <article
            className="unique-glow-card"
            data-glow
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="unique-icon"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                  clipRule="evenodd"
                />
              </svg>

              <h2 className="unique-card-title">
                Film Recommender
              </h2>

              <span className="unique-card-subtitle">
                For You
              </span>
            </div>

            <hr className="unique-card-divider" />

            <span className="unique-card-text">
              Q&A Picks
            </span>

            <span className="unique-card-text">
              Best Match
            </span>
          </article>
        </li>

        <li className="unique-carousel-item">
          <article
            className="unique-glow-card"
            data-glow
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="unique-icon"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2h-3v16h3a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2h3V4H5a1 1 0 0 1-1-1Zm9 1h-2v16h2V4Z"
                  clipRule="evenodd"
                />
              </svg>

              <h2 className="unique-card-title">
                Popular Movies
              </h2>

              <span className="unique-card-subtitle">
                Most Watched
              </span>
            </div>

            <hr className="unique-card-divider" />

            <span className="unique-card-text">
              All categories
            </span>

            <span className="unique-card-text">
              IMDb selections
            </span>
          </article>
        </li>

        <li className="unique-carousel-item">
          <article
            className="unique-glow-card"
            data-glow
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="unique-icon"
              >
                <path
                  fillRule="evenodd"
                  d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                  clipRule="evenodd"
                />
              </svg>

              <h2 className="unique-card-title">
                Comments
              </h2>

              <span className="unique-card-subtitle">
                Share your thoughts
              </span>
            </div>

            <hr className="unique-card-divider" />

            <span className="unique-card-text">
              Movie Discussions
            </span>

            <span className="unique-card-text">
              Discuss & rate
            </span>
          </article>
        </li>
      </ul>
    </section>
  );
};

export default Carousel;