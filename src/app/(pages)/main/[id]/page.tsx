"use client";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { useParams } from "next/navigation";
import "./detail.css";
import { getFilms, updateFilm } from "@/app/redux/features/apiSlice/apiSlice";
import { FaFire } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { RiSendPlaneLine } from "react-icons/ri";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";
import { useOptimizedCallback } from "@/app/hooks";
import { GrFormClose } from "react-icons/gr";
const Detail: React.FC = () => {
  
  const dispatch = useDispatch<AppDispatch>();
  const { data, error } = useSelector((state: RootState) => state.films);
  const params = useParams();
  const id = params.id as string;

  const film = useMemo(() => data.find((film) => film.id.toString() === id), [data, id]);
  const [newComment, setNewComment] = useState("");
  // const [comments, setComments] = useState(film?.comments || []);
  const user = useSelector((state: RootState) => state.auth.user);
  const currentUser = user || { id: 99, name: "İstifadəçi" };
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const isPremium = user?.isPremium ?? false;
  const [newReply, setNewReply] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [comments, setComments] = useState(
    film?.comments.map(comment => ({ ...comment, showSpoiler: false })) || []
  );

  
  useEffect(() => {
    if (!data.length) {
      dispatch(getFilms());
    }
  }, [dispatch, data.length]);

  useEffect(() => {
    if (film) {
      setComments(film.comments);
    }
  }, [film]);

  const formatDate = (timestamp: number | string) => {
    const date = new Date(Number(timestamp));
    return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
  };

  const handleAddComment = () => {
    if (newComment.trim() && film) {
      const newEntry = {
        id: Date.now(),
        user_id: currentUser.id,
        username: currentUser.name,
        userProfileImage: currentUser.profileImage || "/default-avatar.jpg",
        comment: newComment,
        flames: 0,
        users_who_liked: [],
        replies: [],
        timestamp: Date.now().toString(),
        isSpoiler: isSpoiler,
        showSpoiler: false,
      };

      const updatedComments = [...comments, newEntry];
      setComments(updatedComments);
      dispatch(updateFilm({ id: film.id, data: { comments: updatedComments } }));
      setNewComment("");
      setIsSpoiler(false);
    }
  };



  const handleLike = useOptimizedCallback(
    (commentId: number) => {
      if (!film) return;

      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? {
            ...comment,
            flames: comment.users_who_liked.includes(currentUser.id)
              ? comment.flames - 1
              : comment.flames + 1,
            users_who_liked: comment.users_who_liked.includes(currentUser.id)
              ? comment.users_who_liked.filter((uid) => uid !== currentUser.id)
              : [...comment.users_who_liked, currentUser.id],
          }
          : comment
      );

      setComments(updatedComments);
      dispatch(updateFilm({ id: film.id, data: { comments: updatedComments } }));
    },
    [film, comments, dispatch, currentUser]
  );

  const handleDeleteComment = (commentId: number, commentUserId: number) => {
    if (film && user?.id === commentUserId) {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);
      dispatch(updateFilm({ id: film.id, data: { comments: updatedComments } }));
    }
  };

  const handleReply = async (commentId: number, replyText: string, isSpoiler: boolean) => {
    if (replyText.trim() && film) {
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now(),
                user_id: currentUser.id,
                username: currentUser.name,
                userProfileImage: currentUser.profileImage || "/default-avatar.jpg",
                comment: replyText,
                timestamp: Date.now().toString(),
                isSpoiler: isSpoiler,
                showSpoiler: false,
              },
            ],
          }
          : comment
      );

      setComments(updatedComments);
      await dispatch(updateFilm({ id: film.id, data: { comments: updatedComments } }));
      setNewReply("");
      setReplyingTo(null);
      setIsSpoiler(false);
    }
  };

  const handleDeleteReply = async (commentId: number, replyId: number, replyUserId: number) => {
    if (film && user?.id === replyUserId) {
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== replyId),
          }
          : comment
      );

      setComments(updatedComments);
      await dispatch(updateFilm({ id: film.id, data: { comments: updatedComments } }));
    }
  };

  if (error) return <div className="error">Xəta: {error}</div>;
  if (!film) return <div className="not-found">Film tapılmadı.</div>;

  return (
    <ProtectedRoute>
      <main className="detailBack">
        <section>
          <div className="fragAbout">
            <div className="fragTitle">
              <div className="titleF">
                <h2>{film.title}</h2>
              </div>
              <div className="imdb">
                <span>IMDB <em>{film.imdb || "N/A"}</em></span>
              </div>
            </div>
            <div className="trailer">
              <div className="fragman">
                <iframe
                  width="530"
                  height="600"
                  src={film.trailer}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="about-film">
                <p>{film.summary || "Məlumat yoxdur"}</p>
                <div className="about-film-info">
                  <p><span>Director:</span> {film.director || "Bilinmir"}</p>
                  <p><span>Release Date:</span> {film.year || "Bilinmir"}</p>
                  <p><span>Duration:</span> {film.duration || "Bilinmir"}</p>
                  <p><span>Category:</span> {film.category?.join(", ") || "Bilinmir"}</p>
                  <p><span>Country:</span> {film.language || "Bilinmir"}</p>
                  <p><span>Main Actors:</span> {film.actors?.map(actor => actor.name).join(", ") || "Bilinmir"}</p>
                  <p><span>Production Company:</span> {film.production_company || "Bilinmir"}</p>
                  <p><span>IMDb Rating:</span> {film.imdb || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="fullmovie">
            {!isPremium && (
              <div className="locked-overlay">
                <p>Bu filmi izləmək üçün premium olmalısınız.</p>
              </div>
            )}
            <div className={`fullTop ${!isPremium ? "blurred" : ""}`}>
              <iframe
                width="100%"
                height="100%"
                src={film.full_movie_link}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </section>
        <section className="comments">
          <h3>💬 Comments</h3>

          <div className="comment-input">
            <div className="textarea-container">
              <textarea
                placeholder="Rəyinizi yazın..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="spoiler-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={isSpoiler}
                    onChange={() => setIsSpoiler(!isSpoiler)}
                  />
                  🤫
                </label>

                <button onClick={handleAddComment}>
                  <RiSendPlaneLine />
                </button>
              </div>
            </div>

          </div>
          <div className="comments-items">
            <div className="comments-list">
              {comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-header">
                    <div className="user-avatar">
                      <img src={c.userProfileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBGcM6Pr04EvVjbkfVmNnXQoFHU_Y3NxbaNQ&s"} alt="Profil" />
                    </div>
                    <div>
                      <div className="user-info-c">
                        <span className="comment-author">{c.username || "İstifadəçi"}</span>
                        <span className="comment-time"> 🕒 {formatDate(c.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="comment-text">
                    {c.isSpoiler && !c.showSpoiler ? (
                      <span className="spoiler-warning" onClick={() =>
                        setComments(prev => prev.map(comment =>
                          comment.id === c.id ? { ...comment, showSpoiler: true } : comment
                        ))
                      }>
                        ⚠️ Bu şərh spoiler ehtiva edir! Açmaq üçün klikləyin.
                      </span>
                    ) : (
                      c.comment
                    )}
                  </p>


                  <div className="comment-actions">
                    <button className="like-btn" onClick={() => handleLike(c.id)}>
                      <FaFire className="fire-icon" /> {c.flames}
                    </button>
                    {user?.id === c.user_id && (
                      <button className="delete-btn" onClick={() => handleDeleteComment(c.id, c.user_id)}>
                        <AiOutlineClose className="delete-icon" />
                      </button>
                    )}
                    <button className="reply-btn" onClick={() => setReplyingTo(c.id)}>
                      💬 Cavab yaz
                    </button>
                  </div>

                  {replyingTo === c.id && (
                    <div className="reply-input">
                      <textarea
                        placeholder="Cavabınızı yazın..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                      ></textarea>

                      <div className="spoiler-next">
                        <div className="spoiler-toggle">
                          <label>
                            <input
                              type="checkbox"
                              checked={isSpoiler}
                              onChange={() => setIsSpoiler(!isSpoiler)}
                            />
                            🤫
                          </label>
                          <button onClick={() => handleReply(c.id, newReply, isSpoiler)}><RiSendPlaneLine /></button>
                        </div>


                      </div>
                      <button onClick={() => setReplyingTo(null)} className="close-reply-btn"><GrFormClose /></button>
                    </div>
                  )}

                  {c.replies && c.replies.length > 0 && (
                    <div className="comment-replies">
                      {c.replies.map((reply) => (
                        <div key={reply.id} className="comment-item reply-item">
                          <div className="comment-header">
                            <div className="user-avatar">
                              <img src={reply.userProfileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBGcM6Pr04EvVjbkfVmNnXQoFHU_Y3NxbaNQ&s"} alt="Profil" />
                            </div>
                            <div className="user-info-c">
                              <span className="comment-author">{reply.username}</span>
                              <span className="comment-time"> 🕒 {formatDate(reply.timestamp)}</span>
                            </div>
                          </div>
                          <p className="comment-text">
                            {reply.isSpoiler && !reply.showSpoiler ? (
                              <span className="spoiler-warning" onClick={() =>
                                setComments(prev => prev.map(comment =>
                                  comment.id === c.id ? {
                                    ...comment,
                                    replies: comment.replies.map(r =>
                                      r.id === reply.id ? { ...r, showSpoiler: !r.showSpoiler } : r
                                    )
                                  } : comment
                                ))
                              }>
                                ⚠️ Bu cavab spoiler ehtiva edir! Açmaq üçün klikləyin.
                              </span>
                            ) : (
                              reply.comment
                            )}
                          </p>
                          {user?.id === reply.user_id && (
                            <button className="delete-btn" onClick={() => handleDeleteReply(c.id, reply.id, reply.user_id)}>
                              <AiOutlineClose className="delete-icon" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default Detail;

