"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useParams,
} from "next/navigation";

import {
  FaFire,
} from "react-icons/fa";

import {
  AiOutlineClose,
} from "react-icons/ai";

import {
  RiSendPlaneLine,
} from "react-icons/ri";

import {
  GrFormClose,
} from "react-icons/gr";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import {
  getFilms,
  updateFilm,
} from "@/app/redux/features/apiSlice/apiSlice";

import type {
  Comment as FilmComment,
  CommentReply,
} from "@/app/redux/features/apiSlice/apiSlice";

import ProtectedRoute from "@/app/Components/ProtectedRoute/ProtectedRoute";

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
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBGcM6Pr04EvVjbkfVmNnXQoFHU_Y3NxbaNQ&s";

const normalizeComments = (
  source:
    | FilmComment[]
    | undefined
): DetailComment[] => {
  return (
    source ?? []
  ).map(
    (comment) => {
      const detailComment =
        comment as DetailComment;

      return {
        ...detailComment,

        isSpoiler:
          detailComment.isSpoiler ??
          false,

        showSpoiler:
          detailComment.showSpoiler ??
          false,

        replies:
          (
            detailComment.replies ??
            []
          ).map(
            (reply) => ({
              ...reply,

              isSpoiler:
                reply.isSpoiler ??
                false,

              showSpoiler:
                reply.showSpoiler ??
                false,
            })
          ),
      };
    }
  );
};

const getNumericUserId = (
  value:
    | string
    | number
    | undefined
): number | null => {
  if (
    value === undefined
  ) {
    return null;
  }

  const parsed =
    Number(value);

  return Number.isFinite(
    parsed
  )
    ? parsed
    : null;
};

