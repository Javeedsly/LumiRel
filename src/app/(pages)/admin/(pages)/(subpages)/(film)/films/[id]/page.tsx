"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { FaFire } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { RiSendPlaneLine } from "react-icons/ri";

import "./detail.css";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import {
  getFilms,
  updateFilm,
} from "@/app/redux/features/apiSlice/apiSlice";

import Aside from "@/app/(pages)/admin/components/AsideLeft/AsideLeft";

interface AuthUser {
  id?: number | string;
  username?: string;
  name?: string;
  profileImage?: string;
  role?: string;
}

interface CommentReply {
  id: number;
  user_id: number;
  username: string;
  comment: string;
  timestamp: string;
}

interface DetailComment {
  id: number;
  user_id: number;
  username: string;
  comment: string;
  flames: number;
  users_who_liked: number[];
  replies?: CommentReply[];
  timestamp?: string;
  role?: string;
}

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg";

const Detail = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const {
    data,
    error,
  } = useSelector(
    (state: RootState) =>
      state.films
  );

  const user = useSelector(
    (state: RootState) =>
      state.auth.user
  ) as AuthUser | null;

  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const film = useMemo(() => {
    return data.find(
      (item) =>
        String(item.id) ===
        String(id)
    );
  }, [data, id]);

  const currentUser = {
    id: Number(user?.id ?? 99),

    username:
      user?.username ??
      user?.name ??
      "İstifadəçi",

    profileImage:
      user?.profileImage ??
      DEFAULT_AVATAR,

    role:
      user?.role ??
      "User",
  };

  const [
    selectedComments,
    setSelectedComments,
  ] = useState<number[]>([]);

  const [
    newComment,
    setNewComment,
  ] = useState("");

  const [
    comments,
    setComments,
  ] = useState<
    DetailComment[]
  >([]);

  const [
    replyingTo,
    setReplyingTo,
  ] = useState<
    number | null
  >(null);

  const [
    newReply,
    setNewReply,
  ] = useState("");

  useEffect(() => {
    if (!data.length) {
      dispatch(getFilms());
    }
  }, [
    dispatch,
    data.length,
  ]);

  useEffect(() => {
    if (film) {
      setComments(
        (film.comments ??
          []) as DetailComment[]
      );
    }
  }, [film]);

  const formatDate = (
    timestamp?:
      | number
      | string
  ) => {
    if (!timestamp) {
      return "Tarix yoxdur";
    }

    const date = new Date(
      Number(timestamp)
    );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Tarix yoxdur";
    }

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const year =
      date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const saveComments = async (
    updatedComments:
      DetailComment[]
  ) => {
    if (!film) {
      return;
    }

    setComments(
      updatedComments
    );

    await dispatch(
      updateFilm({
        id: Number(
          film.id
        ),

        data: {
          comments:
            updatedComments,
        },
      })
    );
  };

  const handleAddComment =
    async () => {
      if (
        !film ||
        !newComment.trim()
      ) {
        return;
      }

      const newEntry: DetailComment =
        {
          id: Date.now(),

          user_id:
            currentUser.id,

          username:
            currentUser.username,

          comment:
            newComment.trim(),

          flames: 0,

          users_who_liked:
            [],

          replies: [],

          timestamp:
            Date.now().toString(),

          role:
            currentUser.role,
        };

      const updatedComments =
        [
          ...comments,
          newEntry,
        ];

      await saveComments(
        updatedComments
      );

      setNewComment("");
    };

  const handleLike = async (
    commentId: number
  ) => {
    if (!film) {
      return;
    }

    const updatedComments =
      comments.map(
        (comment) => {
          if (
            comment.id !==
            commentId
          ) {
            return comment;
          }

          const likedUsers =
            comment.users_who_liked ??
            [];

          const alreadyLiked =
            likedUsers.includes(
              currentUser.id
            );

          return {
            ...comment,

            flames:
              alreadyLiked
                ? Math.max(
                    0,
                    comment.flames -
                      1
                  )
                : comment.flames +
                  1,

            users_who_liked:
              alreadyLiked
                ? likedUsers.filter(
                    (
                      userId
                    ) =>
                      userId !==
                      currentUser.id
                  )
                : [
                    ...likedUsers,
                    currentUser.id,
                  ],
          };
        }
      );

    await saveComments(
      updatedComments
    );
  };

  const handleDeleteComment =
    async (
      commentId: number
    ) => {
      const updatedComments =
        comments.filter(
          (comment) =>
            comment.id !==
            commentId
        );

      await saveComments(
        updatedComments
      );

      setSelectedComments(
        (prev) =>
          prev.filter(
            (id) =>
              id !==
              commentId
          )
      );
    };

  const handleReply =
    async (
      commentId: number
    ) => {
      if (
        !newReply.trim() ||
        !film
      ) {
        return;
      }

      const reply: CommentReply =
        {
          id: Date.now(),

          user_id:
            currentUser.id,

          username:
            currentUser.username,

          comment:
            newReply.trim(),

          timestamp:
            Date.now().toString(),
        };

      const updatedComments =
        comments.map(
          (comment) =>
            comment.id ===
            commentId
              ? {
                  ...comment,

                  replies: [
                    ...(comment.replies ??
                      []),

                    reply,
                  ],
                }
              : comment
        );

      await saveComments(
        updatedComments
      );

      setNewReply("");
      setReplyingTo(null);
    };

  const handleDeleteReply =
    async (
      commentId: number,
      replyId: number
    ) => {
      const updatedComments =
        comments.map(
          (comment) =>
            comment.id ===
            commentId
              ? {
                  ...comment,

                  replies: (
                    comment.replies ??
                    []
                  ).filter(
                    (
                      reply
                    ) =>
                      reply.id !==
                      replyId
                  ),
                }
              : comment
        );

      await saveComments(
        updatedComments
      );
    };

  const handleDeleteAllComments =
    async () => {
      await saveComments([]);

      setSelectedComments(
        []
      );
    };

  const handleDeleteSelectedComments =
    async () => {
      if (
        selectedComments.length ===
        0
      ) {
        return;
      }

      const updatedComments =
        comments.filter(
          (comment) =>
            !selectedComments.includes(
              comment.id
            )
        );

      await saveComments(
        updatedComments
      );

      setSelectedComments(
        []
      );
    };

  const toggleCommentSelection =
    (
      commentId: number
    ) => {
      setSelectedComments(
        (prev) =>
          prev.includes(
            commentId
          )
            ? prev.filter(
                (id) =>
                  id !==
                  commentId
              )
            : [
                ...prev,
                commentId,
              ]
      );
    };

  if (error) {
    return (
      <div className="error">
        Xəta: {error}
      </div>
    );
  }

  if (!film) {
    return (
      <div className="not-found">
        Film tapılmadı.
      </div>
    );
  }

  return (
    <div className="layout">
      <Aside />

      <main className="detailBack">
        <section>
          <div className="fragAbout">
            <div className="fragTitle">
              <div className="titleF">
                <h2>
                  {
                    film.title
                  }
                </h2>
              </div>

              <div className="imdb">
                <span>
                  IMDB{" "}
                  <em>
                    {film.imdb ||
                      "N/A"}
                  </em>
                </span>
              </div>
            </div>

            <div className="trailer">
              <div className="fragman">
                <iframe
                  width="530"
                  height="600"
                  src={
                    film.trailer
                  }
                  title={`${film.title} trailer`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>

              <div className="about-film">
                <p>
                  {film.summary ||
                    "Məlumat yoxdur"}
                </p>

                <div className="about-film-info">
                  <p>
                    <span>
                      Director:
                    </span>{" "}
                    {film.director ||
                      "Bilinmir"}
                  </p>

                  <p>
                    <span>
                      Release Date:
                    </span>{" "}
                    {film.year ||
                      "Bilinmir"}
                  </p>

                  <p>
                    <span>
                      Duration:
                    </span>{" "}
                    {film.duration ||
                      "Bilinmir"}
                  </p>

                  <p>
                    <span>
                      Category:
                    </span>{" "}
                    {film.category
                      ?.join(", ") ||
                      "Bilinmir"}
                  </p>

                  <p>
                    <span>
                      Country:
                    </span>{" "}
                    {film.country ||
                      "Bilinmir"}
                  </p>

                  <p>
                    <span>
                      Language:
                    </span>{" "}
                    {film.language ||
                      "Bilinmir"}
                  </p>

                  <p>
                    <span>
                      Main Actors:
                    </span>{" "}
                    {film.actors
                      ?.map(
                        (
                          actor
                        ) =>
                          actor.name
                      )
                      .join(", ") ||
                      "Bilinmir"}
                  </p>

                  <p>
                    <span>
                      Production Company:
                    </span>{" "}
                    {film.production_company ||
                      "Bilinmir"}
                  </p>

                  <p>
                    <span>
                      IMDb Rating:
                    </span>{" "}
                    {film.imdb ||
                      "N/A"}
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
                src={
                  film.full_movie_link
                }
                title={`${film.title} full movie`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="comments">
          <h3>
            💬 Rəylər
          </h3>

          <div className="comment-input">
            <div className="textarea-container">
              <textarea
                placeholder="Rəyinizi yazın..."
                value={
                  newComment
                }
                onChange={(
                  e
                ) =>
                  setNewComment(
                    e.target
                      .value
                  )
                }
              />

              <button
                type="button"
                onClick={
                  handleAddComment
                }
              >
                <RiSendPlaneLine />
              </button>
            </div>
          </div>

          <div className="comment-actions-top">
            <button
              type="button"
              className="delete-all-btn"
              onClick={
                handleDeleteAllComments
              }
            >
              🗑 Bütün rəyləri
              sil
            </button>

            <button
              type="button"
              className="delete-selected-btn"
              disabled={
                selectedComments.length ===
                0
              }
              onClick={
                handleDeleteSelectedComments
              }
            >
              🗑 Seçilən
              rəyləri sil
            </button>
          </div>

          <div className="comments-items">
            <div className="comments-list">
              {comments.length >
              0 ? (
                comments.map(
                  (
                    comment
                  ) => (
                    <div
                      key={
                        comment.id
                      }
                      className="comment-item"
                    >
                      <div className="comment-header">
                        <input
                          type="checkbox"
                          className="comment-checkbox"
                          checked={selectedComments.includes(
                            comment.id
                          )}
                          onChange={() =>
                            toggleCommentSelection(
                              comment.id
                            )
                          }
                        />

                        <div className="user-avatar">
                          <img
                            src={
                              currentUser.profileImage
                            }
                            alt={
                              comment.username ||
                              "User"
                            }
                          />
                        </div>

                        <div>
                          <span className="comment-author">
                            {
                              comment.username
                            }

                            {comment.role && (
                              <span className="role-tag">
                                {" "}
                                (
                                {
                                  comment.role
                                }
                                )
                              </span>
                            )}
                          </span>

                          <span className="comment-time">
                            🕒{" "}
                            {formatDate(
                              comment.timestamp ??
                                comment.id
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="comment-text">
                        {
                          comment.comment
                        }
                      </p>

                      <div className="comment-actions">
                        <button
                          type="button"
                          className="like-btn"
                          onClick={() =>
                            handleLike(
                              comment.id
                            )
                          }
                        >
                          <FaFire className="fire-icon" />{" "}
                          {
                            comment.flames
                          }
                        </button>

                        <button
                          type="button"
                          className="reply-btn"
                          onClick={() =>
                            setReplyingTo(
                              comment.id
                            )
                          }
                        >
                          💬 Cavab
                          yaz
                        </button>

                        {currentUser.id ===
                          Number(
                            comment.user_id
                          ) && (
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteComment(
                                comment.id
                              )
                            }
                          >
                            <AiOutlineClose className="delete-icon" />
                          </button>
                        )}
                      </div>

                      {(comment
                        .replies
                        ?.length ??
                        0) >
                        0 && (
                        <div className="comment-replies">
                          {(
                            comment.replies ??
                            []
                          ).map(
                            (
                              reply
                            ) => (
                              <div
                                key={
                                  reply.id
                                }
                                className="comment-item reply-item"
                              >
                                <div className="comment-header">
                                  <span className="comment-author">
                                    {
                                      reply.username
                                    }
                                  </span>

                                  <span className="comment-time">
                                    🕒{" "}
                                    {formatDate(
                                      reply.timestamp
                                    )}
                                  </span>
                                </div>

                                <p className="comment-text">
                                  {
                                    reply.comment
                                  }
                                </p>

                                {currentUser.id ===
                                  Number(
                                    reply.user_id
                                  ) && (
                                  <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                      handleDeleteReply(
                                        comment.id,
                                        reply.id
                                      )
                                    }
                                  >
                                    <AiOutlineClose className="delete-icon" />
                                  </button>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {replyingTo ===
                        comment.id && (
                        <div className="reply-input">
                          <textarea
                            placeholder="Cavabınızı yazın..."
                            value={
                              newReply
                            }
                            onChange={(
                              e
                            ) =>
                              setNewReply(
                                e
                                  .target
                                  .value
                              )
                            }
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleReply(
                                comment.id
                              )
                            }
                          >
                            Göndər
                          </button>
                        </div>
                      )}
                    </div>
                  )
                )
              ) : (
                <p>
                  Hələ rəy
                  yoxdur.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Detail;