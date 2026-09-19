"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

import {
  useRouter,
} from "next/navigation";

import {
  FaBars,
  FaChevronRight,
  FaFilm,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import type {
  RootState,
} from "@/app/redux/store/store";

import "./categoryModal.css";

const CategoryModal = () => {
  const router =
    useRouter();

  const {
    uniqueGenres,
  } = useSelector(
    (
      state: RootState
    ) => state.films
  );

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const openerRef =
    useRef<HTMLButtonElement>(
      null
    );

  const searchRef =
    useRef<HTMLInputElement>(
      null
    );

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleFilter = (
    genre: string
  ) => {
    closeModal();

    if (
      genre === "all"
    ) {
      router.push(
        "/main/allfilms"
      );

      return;
    }

    router.push(
      `/main/allfilms?genre=${encodeURIComponent(
        genre
      )}`
    );
  };

  const filteredGenres =
    useMemo(() => {
      const normalized =
        searchTerm
          .trim()
          .toLocaleLowerCase(
            "tr-TR"
          );

      if (!normalized) {
        return uniqueGenres;
      }

      return uniqueGenres.filter(
        (genre) =>
          genre
            .toLocaleLowerCase(
              "tr-TR"
            )
            .includes(
              normalized
            )
      );
    }, [
      searchTerm,
      uniqueGenres,
    ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        closeModal();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    const focusTimer =
      window.setTimeout(
        () => {
          searchRef.current?.focus();
        },
        250
      );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.clearTimeout(
        focusTimer
      );
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      openerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className="category-container">
      <button
        ref={openerRef}
        type="button"
        onClick={
          openModal
        }
        className="menu-button"
        aria-label="Film kategorilerini aç"
        aria-expanded={
          isOpen
        }
        aria-controls="film-category-drawer"
      >
        <FaBars />
      </button>

      <button
        type="button"
        className={`category-backdrop ${
          isOpen
            ? "category-backdrop--visible"
            : ""
        }`}
        aria-label="Film kategorilerini kapat"
        tabIndex={
          isOpen
            ? 0
            : -1
        }
        onClick={
          closeModal
        }
      />

      <aside
        id="film-category-drawer"
        className={`category-modal ${
          isOpen
            ? "open"
            : ""
        }`}
        aria-hidden={
          !isOpen
        }
        aria-label="Film kategorileri"
      >
        <div className="category-modal-header">
          <div className="category-heading">
            <div className="category-heading-icon">
              <FaFilm />
            </div>

            <div>
              <span className="category-eyebrow">
                LumiReel
              </span>

              <h2>
                Film Kategorileri
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={
              closeModal
            }
            className="close-button-category"
            aria-label="Kategorileri kapat"
          >
            <FaTimes />
          </button>
        </div>

        <p className="category-description">
          İzlemek istediğin türü seç ve
          LumiReel kataloğundaki filmleri
          kolayca keşfet.
        </p>

        <div className="category-search">
          <FaSearch />

          <input
            ref={searchRef}
            type="search"
            value={
              searchTerm
            }
            placeholder="Kategori ara..."
            aria-label="Kategori ara"
            onChange={(
              event
            ) =>
              setSearchTerm(
                event.target
                  .value
              )
            }
          />

          {searchTerm && (
            <button
              type="button"
              className="category-search-clear"
              aria-label="Aramayı temizle"
              onClick={() =>
                setSearchTerm(
                  ""
                )
              }
            >
              <FaTimes />
            </button>
          )}
        </div>

        <button
          type="button"
          className="all-categories-card"
          onClick={() =>
            handleFilter(
              "all"
            )
          }
        >
          <div className="all-categories-icon">
            <FaFilm />
          </div>

          <div className="all-categories-copy">
            <strong>
              Tüm Filmler
            </strong>

            <span>
              Kataloğun tamamını görüntüle
            </span>
          </div>

          <FaChevronRight className="all-categories-arrow" />
        </button>

        <div className="category-section-header">
          <div>
            <span>
              Türler
            </span>

            <strong>
              {filteredGenres.length}
            </strong>
          </div>

          {searchTerm && (
            <button
              type="button"
              onClick={() =>
                setSearchTerm(
                  ""
                )
              }
            >
              Temizle
            </button>
          )}
        </div>

        {filteredGenres.length >
        0 ? (
          <div className="category-list">
            {filteredGenres.map(
              (
                genre,
                index
              ) => (
                <button
                  type="button"
                  key={`${genre}-${index}`}
                  className="category-item"
                  onClick={() =>
                    handleFilter(
                      genre
                    )
                  }
                >
                  <span className="category-item-dot" />

                  <span className="category-item-name">
                    {
                      genre
                    }
                  </span>

                  <FaChevronRight className="category-item-arrow" />
                </button>
              )
            )}
          </div>
        ) : (
          <div className="category-empty">
            <div className="category-empty-icon">
              <FaSearch />
            </div>

            <h3>
              Kategori bulunamadı
            </h3>

            <p>
              Arama kelimesini değiştirerek
              tekrar deneyebilirsin.
            </p>

            <button
              type="button"
              onClick={() =>
                setSearchTerm(
                  ""
                )
              }
            >
              Aramayı temizle
            </button>
          </div>
        )}

        <div className="category-modal-footer">
          <span>
            {uniqueGenres.length}
          </span>

          <p>
            farklı film kategorisini
            keşfedebilirsin.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default CategoryModal;