const Detail = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const {
    data,
    error,
    loading,
  } = useSelector(
    (state: RootState) =>
      state.films
  );

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    );

  const params =
    useParams();

  const rawId =
    params?.id;

  const id =
    Array.isArray(rawId)
      ? rawId[0] ?? ""
      : typeof rawId ===
          "string"
        ? rawId
        : "";

  const film =
    useMemo(
      () =>
        data.find(
          (item) =>
            String(
              item.id
            ) === id
        ),
      [
        data,
        id,
      ]
    );

  const [
    newComment,
    setNewComment,
  ] = useState("");

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
  ] = useState("");

  const [
    isSpoiler,
    setIsSpoiler,
  ] = useState(false);

  const [
    comments,
    setComments,
  ] =
    useState<
      DetailComment[]
    >([]);

  const loggedInUserId =
    getNumericUserId(
      user?.id
    );

  const currentUserId =
    loggedInUserId ??
    99;

  const currentUserName =
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
        "İstifadəçi"
      : "İstifadəçi";

  const currentUserImage =
    user?.profileImage ||
    "/default-avatar.jpg";

 

  useEffect(() => {
    if (
      data.length === 0
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

  const formatDate = (
    timestamp:
      | number
      | string
      | undefined
  ): string => {
    if (
      timestamp ===
        undefined ||
      timestamp === ""
    ) {
      return "Tarix yoxdur";
    }

    const numericTimestamp =
      Number(timestamp);

    const date =
      Number.isNaN(
        numericTimestamp
      )
        ? new Date(
            timestamp
          )
        : new Date(
            numericTimestamp
          );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Tarix yoxdur";
    }

    const day =
      date
        .getDate()
        .toString()
        .padStart(
          2,
          "0"
        );

    const month =
      (
        date.getMonth() +
        1
      )
        .toString()
        .padStart(
          2,
          "0"
        );

    const year =
      date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const saveComments =
    useCallback(
      async (
        updatedComments:
          DetailComment[]
      ) => {
        if (!film) {
          return;
        }

        await dispatch(
          updateFilm({
            id: film.id,

            data: {
              comments:
                updatedComments,
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
      if (
        !film ||
        !newComment.trim()
      ) {
        return;
      }

      const newEntry:
        DetailComment = {
        id:
          Date.now(),

        user_id:
          currentUserId,

        username:
          currentUserName,

        userProfileImage:
          currentUserImage,

        comment:
          newComment.trim(),

        flames:
          0,

        users_who_liked:
          [],

        replies:
          [],

        timestamp:
          Date.now().toString(),

        isSpoiler,

        showSpoiler:
          false,
      };

      const updatedComments =
        [
          ...comments,
          newEntry,
        ];

      setComments(
        updatedComments
      );

      try {
        await saveComments(
          updatedComments
        );

        setNewComment(
          ""
        );

        setIsSpoiler(
          false
        );
      } catch (saveError) {
        console.error(
          "Comment save error:",
          saveError
        );

        setComments(
          comments
        );
      }
    };

  const handleLike =
    async (
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
                currentUserId
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
                        currentUserId
                    )
                  : [
                      ...likedUsers,
                      currentUserId,
                    ],
            };
          }
        );

      setComments(
        updatedComments
      );

      try {
        await saveComments(
          updatedComments
        );
      } catch (saveError) {
        console.error(
          "Like update error:",
          saveError
        );

        setComments(
          comments
        );
      }
    };

  const handleDeleteComment =
    async (
      commentId: number,
      commentUserId: number
    ) => {
      if (
        !film ||
        loggedInUserId ===
          null ||
        loggedInUserId !==
          commentUserId
      ) {
        return;
      }

      const updatedComments =
        comments.filter(
          (comment) =>
            comment.id !==
            commentId
        );

      setComments(
        updatedComments
      );

      try {
        await saveComments(
          updatedComments
        );
      } catch (saveError) {
        console.error(
          "Comment delete error:",
          saveError
        );

        setComments(
          comments
        );
      }
    };

  const handleReply =
    async (
      commentId: number,
      replyText: string,
      replyIsSpoiler: boolean
    ) => {
      if (
        !film ||
        !replyText.trim()
      ) {
        return;
      }

      const newReplyEntry:
        DetailReply = {
        id:
          Date.now(),

        user_id:
          currentUserId,

        username:
          currentUserName,

        userProfileImage:
          currentUserImage,

        comment:
          replyText.trim(),

        timestamp:
          Date.now().toString(),

        isSpoiler:
          replyIsSpoiler,

        showSpoiler:
          false,
      };

      const updatedComments =
        comments.map(
          (comment) =>
            comment.id ===
            commentId
              ? {
                  ...comment,

                  replies:
                    [
                      ...(
                        comment.replies ??
                        []
                      ),

                      newReplyEntry,
                    ],
                }
              : comment
        );

      setComments(
        updatedComments
      );

      try {
        await saveComments(
          updatedComments
        );

        setNewReply(
          ""
        );

        setReplyingTo(
          null
        );

        setIsSpoiler(
          false
        );
      } catch (saveError) {
        console.error(
          "Reply save error:",
          saveError
        );

        setComments(
          comments
        );
      }
    };

  const handleDeleteReply =
    async (
      commentId: number,
      replyId: number,
      replyUserId: number
    ) => {
      if (
        !film ||
        loggedInUserId ===
          null ||
        loggedInUserId !==
          replyUserId
      ) {
        return;
      }

      const updatedComments =
        comments.map(
          (comment) =>
            comment.id ===
            commentId
              ? {
                  ...comment,

                  replies:
                    (
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

      setComments(
        updatedComments
      );

      try {
        await saveComments(
          updatedComments
        );
      } catch (saveError) {
        console.error(
          "Reply delete error:",
          saveError
        );

        setComments(
          comments
        );
      }
    };

  const showCommentSpoiler =
    (
      commentId: number
    ) => {
      setComments(
        (
          previousComments
        ) =>
          previousComments.map(
            (comment) =>
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
      commentId: number,
      replyId: number
    ) => {
      setComments(
        (
          previousComments
        ) =>
          previousComments.map(
            (comment) =>
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
      <div className="not-found">
        Yüklənir...
      </div>
    );
  }

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
    <ProtectedRoute>
      <main className="detailBack">
        <section>
          <div className="fragAbout">
            <div className="fragTitle">
              <div className="titleF">
                <h2>
                  {film.title}
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
                title={`${film.title} movie`}
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
            💬 Comments
          </h3>

          <div className="comment-input">
            <div className="textarea-container">
              <textarea
                placeholder="Rəyinizi yazın..."
                value={
                  newComment
                }
                onChange={(
                  event
                ) =>
                  setNewComment(
                    event.target
                      .value
                  )
                }
              />

              <div className="spoiler-toggle">
                <label>
                  <input
                    type="checkbox"
                    checked={
                      isSpoiler
                    }
                    onChange={() =>
                      setIsSpoiler(
                        (
                          previous
                        ) =>
                          !previous
                      )
                    }
                  />

                  🤫
                </label>

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
          </div>

          <div className="comments-items">
            <div className="comments-list">
              {comments.map(
                (comment) => (
                  <div
                    key={
                      comment.id
                    }
                    className="comment-item"
                  >
                    <div className="comment-header">
                      <div className="user-avatar">
                        <img
                          src={
                            comment.userProfileImage ||
                            DEFAULT_AVATAR
                          }
                          alt="Profil"
                        />
                      </div>

                      <div>
                        <div className="user-info-c">
                          <span className="comment-author">
                            {comment.username ||
                              "İstifadəçi"}
                          </span>

                          <span className="comment-time">
                            {" "}
                            🕒{" "}
                            {formatDate(
                              comment.timestamp
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="comment-text">
                      {comment.isSpoiler &&
                      !comment.showSpoiler ? (
                        <span
                          className="spoiler-warning"
                          onClick={() =>
                            showCommentSpoiler(
                              comment.id
                            )
                          }
                        >
                          ⚠️ Bu şərh
                          spoiler ehtiva
                          edir! Açmaq üçün
                          klikləyin.
                        </span>
                      ) : (
                        comment.comment
                      )}
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

                      {loggedInUserId ===
                        comment.user_id && (
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteComment(
                              comment.id,
                              comment.user_id
                            )
                          }
                        >
                          <AiOutlineClose className="delete-icon" />
                        </button>
                      )}

                      <button
                        type="button"
                        className="reply-btn"
                        onClick={() =>
                          setReplyingTo(
                            comment.id
                          )
                        }
                      >
                        💬 Cavab yaz
                      </button>
                    </div>

                    {replyingTo ===
                      comment.id && (
                      <div className="reply-input">
                        <textarea
                          placeholder="Cavabınızı yazın..."
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

                        <div className="spoiler-next">
                          <div className="spoiler-toggle">
                            <label>
                              <input
                                type="checkbox"
                                checked={
                                  isSpoiler
                                }
                                onChange={() =>
                                  setIsSpoiler(
                                    (
                                      previous
                                    ) =>
                                      !previous
                                  )
                                }
                              />

                              🤫
                            </label>

                            <button
                              type="button"
                              onClick={() =>
                                handleReply(
                                  comment.id,
                                  newReply,
                                  isSpoiler
                                )
                              }
                            >
                              <RiSendPlaneLine />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setReplyingTo(
                              null
                            )
                          }
                          className="close-reply-btn"
                        >
                          <GrFormClose />
                        </button>
                      </div>
                    )}

                    {comment.replies &&
                      comment
                        .replies
                        .length >
                        0 && (
                        <div className="comment-replies">
                          {comment.replies.map(
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
                                  <div className="user-avatar">
                                    <img
                                      src={
                                        reply.userProfileImage ||
                                        DEFAULT_AVATAR
                                      }
                                      alt="Profil"
                                    />
                                  </div>

                                  <div className="user-info-c">
                                    <span className="comment-author">
                                      {reply.username ||
                                        "İstifadəçi"}
                                    </span>

                                    <span className="comment-time">
                                      {" "}
                                      🕒{" "}
                                      {formatDate(
                                        reply.timestamp
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <p className="comment-text">
                                  {reply.isSpoiler &&
                                  !reply.showSpoiler ? (
                                    <span
                                      className="spoiler-warning"
                                      onClick={() =>
                                        toggleReplySpoiler(
                                          comment.id,
                                          reply.id
                                        )
                                      }
                                    >
                                      ⚠️ Bu cavab
                                      spoiler
                                      ehtiva edir!
                                      Açmaq üçün
                                      klikləyin.
                                    </span>
                                  ) : (
                                    reply.comment
                                  )}
                                </p>

                                {loggedInUserId ===
                                  reply.user_id && (
                                  <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                      handleDeleteReply(
                                        comment.id,
                                        reply.id,
                                        reply.user_id
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
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default Detail;