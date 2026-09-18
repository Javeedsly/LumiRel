"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store/store";
import "./categoryModal.css";
import { FaTimes, FaBars } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useOptimizedCallback } from "@/app/hooks";

const CategoryModal: React.FC = () => {
  const router = useRouter();

  const { uniqueGenres } = useSelector((state: RootState) => state.films);

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const handleFilter = useOptimizedCallback((genre: string) => {
    setIsOpen(false);
    router.push(`/main/allfilms?genre=${genre}`);
  }, []);

  return (
    <div className="category-container">
      <button onClick={openModal} className="menu-button">
        <FaBars />
      </button>

      <div className={`category-modal ${isOpen ? "open" : ""}`}>
        <button onClick={closeModal} className="close-button-category">
          <FaTimes />
        </button>
        <h2>🎬 Film Kategorileri</h2>
        <ul className="category-list red">
          <li
            className="category-item"
            onClick={() => handleFilter("all")}
          >
            Tüm Kategoriler
          </li>
          {uniqueGenres.map((genre, index) => (
            <li
              key={index}
              className="category-item"
              onClick={() => handleFilter(genre)}
            >
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryModal;
