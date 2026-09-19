import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getFilms,
} from "@/app/redux/features/apiSlice/apiSlice";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

export const useGlobalState = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const {
    data: films,
    loading: filmsLoading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.films
  );

  return {
    films,
    filmsLoading,
    error,
    dispatch,
    getFilms,
  };
};