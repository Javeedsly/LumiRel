import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_URL =
  "https://679ba82733d316846324a9d2.mockapi.io/movies";

export interface CommentReply {
  id: number;
  user_id: number;
  username: string;
  comment: string;
  timestamp?: string;
}

export interface Comment {
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

export interface Actor {
  name: string;
  image: string;
}

export interface Film {
  id: string;

  title: string;
  year: string;

  poster: string;
  trailer: string;
  full_movie_link: string;

  genre: string;
  popular: boolean;

  imdb: string;

  director: string;
  production_company: string;

  duration: string;
  rating: string;

  language: string;
  country: string;

  summary: string;

  category: string[];
  watch_with: string[];
  subtitles: string[];

  actors: Actor[];

  deleted: boolean;
  drafts: boolean;

  comments: Comment[];

  favorites: number;

  createdAt: string;
  updatedAt: string;
}

interface FilmsState {
  data: Film[];

  uniqueCategories: string[];
  uniqueGenres: string[];

  loading: boolean;

  error: string | null;
}

const initialState: FilmsState = {
  data: [],

  uniqueCategories: [],
  uniqueGenres: [],

  loading: false,

  error: null,
};

export const getFilms =
  createAsyncThunk<Film[]>(
    "films/getFilms",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axios.get<
            Film[]
          >(API_URL);

        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data ??
            error?.message ??
            "Films could not be loaded"
        );
      }
    }
  );

export const postFilm =
  createAsyncThunk<
    Film,
    Film
  >(
    "films/postFilm",

    async (
      film,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axios.post<
            Film
          >(
            API_URL,
            film
          );

        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data ??
            error?.message ??
            "Film could not be added"
        );
      }
    }
  );

export const deleteFilm =
  createAsyncThunk<
    string,
    string | number
  >(
    "films/deleteFilm",

    async (
      id,
      {
        rejectWithValue,
      }
    ) => {
      try {
        await axios.delete(
          `${API_URL}/${id}`
        );

        return String(id);
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data ??
            error?.message ??
            "Film could not be deleted"
        );
      }
    }
  );

export const updateFilm =
  createAsyncThunk<
    Film,
    {
      id: string | number;
      data: Partial<Film>;
    }
  >(
    "films/updateFilm",

    async (
      {
        id,
        data,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axios.put<
            Film
          >(
            `${API_URL}/${id}`,
            data
          );

        return response.data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data ??
            error?.message ??
            "Film could not be updated"
        );
      }
    }
  );

export const addComment =
  createAsyncThunk<
    Film,
    {
      filmId:
        | string
        | number;

      comment: Comment;
    }
  >(
    "films/addComment",

    async (
      {
        filmId,
        comment,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axios.get<
            Film
          >(
            `${API_URL}/${filmId}`
          );

        const film =
          response.data;

        const updatedFilm: Film =
          {
            ...film,

            comments: [
              ...(film.comments ??
                []),

              comment,
            ],
          };

        const updateResponse =
          await axios.put<
            Film
          >(
            `${API_URL}/${filmId}`,
            updatedFilm
          );

        return updateResponse.data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data ??
            error?.message ??
            "Comment could not be added"
        );
      }
    }
  );

export const likeComment =
  createAsyncThunk<
    Film,
    {
      filmId:
        | string
        | number;

      commentId: number;

      userId: number;
    }
  >(
    "films/likeComment",

    async (
      {
        filmId,
        commentId,
        userId,
      },
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await axios.get<
            Film
          >(
            `${API_URL}/${filmId}`
          );

        const film =
          response.data;

        const updatedComments =
          (
            film.comments ??
            []
          ).map(
            (comment) => {
              if (
                comment.id !==
                commentId
              ) {
                return comment;
              }

              const alreadyLiked =
                comment.users_who_liked.includes(
                  userId
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
                    ? comment.users_who_liked.filter(
                        (
                          id
                        ) =>
                          id !==
                          userId
                      )
                    : [
                        ...comment.users_who_liked,
                        userId,
                      ],
              };
            }
          );

        const updatedFilm: Film =
          {
            ...film,

            comments:
              updatedComments,
          };

        const updateResponse =
          await axios.put<
            Film
          >(
            `${API_URL}/${filmId}`,
            updatedFilm
          );

        return updateResponse.data;
      } catch (error: any) {
        return rejectWithValue(
          error?.response?.data ??
            error?.message ??
            "Comment could not be liked"
        );
      }
    }
  );

