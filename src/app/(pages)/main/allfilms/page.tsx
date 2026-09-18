"use client";

import FilmsCarousel from '@/app/Components/FilmsCarousel/FilmsCarousel';
import { useGlobalState, useOptimizedMemo } from "@/app/hooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import WishlistButton from "@/app/Components/WishlistButton/WishlistButton";
import "./allfilms.css";
import { useGoToDetail } from '@/app/hooks/utilis/goToDetail';
import ProtectedRoute from '@/app/Components/ProtectedRoute/ProtectedRoute';

const Page: React.FC = () => {
    const { films: data, error, dispatch, getFilms } = useGlobalState();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get("genre") || "all";
    const goToDetail = useGoToDetail();
    const [visibleCount, setVisibleCount] = useState(20);

    useEffect(() => {
        if (!data.length) {
            dispatch(getFilms());
        }
    }, [dispatch, data.length]);

    const filteredFilms = useOptimizedMemo(() => {
        if (selectedCategory === "all") return data;
        return data.filter(film => film.genre === selectedCategory);
    }, [selectedCategory, data]);

    const latestMovies = useOptimizedMemo(() => {
        return data.filter(film => film.year >= 2020);
    }, [data]);

    const handleShowMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    if (error) return <p className="error">Xəta baş verdi: {error}</p>;
    if (!data.length) return <p className="no-films">Filmlər tapılmadı.</p>;

    return (
        <ProtectedRoute>
            <main className='main-allfilms'>
                <section className='section-allfilms'>
                    <section>
                        <h4>Pöpüler filmler</h4>
                        <FilmsCarousel />
                    </section>
                    <section className="poster-section">
                        <h4>Son 5 yilin filmleri</h4>
                        <div className="posters">
                            {latestMovies.map((film) => (
                                <div key={film.id} className="poster-item" >
                                    <div className="imgP">
                                        <img src={film.poster} alt={film.title} />
                                    </div>
                                    <div className="poster-info">
                                        <h5 onClick={() => goToDetail(film.id)}>{film.title} </h5>
                                        <span>{film.year}</span>
                                        <span>IMDb: {film.imdb}</span>
                                    </div>
                                    <div className="like-section">
                                        <WishlistButton movie={film} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="category-film-section">
                        <h4>{selectedCategory === "all" ? "Tüm filmler" : `${selectedCategory} Filmler`}</h4>
                        <div className="category-films-container">
                            {filteredFilms.slice(0, visibleCount).map((film) => (
                                <div key={film.id} className="category-film-item" >
                                    <img src={film.poster} alt={film.title} />
                                    <div className="film-info" onClick={() => goToDetail(film.id)}>
                                        <h5>{film.title}</h5>
                                        <span>{film.year}</span>
                                        <span>IMDb: {film.imdb}</span>
                                    </div>
                                    <div className="wish-icon">
                                        <WishlistButton movie={film} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {visibleCount < filteredFilms.length && (
                            <button className="unveil-more-btn" onClick={handleShowMore}>Daha fazla</button>
                        )}
                    </section>
                </section>
            </main>
        </ProtectedRoute>
    );
};

export default Page;
