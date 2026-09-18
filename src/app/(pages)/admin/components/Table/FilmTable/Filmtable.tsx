"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { deleteFilm, getFilms } from "@/app/redux/features/apiSlice/apiSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  Pagination,
} from "@mui/material";
import EditFilmModal from "./Edit/EditFilmModal";
import "./table.css";
import { useRouter } from "next/navigation";

const FilmTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { data: films = [], loading, error } = useSelector(
    (state: RootState) =>
      state.films || { data: [], loading: false, error: null }
  );

  const [filterGenre, setFilterGenre] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedFilms, setSelectedFilms] = useState<string[]>([]);
  const [editFilm, setEditFilm] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 6;

  useEffect(() => {
    dispatch(getFilms());
  }, [dispatch]);

  const handleDeleteSelected = () => {
    if (selectedFilms.length === 0) return alert("Heç bir film seçilməyib!");
    if (!confirm("Seçilən filmləri silmək istədiyinizə əminsiniz?")) return;

    selectedFilms.forEach((id) => dispatch(deleteFilm(id)));
    setSelectedFilms([]);
  };

  const filteredFilms =
    filterGenre === "all"
      ? films
      : films.filter((film) => film.genre === filterGenre);

  const sortedFilms = [...filteredFilms].sort((a, b) => {
    if (sortOrder === "az") return a.title.localeCompare(b.title);
    if (sortOrder === "za") return b.title.localeCompare(a.title);
    if (sortOrder === "newest") return parseInt(b.year) - parseInt(a.year);
    if (sortOrder === "oldest") return parseInt(a.year) - parseInt(b.year);
    return 0;
  });

  const totalPages = Math.ceil(sortedFilms.length / filmsPerPage);
  const startIndex = (currentPage - 1) * filmsPerPage;
  const paginatedFilms = sortedFilms.slice(startIndex, startIndex + filmsPerPage);

  return (
    <div className="layout">
      <div className="film-container">
        <div className="table-container">
          <Typography variant="h5" className="film-title">
            All Films
          </Typography>

          <div className="film-actions-container">
            <Button
              variant="contained"
              color="primary"
              className="add-film-btn"
              onClick={() => router.push("/admin/add-film")}
            >
              Add Film
            </Button>

            <Button
              variant="contained"
              color="error"
              disabled={selectedFilms.length === 0}
              onClick={handleDeleteSelected}
              className="bulk-delete-btn"
            >
              Delete Selected
            </Button>

            <Select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="filter-select"
            >
              <MenuItem value="all">All Genres</MenuItem>
              {[...new Set(films.map((film) => film.genre))].map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <MenuItem value="newest">Newest to Oldest</MenuItem>
              <MenuItem value="oldest">Oldest to Newest</MenuItem>
              <MenuItem value="az">A-Z</MenuItem>
              <MenuItem value="za">Z-A</MenuItem>
            </Select>
          </div>

          <TableContainer component={Paper} className="film-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Poster</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Genre</TableCell>
                  <TableCell>IMDB</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7}>Loading...</TableCell>
                  </TableRow>
                )}
                {error && (
                  <TableRow>
                    <TableCell colSpan={7}>Error: {error}</TableCell>
                  </TableRow>
                )}
                {paginatedFilms.map((film) => (
                  <TableRow key={film.id} className="film-row">
                    <TableCell>
                      <Checkbox
                        checked={selectedFilms.includes(film.id)}
                        onChange={() =>
                          setSelectedFilms((prev) =>
                            prev.includes(film.id)
                              ? prev.filter((id) => id !== film.id)
                              : [...prev, film.id]
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={film.poster}
                        alt={film.title}
                        className="film-poster"
                      />
                    </TableCell>
                    <TableCell>{film.title}</TableCell>
                    <TableCell>{film.year}</TableCell>
                    <TableCell>{film.genre}</TableCell>
                    <TableCell>{film.imdb}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => setEditFilm(film)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => dispatch(deleteFilm(film.id))}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && !error && paginatedFilms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>No films found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <div className="pagination-container">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </div>
          )}
        </div>
      </div>

      {editFilm && (
        <EditFilmModal
          open={!!editFilm}
          handleClose={() => setEditFilm(null)}
          film={editFilm}
        />
      )}
    </div>
  );
};

export default FilmTable;