const getUniqueCategories = (
  films: Film[]
): string[] => {
  return Array.from(
    new Set(
      films.flatMap(
        (film) =>
          film.category ??
          []
      )
    )
  );
};

const getUniqueGenres = (
  films: Film[]
): string[] => {
  return Array.from(
    new Set(
      films
        .map(
          (film) =>
            film.genre
        )
        .filter(Boolean)
    )
  );
};

export const filmsSlice =
  createSlice({
    name: "films",

    initialState,

    reducers: {},

    extraReducers:
      (builder) => {
        builder

          .addCase(
            getFilms.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            getFilms.fulfilled,
            (
              state,
              action: PayloadAction<
                Film[]
              >
            ) => {
              state.data =
                action.payload;

              state.uniqueCategories =
                getUniqueCategories(
                  action.payload
                );

              state.uniqueGenres =
                getUniqueGenres(
                  action.payload
                );

              state.loading =
                false;
            }
          )

          .addCase(
            getFilms.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                typeof action.payload ===
                "string"
                  ? action.payload
                  : "Films could not be loaded";
            }
          )

          .addCase(
            postFilm.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                null;
            }
          )

          .addCase(
            postFilm.fulfilled,
            (
              state,
              action: PayloadAction<
                Film
              >
            ) => {
              state.data.push(
                action.payload
              );

              state.uniqueCategories =
                getUniqueCategories(
                  state.data
                );

              state.uniqueGenres =
                getUniqueGenres(
                  state.data
                );

              state.loading =
                false;
            }
          )

          .addCase(
            postFilm.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                typeof action.payload ===
                "string"
                  ? action.payload
                  : "Film could not be added";
            }
          )

          .addCase(
            deleteFilm.fulfilled,
            (
              state,
              action: PayloadAction<
                string
              >
            ) => {
              state.data =
                state.data.filter(
                  (film) =>
                    String(
                      film.id
                    ) !==
                    String(
                      action.payload
                    )
                );

              state.uniqueCategories =
                getUniqueCategories(
                  state.data
                );

              state.uniqueGenres =
                getUniqueGenres(
                  state.data
                );
            }
          )

          .addCase(
            updateFilm.fulfilled,
            (
              state,
              action: PayloadAction<
                Film
              >
            ) => {
              const index =
                state.data.findIndex(
                  (film) =>
                    String(
                      film.id
                    ) ===
                    String(
                      action
                        .payload
                        .id
                    )
                );

              if (
                index !== -1
              ) {
                state.data[
                  index
                ] =
                  action.payload;

                state.uniqueCategories =
                  getUniqueCategories(
                    state.data
                  );

                state.uniqueGenres =
                  getUniqueGenres(
                    state.data
                  );
              }
            }
          )

          .addCase(
            addComment.fulfilled,
            (
              state,
              action: PayloadAction<
                Film
              >
            ) => {
              const index =
                state.data.findIndex(
                  (film) =>
                    String(
                      film.id
                    ) ===
                    String(
                      action
                        .payload
                        .id
                    )
                );

              if (
                index !== -1
              ) {
                state.data[
                  index
                ] =
                  action.payload;
              }
            }
          )

          .addCase(
            likeComment.fulfilled,
            (
              state,
              action: PayloadAction<
                Film
              >
            ) => {
              const index =
                state.data.findIndex(
                  (film) =>
                    String(
                      film.id
                    ) ===
                    String(
                      action
                        .payload
                        .id
                    )
                );

              if (
                index !== -1
              ) {
                state.data[
                  index
                ] =
                  action.payload;
              }
            }
          );
      },
  });

export default filmsSlice.reducer;