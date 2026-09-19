"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useParams,
} from "next/navigation";

import {
  motion,
} from "framer-motion";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  AiOutlineClose,
} from "react-icons/ai";

import {
  FaFire,
  FaPlay,
  FaStar,
} from "react-icons/fa";

import {
  GrFormClose,
} from "react-icons/gr";

import {
  RiSendPlaneLine,
} from "react-icons/ri";

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import {
  getFilms,
  updateFilm,
} from "@/app/redux/features/apiSlice/apiSlice";

import type {
  Comment as FilmComment,
  CommentReply,
} from "@/app/redux/features/apiSlice/apiSlice";

import "./detail.css";

interface DetailReply
  extends CommentReply {
  userProfileImage?: string;
  isSpoiler?: boolean;
  showSpoiler?: boolean;
}

interface DetailComment
  extends Omit<
    FilmComment,
    "replies"
  > {
  userProfileImage?: string;
  isSpoiler?: boolean;
  showSpoiler?: boolean;
  replies?: DetailReply[];
}

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg";

const normalizeComments = (
  source:
    | FilmComment[]
    | undefined
): DetailComment[] =>
  (
    source ??
    []
  ).map(
    (
      comment
    ) => ({
      ...comment,

      isSpoiler:
        (
          comment as
            DetailComment
        ).isSpoiler ??
        false,

      showSpoiler:
        (
          comment as
            DetailComment
        ).showSpoiler ??
        false,

      replies:
        (
          comment.replies ??
          []
        ).map(
          (
            reply
          ) => ({
            ...reply,

            isSpoiler:
              (
                reply as
                  DetailReply
              )
                .isSpoiler ??
              false,

            showSpoiler:
              (
                reply as
                  DetailReply
              )
                .showSpoiler ??
              false,
          })
        ),
    })
  );

