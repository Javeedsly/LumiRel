import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './filmRecommender.css';
import { FaLightbulb } from "react-icons/fa";
import { useGlobalState } from "@/app/hooks";
import WishlistButton from '../WishlistButton/WishlistButton';
import { useGoToDetail } from '@/app/hooks/utilis/goToDetail';
import { IoDiceOutline } from "react-icons/io5";

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  { id: 1, question: 'Kendini nasıl hissediyorsun?', options: ['Mutlu', 'Üzgün', 'Normal'] },
  {
    id: 2,
    question: 'Hangi türde filmleri seviyorsun?',
    options: [
      'Macera & Fantastik',
      'Aksiyon & Suç',
      'Korku & Gerilim',
      'Aile & Komedi',
      'Dram & Romantik'
    ]
  },
  { id: 3, question: 'Hangi yıldan sonra olan filmler olsun?', options: ['2010’dan sonra', '2010’dan önce', 'Fark etmez'] },
  { id: 4, question: 'Filmi kiminle izleyeceksin?', options: ['Ailem ile', 'Sevgilim ile', 'Arkadaşlarımla', 'Tek'] }
];

const FilmRecommender: React.FC = () => {

  const goToDetail = useGoToDetail();
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showMovies, setShowMovies] = useState(false);
  const [shuffleIndex, setShuffleIndex] = useState(0);

  const { films, filmsLoading, dispatch, getFilms } = useGlobalState();

  useEffect(() => {
    if (!films.length) {
      dispatch(getFilms());
    }
  }, [dispatch, films.length]);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setShowMovies(false);
    setSelectedAnswers(Array(questions.length).fill(''));
    setCurrentQuestionIndex(0);
    setShuffleIndex(0);
    document.body.classList.add("modal-open");
  }, []);

  const closeModal = useCallback(() => {
    const modalElement = document.querySelector(".modal");

    if (modalElement) {
      modalElement.classList.add("closing");
      setTimeout(() => {
        setIsOpen(false);
        setShowMovies(false);
        modalElement.classList.remove("closing");
        document.body.classList.remove("modal-open");
      }, 600);
    } else {
      setIsOpen(false);
      setShowMovies(false);
      document.body.classList.remove("modal-open");
    }
  }, []);

  const handleAnswerSelect = useCallback((answer: string) => {
    setTransitioning(true);
    setTimeout(() => {
      setTransitioning(false);
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestionIndex] = answer;
      setSelectedAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setShowMovies(true);
        }, 2000);
      }
    }, 500);
  }, [currentQuestionIndex, selectedAnswers]);

  const filteredMovies = useMemo(() => {
    return films.filter((film: any) => {
      const matchesMood =
        (selectedAnswers[0] === 'Mutlu' && film.category.includes('Komedi')) ||
        (selectedAnswers[0] === 'Üzgün' && film.category.includes('Dram')) ||
        (selectedAnswers[0] === 'Normal');

      const matchesCategory =
        (selectedAnswers[1] === 'Macera & Fantastik' && film.category.some((c: string) => ['Macera', 'Fantastik', 'Bilim Kurgu'].includes(c))) ||
        (selectedAnswers[1] === 'Aksiyon & Suç' && film.category.some((c: string) => ['Aksiyon', 'Suç'].includes(c))) ||
        (selectedAnswers[1] === 'Korku & Gerilim' && film.category.some((c: string) => ['Korku', 'Gerilim', 'Psikolojik'].includes(c))) ||
        (selectedAnswers[1] === 'Aile & Komedi' && film.category.some((c: string) => ['Aile', 'Komedi'].includes(c))) ||
        (selectedAnswers[1] === 'Dram & Romantik' && film.category.some((c: string) => ['Dram', 'Romantik'].includes(c))) ||
        (!selectedAnswers[1]);

      const matchesYear =
        (selectedAnswers[2] === '2010’dan sonra' && parseInt(film.year) >= 2010) ||
        (selectedAnswers[2] === '2010’dan önce' && parseInt(film.year) < 2010) ||
        (selectedAnswers[2] === 'Fark etmez') ||
        (!selectedAnswers[2]);

      const matchesWatchingWith =
        (selectedAnswers[3] === 'Ailem ile' && film.watch_with.some((w: string) => w.includes('Aile'))) ||
        (selectedAnswers[3] === 'Sevgilim ile' && film.watch_with.some((w: string) => w.includes('Sevgilim'))) ||
        (selectedAnswers[3] === 'Arkadaşlarımla' && film.watch_with.some((w: string) => w.includes('Arkadaşlar'))) ||
        (selectedAnswers[3] === 'Tek' && film.watch_with.some((w: string) => ['Tek', 'Tek Başına'].includes(w))) ||
        (!selectedAnswers[3]);

      return matchesMood && matchesCategory && matchesYear && matchesWatchingWith;
    });
  }, [films, selectedAnswers]);

  const shuffleMovies = useCallback(() => {
    if (filteredMovies.length > 4) {
      setShuffleIndex((prevIndex) => (prevIndex + 4) % filteredMovies.length);
    }
  }, [filteredMovies.length]);

  return (
    <div className="recommender-container">
      <button onClick={openModal} className="open-button">
        <FaLightbulb className='bulb' />
      </button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={closeModal} className="close-button">✖</button>
            {loading ? (
              <div className="loading">
                <div className="loading-icon"></div>
                Bilgiler yükleniyor...
              </div>
            ) : showMovies ? (
              <div className="movies-container">
                <h2>Uygun Filmler</h2>
                <div className="movies-list">
                  {filteredMovies.slice(shuffleIndex, shuffleIndex + 3).map((film: any, index: number) => (
                    <div key={film.id || `film-${index}`} className="movie-card">
                      <img src={film.poster || "fallback-image.jpg"} alt={film.title} onClick={() => {
                        goToDetail(film.id); 
                        closeModal(); 
                      }} />
                      <div className="select-info">
                        <h3 >{film.title}</h3>
                        <p><strong>Yıl:</strong> {film.year}</p>
                        <p><strong>Tür:</strong> {film.genre}</p>
                      </div>
                      <div className="favIcon">
                        <WishlistButton movie={film} />
                      </div>
                    </div>
                  ))}
                </div>
                {filteredMovies.length > 3 && (
                  <button onClick={shuffleMovies} className="shuffle-button"><IoDiceOutline className='dice-icon' /> Qarışdır</button>
                )}
              </div>
            ) : (
              <div className={`question-container ${transitioning ? 'flip-out' : 'flip-in'}`}>
                <h2 className="question">{questions[currentQuestionIndex].question}</h2>
                <div className="options">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <button key={index} onClick={() => handleAnswerSelect(option)} className="option-button">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmRecommender;






























// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import './filmRecommender.css';
// import { FaLightbulb } from "react-icons/fa";
// import { useGlobalState } from "@/app/hooks";

// interface Question {
//   id: number;
//   question: string;
//   options: string[];
// }

// const questions: Question[] = [
//   { id: 1, question: 'Özünü nasıl hissediyorsun?', options: ['Mutlu', 'Üzgün', 'Normal'] },
//   { 
//     id: 2, 
//     question: 'Hangi türde filmleri seviyorsun?', 
//     options: [
//       'Macera & Fantastik', 
//       'Aksiyon & Suç', 
//       'Korku & Gerilim', 
//       'Aile & Komedi',
//       'Dram & Romantik'
//     ] 
//   },
//   { id: 3, question: 'Hangi yıldan sonra olan filmler olsun?', options: ['2010’dan sonra', '2010’dan önce', 'Fark etmez'] },
//   { id: 4, question: 'Filmi kiminle izleyeceksin?', options: ['Ailem ile', 'Sevgilim ile', 'Arkadaşlarımla', 'Tek'] }
// ];

// const FilmRecommender: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(questions.length).fill(''));
//   const [loading, setLoading] = useState(false);
//   const [transitioning, setTransitioning] = useState(false);
//   const [showMovies, setShowMovies] = useState(false);

//   const { films, filmsLoading, dispatch, getFilms } = useGlobalState();

//   useEffect(() => {
//     if (!films.length) {
//       dispatch(getFilms());
//     }
//   }, [dispatch, films.length]);

//   const openModal = useCallback(() => {
//     setIsOpen(true);
//     setShowMovies(false);
//     setSelectedAnswers(Array(questions.length).fill(''));
//     setCurrentQuestionIndex(0);
//   }, []);

//   const closeModal = useCallback(() => {
//     const modalElement = document.querySelector(".modal");

//     if (modalElement) {
//       modalElement.classList.add("closing");

//       setTimeout(() => {
//         setIsOpen(false);
//         setShowMovies(false);
//         modalElement.classList.remove("closing");
//       }, 600);
//     } else {
//       setIsOpen(false);
//       setShowMovies(false);
//     }
//   }, []);

//   const handleAnswerSelect = useCallback((answer: string) => {
//     setTransitioning(true);
//     setTimeout(() => {
//       setTransitioning(false);
//       const newAnswers = [...selectedAnswers];
//       newAnswers[currentQuestionIndex] = answer;
//       setSelectedAnswers(newAnswers);

//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//       } else {
//         setLoading(true);
//         setTimeout(() => {
//           setLoading(false);
//           setShowMovies(true);
//         }, 2000);
//       }
//     }, 500);
//   }, [currentQuestionIndex, selectedAnswers]);

//   const filteredMovies = useMemo(() => {
//     return films.filter((film: any) => {
//       const matchesMood =
//         (selectedAnswers[0] === 'Mutlu' && film.category.includes('Komedi')) ||
//         (selectedAnswers[0] === 'Üzgün' && film.category.includes('Dram')) ||
//         (selectedAnswers[0] === 'Normal');

//       const matchesCategory =
//         (selectedAnswers[1] === 'Macera & Fantastik' && film.category.some((c: string) => ['Macera', 'Fantastik', 'Bilim Kurgu'].includes(c))) ||
//         (selectedAnswers[1] === 'Aksiyon & Suç' && film.category.some((c: string) => ['Aksiyon', 'Suç'].includes(c))) ||
//         (selectedAnswers[1] === 'Korku & Gerilim' && film.category.some((c: string) => ['Korku', 'Gerilim', 'Psikolojik'].includes(c))) ||
//         (selectedAnswers[1] === 'Aile & Komedi' && film.category.some((c: string) => ['Aile', 'Komedi'].includes(c))) ||
//         (selectedAnswers[1] === 'Dram & Romantik' && film.category.some((c: string) => ['Dram', 'Romantik'].includes(c))) ||
//         (!selectedAnswers[1]);

//       const matchesYear =
//         (selectedAnswers[2] === '2010’dan sonra' && parseInt(film.year) >= 2010) ||
//         (selectedAnswers[2] === '2010’dan önce' && parseInt(film.year) < 2010) ||
//         (selectedAnswers[2] === 'Fark etmez') ||
//         (!selectedAnswers[2]);

//       const matchesWatchingWith =
//         (selectedAnswers[3] === 'Ailem ile' && film.watch_with.some((w: string) => w.includes('Aile'))) ||
//         (selectedAnswers[3] === 'Sevgilim ile' && film.watch_with.some((w: string) => w.includes('Sevgilim'))) ||
//         (selectedAnswers[3] === 'Arkadaşlarımla' && film.watch_with.some((w: string) => w.includes('Arkadaşlar'))) ||
//         (selectedAnswers[3] === 'Tek' && film.watch_with.some((w: string) => ['Tek', 'Tek Başına'].includes(w))) ||
//         (!selectedAnswers[3]);

//       return matchesMood && matchesCategory && matchesYear && matchesWatchingWith;
//     });
//   }, [films, selectedAnswers]);

//   return (
//     <div className="recommender-container">
//       <button onClick={openModal} className="open-button">
//         <FaLightbulb className='bulb' />
//       </button>

//       {isOpen && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <button onClick={closeModal} className="close-button">✖</button>
//             {loading ? (
//               <div className="loading">
//                 <div className="loading-icon"></div>
//                 Bilgiler yükleniyor...
//               </div>
//             ) : showMovies ? (
//               <div className="movies-container">
//                 <h2>Uygun Filmler</h2>
//                 <div className="movies-list">
//                   {filteredMovies.length > 0 ? (
//                     filteredMovies.map((film: any, index: number) => (
//                       <div key={film.id || `film-${index}`} className="movie-card">
//                         <img src={film.poster || "fallback-image.jpg"} alt={film.title} />
//                         <div className="select-info">
//                           <h3>{film.title}</h3>
//                           <p><strong>Yıl:</strong> {film.year}</p>
//                           <p><strong>Tür:</strong> {film.genre}</p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p>Uygun film bulunamadı.</p>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div className={`question-container ${transitioning ? 'flip-out' : 'flip-in'}`}>
//                 <span className="question-icon">❓</span>
//                 <h2 className="question">{questions[currentQuestionIndex].question}</h2>
//                 <div className="options">
//                   {questions[currentQuestionIndex].options.map((option, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleAnswerSelect(option)}
//                       className="option-button"
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilmRecommender;
