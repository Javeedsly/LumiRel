import { useSelector, useDispatch } from "react-redux";
import { getFilms } from "@/app/redux/features/apiSlice/apiSlice";

export const useGlobalState = () => {
  const dispatch = useDispatch();
  const films = useSelector((state: any) => state.films.data);
  const filmsLoading = useSelector((state: any) => state.films.loading);

  return { films, filmsLoading, dispatch, getFilms };
};