const Detail = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const router =
    useRouter();

  const params =
    useParams();

  const {
    data,
    error,
    loading,
  } =
    useSelector(
      (
        state:
          RootState
      ) =>
        state.films
    );

  const user =
    useSelector(
      (
        state:
          RootState
      ) =>
        state.auth
          .user
    );

  const rawId =
    params?.id;

  const id =
    Array.isArray(
      rawId
    )
      ? rawId[0] ??
        ""
      : typeof rawId ===
          "string"
        ? rawId
        : "";

  const film =
    useMemo(
      () =>
        data.find(
          (
            item
          ) =>
            String(
              item.id
            ) ===
            String(
              id
            )
        ),
      [
        data,
        id,
      ]
    );

  const [
    comments,
    setComments,
  ] =
    useState<
      DetailComment[]
    >([]);

  const [
    newComment,
    setNewComment,
  ] =
    useState("");

  const [
    replyingTo,
    setReplyingTo,
  ] =
    useState<
      number | null
    >(null);

  const [
    newReply,
    setNewReply,
  ] =
    useState("");

  const [
    commentSpoiler,
    setCommentSpoiler,
  ] =
    useState(false);

  const [
    replySpoiler,
    setReplySpoiler,
  ] =
    useState(false);

  useEffect(() => {
    if (
      data.length ===
      0
    ) {
      dispatch(
        getFilms()
      );
    }
  }, [
    dispatch,
    data.length,
  ]);

  useEffect(() => {
    if (film) {
      setComments(
        normalizeComments(
          film.comments
        )
      );
    }
  }, [film]);

  const userId =
    user
      ? Number(
          user.id
        )
      : null;

  const validUserId =
    userId !==
      null &&
    Number.isFinite(
      userId
    )
      ? userId
      : null;

  const userName =
    user
      ? [
          user.name,
          user.surname,
        ]
          .filter(
            Boolean
          )
          .join(" ")
          .trim() ||
        user.username ||
        "LumiReel User"
      : "";

  const userImage =
    user?.profileImage ||
    DEFAULT_AVATAR;

  const requireLogin =
    () => {
      router.push(
        "/main/auth/login"
      );
    };

  const formatDate = (
    timestamp?:
      string
  ) => {
    if (!timestamp) {
      return "";
    }

    const parsed =
      Number(
        timestamp
      );

    const date =
      Number.isNaN(
        parsed
      )
        ? new Date(
            timestamp
          )
        : new Date(
            parsed
          );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleDateString(
      "az-AZ",
      {
        day:
          "2-digit",

        month:
          "2-digit",

        year:
          "numeric",
      }
    );
  };

  const saveComments =
    useCallback(
      async (
        nextComments:
          DetailComment[]
      ) => {
        if (!film) {
          return;
        }

        await dispatch(
          updateFilm({
            id:
              film.id,

            data: {
              comments:
                nextComments,
            },
          })
        ).unwrap();
      },
      [
        dispatch,
        film,
      ]
    );

  const handleAddComment =
    async () => {
      if (!user) {
        requireLogin();
        return;
      }

      if (
        !film ||
        !newComment.trim() ||
        validUserId ===
          null
      ) {
        return;
      }

      const previous =
        comments;

      const entry:
        DetailComment =
        {
          id:
            Date.now(),

          user_id:
            validUserId,

          username:
            userName,

          userProfileImage:
            userImage,

          comment:
            newComment.trim(),

          flames: 0,

          users_who_liked:
            [],

          replies: [],

          timestamp:
            Date.now().toString(),

          isSpoiler:
            commentSpoiler,

          showSpoiler:
            false,
        };

      const next = [
        ...comments,
        entry,
      ];

      setComments(
        next
      );

      setNewComment(
        ""
      );

      setCommentSpoiler(
        false
      );

      try {
        await saveComments(
          next
        );
      } catch (
        saveError
      ) {
        console.error(
          "Comment save error:",
          saveError
        );

        setComments(
          previous
        );
      }
    };

  const handleLike =
    async (
      commentId:
        number
    ) => {
      if (!user) {
        requireLogin();
        return;
      }

      if (
        validUserId ===
        null
      ) {
        return;
      }

      const previous =
        comments;

      const next =
        comments.map(
          (
            comment
          ) => {
            if (
              comment.id !==
              commentId
            ) {
              return comment;
            }

            const liked =
              comment.users_who_liked ??
              [];

            const exists =
              liked.includes(
                validUserId
              );

            return {
              ...comment,

              flames:
                exists
                  ? Math.max(
                      0,
                      comment.flames -
                        1
                    )
                  : comment.flames +
                    1,

              users_who_liked:
                exists
                  ? liked.filter(
                      (
                        id
                      ) =>
                        id !==
                        validUserId
                    )
                  : [
                      ...liked,
                      validUserId,
                    ],
            };
          }
        );

      setComments(
        next
      );

      try {
        await saveComments(
          next
        );
      } catch (
        saveError
      ) {
        console.error(
          "Like error:",
          saveError
        );

        setComments(
          previous
        );
      }
    };

  const handleDeleteComment =
    async (
      commentId:
        number
    ) => {
      if (
        validUserId ===
        null
      ) {
        return;
      }

      const target =
        comments.find(
          (
            comment
          ) =>
            comment.id ===
            commentId
        );

      if (
        !target ||
        target.user_id !==
          validUserId
      ) {
        return;
      }

      const previous =
        comments;

      const next =
        comments.filter(
          (
            comment
          ) =>
            comment.id !==
            commentId
        );

      setComments(
        next
      );

      try {
        await saveComments(
          next
        );
      } catch {
        setComments(
          previous
        );
      }
    };

  const handleReply =
    async (
      commentId:
        number
    ) => {
      if (!user) {
        requireLogin();
        return;
      }

      if (
        validUserId ===
          null ||
        !newReply.trim()
      ) {
        return;
      }

      const previous =
        comments;

      const reply:
        DetailReply =
        {
          id:
            Date.now(),

          user_id:
            validUserId,

          username:
            userName,

          userProfileImage:
            userImage,

          comment:
            newReply.trim(),

          timestamp:
            Date.now().toString(),

          isSpoiler:
            replySpoiler,

          showSpoiler:
            false,
        };

      const next =
        comments.map(
          (
            comment
          ) =>
            comment.id ===
            commentId
              ? {
                  ...comment,

                  replies: [
                    ...(
                      comment.replies ??
                      []
                    ),

                    reply,
                  ],
                }
              : comment
        );

      setComments(
        next
      );

      setNewReply(
        ""
      );

      setReplySpoiler(
        false
      );

      setReplyingTo(
        null
      );

      try {
        await saveComments(
          next
        );
      } catch {
        setComments(
          previous
        );
      }
    };

  const handleDeleteReply =
    async (
      commentId:
        number,

      replyId:
        number
    ) => {
      if (
        validUserId ===
        null
      ) {
        return;
      }

      const comment =
        comments.find(
          (
            item
          ) =>
            item.id ===
            commentId
        );

      const reply =
        comment?.replies?.find(
          (
            item
          ) =>
            item.id ===
            replyId
        );

      if (
        !reply ||
        reply.user_id !==
          validUserId
      ) {
        return;
      }

      const previous =
        comments;

      const next =
        comments.map(
          (
            item
          ) =>
            item.id ===
            commentId
              ? {
                  ...item,

                  replies:
                    (
                      item.replies ??
                      []
                    ).filter(
                      (
                        currentReply
                      ) =>
                        currentReply.id !==
                        replyId
                    ),
                }
              : item
        );

      setComments(
        next
      );

      try {
        await saveComments(
          next
        );
      } catch {
        setComments(
          previous
        );
      }
    };

  const showCommentSpoiler =
    (
      commentId:
        number
    ) => {
      setComments(
        (
          previous
        ) =>
          previous.map(
            (
              comment
            ) =>
              comment.id ===
              commentId
                ? {
                    ...comment,
                    showSpoiler:
                      true,
                  }
                : comment
          )
      );
    };

  const toggleReplySpoiler =
    (
      commentId:
        number,

      replyId:
        number
    ) => {
      setComments(
        (
          previous
        ) =>
          previous.map(
            (
              comment
            ) =>
              comment.id ===
              commentId
                ? {
                    ...comment,

                    replies:
                      (
                        comment.replies ??
                        []
                      ).map(
                        (
                          reply
                        ) =>
                          reply.id ===
                          replyId
                            ? {
                                ...reply,

                                showSpoiler:
                                  !reply.showSpoiler,
                              }
                            : reply
                      ),
                  }
                : comment
          )
      );
    };

  if (
    loading &&
    !film
  ) {
    return (
      <div className="detail-state">
        Loading movie...
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-state detail-state--error">
        {error}
      </div>
    );
  }

  if (!film) {
    return (
      <div className="detail-state">
        Film tapılmadı.
      </div>
    );
  }

  return (
    <main className="detailBack">
      <motion.section
        className="movie-hero"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration:
            0.6,
        }}
      >
        <div
          className="movie-hero-bg"
          style={{
            backgroundImage:
              `url(${film.poster})`,
          }}
        />

        <div className="movie-hero-overlay" />

        <div className="movie-hero-content">
          <div className="movie-poster-wrap">
            <img
              src={
                film.poster
              }
              alt={
                film.title
              }
              className="movie-poster"
            />
          </div>

          <div className="movie-copy">
            <div className="movie-kicker">
              <FaPlay />

              Now on
              LumiReel
            </div>

            <h1>
              {
                film.title
              }
            </h1>

            <div className="movie-meta">
              <span className="movie-imdb">
                <FaStar />

                {film.imdb ||
                  "N/A"}
              </span>

              <span>
                {
                  film.year
                }
              </span>

              <span>
                {
                  film.duration
                }
              </span>

              <span>
                {
                  film.language
                }
              </span>
            </div>

            <div className="movie-categories">
              {film.category.map(
                (
                  category
                ) => (
                  <span
                    key={
                      category
                    }
                  >
                    {
                      category
                    }
                  </span>
                )
              )}
            </div>

            <p className="movie-summary">
              {
                film.summary
              }
            </p>

            <div className="movie-facts">
              <p>
                <strong>
                  Director
                </strong>

                {
                  film.director
                }
              </p>

              <p>
                <strong>
                  Country
                </strong>

                {
                  film.country
                }
              </p>

              <p>
                <strong>
                  Studio
                </strong>

                {
                  film.production_company
                }
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {film.trailer && (
        <motion.section
          className="detail-section"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >
          <div className="detail-section-heading">
            <div>
              <span>
                Preview
              </span>

              <h2>
                Official
                Trailer
              </h2>
            </div>
          </div>

          <div className="video-shell">
            <iframe
              src={
                film.trailer
              }
              title={`${film.title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.section>
      )}

      <motion.section
        className="detail-section"
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
      >
        <div className="detail-section-heading">
          <div>
            <span>
              Full access
            </span>

            <h2>
              Watch Movie
            </h2>
          </div>
        </div>

        <div className="fullmovie">
          <div className="fullTop">
            <iframe
              src={
                film.full_movie_link
              }
              title={`${film.title} movie`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        className="comments"
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
      >
        <div className="comments-heading">
          <div>
            <span>
              Community
            </span>

            <h2>
              Discussion
            </h2>
          </div>

          <small>
            {comments.length}{" "}
            comments
          </small>
        </div>

        {!user ? (
          <div className="comment-login-box">
            <p>
              Filmə baxmaq
              pulsuzdur.
              Şərh yazmaq və
              like etmək üçün
              hesabınıza daxil
              olun.
            </p>

            <Link
              href="/main/auth/login"
              className="comment-login-button"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <div className="comment-input">
            <div className="textarea-container">
              <textarea
                placeholder="Filmlə bağlı fikrinizi yazın..."
                value={
                  newComment
                }
                onChange={(
                  event
                ) =>
                  setNewComment(
                    event
                      .target
                      .value
                  )
                }
              />

              <div className="comment-composer-actions">
                <label className="spoiler-check">
                  <input
                    type="checkbox"
                    checked={
                      commentSpoiler
                    }
                    onChange={() =>
                      setCommentSpoiler(
                        (
                          previous
                        ) =>
                          !previous
                      )
                    }
                  />

                  Spoiler
                </label>

                <button
                  type="button"
                  className="send-button"
                  disabled={
                    !newComment.trim()
                  }
                  onClick={
                    handleAddComment
                  }
                >
                  <RiSendPlaneLine />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="comments-list">
          {comments.length ===
          0 ? (
            <div className="comments-empty">
              Hələ şərh
              yoxdur. İlk
              fikri sən
              paylaş.
            </div>
          ) : (
            comments.map(
              (
                comment
              ) => (
                <article
                  key={
                    comment.id
                  }
                  className="comment-item"
                >
                  <div className="comment-header">
                    <img
                      src={
                        comment.userProfileImage ||
                        DEFAULT_AVATAR
                      }
                      alt=""
                    />

                    <div>
                      <strong>
                        {
                          comment.username
                        }
                      </strong>

                      <span>
                        {
                          formatDate(
                            comment.timestamp
                          )
                        }
                      </span>
                    </div>

                    {validUserId ===
                      comment.user_id && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteComment(
                            comment.id
                          )
                        }
                      >
                        <AiOutlineClose />
                      </button>
                    )}
                  </div>

                  <div className="comment-text">
                    {comment.isSpoiler &&
                    !comment.showSpoiler ? (
                      <button
                        type="button"
                        className="spoiler-warning"
                        onClick={() =>
                          showCommentSpoiler(
                            comment.id
                          )
                        }
                      >
                        ⚠️ Spoiler.
                        Göstərmək üçün
                        kliklə.
                      </button>
                    ) : (
                      comment.comment
                    )}
                  </div>

                  <div className="comment-actions">
                    <button
                      type="button"
                      onClick={() =>
                        handleLike(
                          comment.id
                        )
                      }
                    >
                      <FaFire />

                      {
                        comment.flames
                      }
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          requireLogin();
                          return;
                        }

                        setReplyingTo(
                          comment.id
                        );
                      }}
                    >
                      Reply
                    </button>
                  </div>

                  {replyingTo ===
                    comment.id && (
                    <div className="reply-input">
                      <textarea
                        placeholder="Cavab yaz..."
                        value={
                          newReply
                        }
                        onChange={(
                          event
                        ) =>
                          setNewReply(
                            event
                              .target
                              .value
                          )
                        }
                      />

                      <div className="reply-actions">
                        <label className="spoiler-check">
                          <input
                            type="checkbox"
                            checked={
                              replySpoiler
                            }
                            onChange={() =>
                              setReplySpoiler(
                                (
                                  previous
                                ) =>
                                  !previous
                              )
                            }
                          />

                          Spoiler
                        </label>

                        <button
                          type="button"
                          className="send-button"
                          onClick={() =>
                            handleReply(
                              comment.id
                            )
                          }
                        >
                          <RiSendPlaneLine />
                        </button>

                        <button
                          type="button"
                          className="close-reply-btn"
                          onClick={() => {
                            setReplyingTo(
                              null
                            );

                            setNewReply(
                              ""
                            );

                            setReplySpoiler(
                              false
                            );
                          }}
                        >
                          <GrFormClose />
                        </button>
                      </div>
                    </div>
                  )}

                  {comment.replies &&
                    comment.replies.length >
                      0 && (
                      <div className="comment-replies">
                        {comment.replies.map(
                          (
                            reply
                          ) => (
                            <article
                              key={
                                reply.id
                              }
                              className="reply-item"
                            >
                              <div className="comment-header">
                                <img
                                  src={
                                    reply.userProfileImage ||
                                    DEFAULT_AVATAR
                                  }
                                  alt=""
                                />

                                <div>
                                  <strong>
                                    {
                                      reply.username
                                    }
                                  </strong>

                                  <span>
                                    {
                                      formatDate(
                                        reply.timestamp
                                      )
                                    }
                                  </span>
                                </div>

                                {validUserId ===
                                  reply.user_id && (
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
                                    <AiOutlineClose />
                                  </button>
                                )}
                              </div>

                              <div className="comment-text">
                                {reply.isSpoiler &&
                                !reply.showSpoiler ? (
                                  <button
                                    type="button"
                                    className="spoiler-warning"
                                    onClick={() =>
                                      toggleReplySpoiler(
                                        comment.id,
                                        reply.id
                                      )
                                    }
                                  >
                                    ⚠️ Spoiler.
                                    Açmaq üçün
                                    kliklə.
                                  </button>
                                ) : (
                                  reply.comment
                                )}
                              </div>
                            </article>
                          )
                        )}
                      </div>
                    )}
                </article>
              )
            )
          )}
        </div>
      </motion.section>
    </main>
  );
};

export default Detail;