import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://679ba82733d316846324a9d2.mockapi.io/movies";

interface Comment {
  id: number;
  user_id: number;
  username: string;
  comment: string;
  flames: number;
  users_who_liked: number[];
}

interface Film {
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
  actors: { name: string; image: string }[];
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
  recommendedFilms: [],
  loading: false,
  error: null,
};

export const getFilms = createAsyncThunk<Film[]>(
  "films/getFilms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      console.log(data);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const postFilm = createAsyncThunk<Film, Film>(
  "films/postFilm",
  async (film, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, film);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFilm = createAsyncThunk<number, number>(
  "films/deleteFilm",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFilm = createAsyncThunk<
  Film,
  { id: number; data: Partial<Film> }
>("films/updateFilm", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const addComment = createAsyncThunk<
  Film,
  { filmId: number; comment: Comment }
>("films/addComment", async ({ filmId, comment }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${filmId}`);
    const film: Film = response.data;

    const updatedFilm = {
      ...film,
      comments: [...film.comments, comment],
    };

    const { data } = await axios.put(`${API_URL}/${filmId}`, updatedFilm);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const likeComment = createAsyncThunk<
  Film,
  { filmId: number; commentId: number; userId: number }
>(
  "films/likeComment",
  async ({ filmId, commentId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${filmId}`);
      const film: Film = response.data;

      const updatedComments = film.comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              flames: comment.users_who_liked.includes(userId)
                ? comment.flames - 1
                : comment.flames + 1,
              users_who_liked: comment.users_who_liked.includes(userId)
                ? comment.users_who_liked.filter((id) => id !== userId)
                : [...comment.users_who_liked, userId],
            }
          : comment
      );

      const updatedFilm = { ...film, comments: updatedComments };

      const { data } = await axios.put(`${API_URL}/${filmId}`, updatedFilm);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const getUniqueCategories = (films: Film[]): string[] =>
  Array.from(new Set(films.flatMap((film) => film.category)));

const getUniqueGenres = (films: Film[]): string[] =>
  Array.from(new Set(films.map((film) => film.genre)));

export const filmsSlice = createSlice({
  name: "films",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFilms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilms.fulfilled, (state, action: PayloadAction<Film[]>) => {
        state.data = action.payload;
        state.uniqueCategories = getUniqueCategories(action.payload);
        state.uniqueGenres = getUniqueGenres(action.payload);
        state.loading = false;
      })
      .addCase(getFilms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(postFilm.fulfilled, (state, action: PayloadAction<Film>) => {
        state.data.push(action.payload);
        state.uniqueCategories = getUniqueCategories(state.data);
        state.uniqueGenres = getUniqueGenres(state.data);
      })
      .addCase(deleteFilm.fulfilled, (state, action: PayloadAction<number>) => {
        state.data = state.data.filter((film) => film.id !== action.payload);
        state.uniqueCategories = getUniqueCategories(state.data);
        state.uniqueGenres = getUniqueGenres(state.data);
      })
      .addCase(updateFilm.fulfilled, (state, action: PayloadAction<Film>) => {
        const index = state.data.findIndex(
          (film) => film.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
          state.uniqueCategories = getUniqueCategories(state.data);
          state.uniqueGenres = getUniqueGenres(state.data);
        }
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Film>) => {
        const index = state.data.findIndex(
          (film) => film.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(likeComment.fulfilled, (state, action: PayloadAction<Film>) => {
        const index = state.data.findIndex(
          (film) => film.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      });
  },
});

export default filmsSlice.reducer;
