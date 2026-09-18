"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { useParams } from "next/navigation";
import "./detail.css";
import { getFilms, updateFilm } from "@/app/redux/features/apiSlice/apiSlice";
import { FaFire } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { RiSendPlaneLine } from "react-icons/ri";
import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";
import Aside from "@/app/(pages)/admin/components/AsideLeft/AsideLeft";

const Detail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, error } = useSelector((state: RootState) => state.films);
  const params = useParams();
  const id = params.id as string;

  const [selectedComments, setSelectedComments] = useState<number[]>([]);

  const film = useMemo(
    () => data.find((film) => film.id.toString() === id),
    [data, id]
  );
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(film?.comments || []);
  const user = useSelector((state: RootState) => state.auth.user);
  const currentUser = user || { id: 99, username: "İstifadəçi" };
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newReply, setNewReply] = useState("");

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
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handleAddComment = () => {
    if (newComment.trim() && film) {
      const newEntry = {
        id: Date.now(),
        user_id: currentUser.id,
        username: currentUser.name,
        comment: newComment,
        flames: 0,
        users_who_liked: [],
        replies: [],
        timestamp: Date.now().toString(),
      };

      const updatedComments = [...comments, newEntry];
      setComments(updatedComments);
      dispatch(
        updateFilm({ id: film.id, data: { comments: updatedComments } })
      );

      setNewComment("");
    }
  };

  const handleLike = useCallback(
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
                ? comment.users_who_liked.filter(
                    (uid) => uid !== currentUser.id
                  )
                : [...comment.users_who_liked, currentUser.id],
            }
          : comment
      );

      setComments(updatedComments);
      dispatch(
        updateFilm({ id: film.id, data: { comments: updatedComments } })
      );
    },
    [film, comments, dispatch, currentUser]
  );
  const handleDeleteComment = (id: number) => {
    if (film) {
      const updatedComments = comments.filter((comment) => comment.id !== id);

      setComments(updatedComments);
      dispatch(
        updateFilm({ id: film.id, data: { comments: updatedComments } })
      );
    }
  };
  const handleReply = async (commentId: number, replyText: string) => {
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
                  username: currentUser.username,
                  comment: replyText,
                  timestamp: Date.now().toString(),
                },
              ],
            }
          : comment
      );

      setComments(updatedComments);
      await dispatch(
        updateFilm({ id: film.id, data: { comments: updatedComments } })
      );

      setNewReply("");
      setReplyingTo(null);
    }
  };

  const handleDeleteReply = async (commentId: number, replyId: number) => {
    if (film) {
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== replyId),
            }
          : comment
      );

      setComments(updatedComments);
      await dispatch(
        updateFilm({ id: film.id, data: { comments: updatedComments } })
      );
    }
  };

  if (error) return <div className="error">Xəta: {error}</div>;
  if (!film) return <div className="not-found">Film tapılmadı.</div>;

  return (
    <div className="layout">
      <Aside />
      <main className="detailBack">
        <section>
          <div className="fragAbout">
            <div className="fragTitle">
              <div className="titleF">
                <h2>{film.title}</h2>
              </div>
              <div className="imdb">
                <span>
                  IMDB <em>{film.imdb || "N/A"}</em>
                </span>
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
                <p>{film.description || "Məlumat yoxdur"}</p>
                <div className="about-film-info">
                  <p>
                    <span>Director:</span> {film.director || "Bilinmir"}
                  </p>
                  <p>
                    <span>Release Date:</span> {film.release_date || "Bilinmir"}
                  </p>
                  <p>
                    <span>Duration:</span> {film.duration || "Bilinmir"}
                  </p>
                  <p>
                    <span>Category:</span>{" "}
                    {film.category?.join(", ") || "Bilinmir"}
                  </p>
                  <p>
                    <span>Country:</span> {film.language || "Bilinmir"}
                  </p>
                  <p>
                    <span>Main Actors:</span>{" "}
                    {film.actors?.map((actor) => actor.name).join(", ") ||
                      "Bilinmir"}
                  </p>
                  <p>
                    <span>Production Company:</span>{" "}
                    {film.production_company || "Bilinmir"}
                  </p>
                  <p>
                    <span>IMDb Rating:</span> {film.imdb || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="fullmovie">
            <div className="fullTop">
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
          <h3>💬 Rəylər</h3>
          <div className="comment-input">
            <div className="textarea-container">
              <textarea
                placeholder="Rəyinizi yazın..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button onClick={handleAddComment}>
                <RiSendPlaneLine />
              </button>
            </div>
          </div>

          <div className="comment-actions-top">
            <button
              className="delete-all-btn"
              onClick={() => {
                setComments([]);
                dispatch(updateFilm({ id: film.id, data: { comments: [] } }));
              }}
            >
              🗑 Bütün rəyləri sil
            </button>

            <button
              className="delete-selected-btn"
              disabled={selectedComments.length === 0}
              onClick={() => {
                const updatedComments = comments.filter(
                  (c) => !selectedComments.includes(c.id)
                );
                setComments(updatedComments);
                dispatch(
                  updateFilm({
                    id: film.id,
                    data: { comments: updatedComments },
                  })
                );
                setSelectedComments([]);
              }}
            >
              🗑 Seçilən rəyləri sil
            </button>
          </div>

          <div className="comments-items">
            <div className="comments-list">
              {comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="comment-header">
                    <input
                      type="checkbox"
                      className="comment-checkbox"
                      checked={selectedComments.includes(c.id)}
                      onChange={() => {
                        setSelectedComments((prev) =>
                          prev.includes(c.id)
                            ? prev.filter((id) => id !== c.id)
                            : [...prev, c.id]
                        );
                      }}
                    />

                    <div className="user-avatar">
                      <img
                        src={
                          user?.profileImage ||
                          "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg"
                        }
                        alt=""
                      />
                    </div>

                    <div>
                      <span className="comment-author">
                        {c.username}{" "}
                        <span className="role-tag">({c.role})</span>
                      </span>
                      <span className="comment-time">
                        🕒 {formatDate(c.timestamp)}
                      </span>
                    </div>
                  </div>

                  <p className="comment-text">{c.comment}</p>

                  <div className="comment-actions">
                    <button
                      className="like-btn"
                      onClick={() => handleLike(c.id)}
                    >
                      <FaFire className="fire-icon" /> {c.flames}
                    </button>
                    <button
                      className="reply-btn"
                      onClick={() => setReplyingTo(c.id)}
                    >
                      💬 Cavab yaz
                    </button>
                    {user?.id === c.user_id && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        <AiOutlineClose className="delete-icon" />
                      </button>
                    )}
                  </div>

                  {c.replies && c.replies.length > 0 && (
                    <div className="comment-replies">
                      {c.replies.map((reply) => (
                        <div key={reply.id} className="comment-item reply-item">
                          <div className="comment-header">
                            <span className="comment-author">
                              {reply.username}
                            </span>
                            <span className="comment-time">
                              🕒 {formatDate(reply.timestamp)}
                            </span>
                          </div>
                          <p className="comment-text">{reply.comment}</p>
                          {reply.user_id === currentUser.id && (
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteReply(c.id, reply.id)}
                            >
                              <AiOutlineClose className="delete-icon" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {replyingTo === c.id && (
                    <div className="reply-input">
                      <textarea
                        placeholder="Cavabınızı yazın..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                      ></textarea>
                      <button
                        onClick={() => {
                          handleReply(c.id, newReply);
                          setNewReply("");
                          setReplyingTo(null);
                        }}
                      >
                        Göndər
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Detail;
