"use client";

import React from "react";
import { useGlobalState, useOptimizedMemo } from "@/app/hooks";
import "./box.css";
import WishlistButton from "../WishlistButton/WishlistButton";
import { useGoToDetail } from "@/app/hooks/utilis/goToDetail";

const Box: React.FC = () => {
    const goToDetail = useGoToDetail();
    const { films: data, error, dispatch, getFilms } = useGlobalState();

    React.useEffect(() => {
        if (!data.length) {
            dispatch(getFilms());
        }
    }, [dispatch, data.length]);

    const filteredFilms = useOptimizedMemo(() => {
        const filtered = data?.filter(
            (film) => film.imdb >= 8.5 && film.popular
        );
    
        const uniqueGenres = new Set();
        const uniqueFilms = [];
    
        for (const film of filtered) {
            const genre = film.category[0]; 
            if (!uniqueGenres.has(genre)) {
                uniqueGenres.add(genre);
                uniqueFilms.push(film);
            }
            if (uniqueFilms.length >= 3) break;
        }
    
        return uniqueFilms;
    }, [data]);
    
    

    if (error) return <p>Xəta baş verdi: {error}</p>;

    return (
        <div className="custom-wrapper">
            {filteredFilms.map((item) => (
                <div className="custom-box" key={item.id}>
                    <div className="custom-item">
                        <img src={item.poster} alt={item.title} />
                        <div className="wishIcon">
                            <WishlistButton movie={item} />
                        </div>
                        <div className="custom-overlay"></div>
                        <div className="custom-text" onClick={() => goToDetail(item.id)}>
                            <h5>{item.title}</h5>
                            <div className="imdb">
                            <span> Year: <em>{item.year}</em> </span> /
                           <span>IMDB: <em> {item.imdb}</em></span> 
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Box;
