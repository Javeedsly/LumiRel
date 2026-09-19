"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Switch,
  Pagination,
  MenuItem,
  Select,
} from "@mui/material";

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import {
  getLogin,
  updateUserProfile,
} from "@/app/redux/features/authSlice/loginSlice";

import "./table.css";

interface UserRow {
  id: string;

  name?: string;
  surname?: string;

  firstName?: string;
  lastName?: string;

  username?: string;

  email?: string;
  password?: string;

  profileImage?: string;

  isPremium?: boolean;

  createdAt?: string;

  premiumStartDate?: string | null;
  premiumCancelDate?: string | null;

  cardNumber?: string;
}

type UserFilter =
  | "all"
  | "premium"
  | "normal";

type SortOrder =
  | "az"
  | "za"
  | "newest"
  | "oldest";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg";

const UsersTable = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const reduxUsers =
    useSelector(
      (state: RootState) =>
        state.auth.users
    ) as UserRow[];

  const [
    users,
    setUsers,
  ] = useState<UserRow[]>(
    reduxUsers
  );

  const [
    filter,
    setFilter,
  ] = useState<UserFilter>(
    "all"
  );

  const [
    sortOrder,
    setSortOrder,
  ] = useState<SortOrder>(
    "az"
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const usersPerPage = 5;

  useEffect(() => {
    dispatch(getLogin());
  }, [dispatch]);

  useEffect(() => {
    setUsers(
      Array.isArray(
        reduxUsers
      )
        ? reduxUsers
        : []
    );
  }, [reduxUsers]);

  useEffect(() => {
    setPage(1);
  }, [
    filter,
    sortOrder,
    search,
  ]);

  const handlePremiumToggle =
    async (
      user: UserRow
    ) => {
      const updatedUser:
        UserRow = {
        ...user,

        isPremium:
          !Boolean(
            user.isPremium
          ),
      };

      // UI-da dərhal göstəririk.
      setUsers(
        (prevUsers) =>
          prevUsers.map(
            (currentUser) =>
              currentUser.id ===
              user.id
                ? updatedUser
                : currentUser
          )
      );

      try {
        await dispatch(
          updateUserProfile({
            id: user.id,
            updatedData:
              updatedUser,
          })
        ).unwrap();
      } catch (error) {
        console.error(
          "User premium update error:",
          error
        );

        // API xətası olsa əvvəlki vəziyyətə qaytarırıq.
        setUsers(
          (prevUsers) =>
            prevUsers.map(
              (
                currentUser
              ) =>
                currentUser.id ===
                user.id
                  ? user
                  : currentUser
            )
        );
      }
    };

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredUsers =
    useMemo(() => {
      return [...users]
        .filter(
          (user) => {
            const firstName =
              user.name ??
              user.firstName ??
              "";

            const lastName =
              user.surname ??
              user.lastName ??
              "";

            const fullName =
              `${firstName} ${lastName}`
                .trim()
                .toLowerCase();

            const username =
              (
                user.username ??
                ""
              ).toLowerCase();

            const email =
              (
                user.email ??
                ""
              ).toLowerCase();

            const isPremium =
              Boolean(
                user.isPremium
              );

            const isPremiumMatch =
              filter === "all"
                ? true
                : filter ===
                    "premium"
                  ? isPremium
                  : !isPremium;

            const isSearchMatch =
              normalizedSearch ===
                "" ||
              fullName.includes(
                normalizedSearch
              ) ||
              username.includes(
                normalizedSearch
              ) ||
              email.includes(
                normalizedSearch
              );

            return (
              isPremiumMatch &&
              isSearchMatch
            );
          }
        )
        .sort(
          (a, b) => {
            const aName =
              (
                a.name ??
                a.firstName ??
                a.username ??
                ""
              ).toLowerCase();

            const bName =
              (
                b.name ??
                b.firstName ??
                b.username ??
                ""
              ).toLowerCase();

            if (
              sortOrder ===
              "az"
            ) {
              return aName.localeCompare(
                bName
              );
            }

            if (
              sortOrder ===
              "za"
            ) {
              return bName.localeCompare(
                aName
              );
            }

            if (
              sortOrder ===
              "newest"
            ) {
              const aTime =
                a.createdAt
                  ? new Date(
                      a.createdAt
                    ).getTime()
                  : 0;

              const bTime =
                b.createdAt
                  ? new Date(
                      b.createdAt
                    ).getTime()
                  : 0;

              return (
                bTime -
                aTime
              );
            }

            if (
              sortOrder ===
              "oldest"
            ) {
              const aTime =
                a.createdAt
                  ? new Date(
                      a.createdAt
                    ).getTime()
                  : 0;

              const bTime =
                b.createdAt
                  ? new Date(
                      b.createdAt
                    ).getTime()
                  : 0;

              return (
                aTime -
                bTime
              );
            }

            return 0;
          }
        );
    }, [
      users,
      filter,
      sortOrder,
      normalizedSearch,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredUsers.length /
          usersPerPage
      )
    );

  const safePage =
    Math.min(
      page,
      totalPages
    );

  const startIndex =
    (safePage - 1) *
    usersPerPage;

  const paginatedUsers =
    filteredUsers.slice(
      startIndex,
      startIndex +
        usersPerPage
    );

  return (
    <div className="users-container">
      <Typography
        variant="h5"
        className="table-title"
      >
        Users Management
      </Typography>

      <div className="actions">
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target
                .value
            )
          }
          className="search-field"
        />

        <Select<UserFilter>
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target
                .value as UserFilter
            )
          }
          className="filter-select"
        >
          <MenuItem value="all">
            All Users
          </MenuItem>

          <MenuItem value="premium">
            Premium
          </MenuItem>

          <MenuItem value="normal">
            Normal
          </MenuItem>
        </Select>

        <Select<SortOrder>
          value={
            sortOrder
          }
          onChange={(event) =>
            setSortOrder(
              event.target
                .value as SortOrder
            )
          }
          className="filter-select"
        >
          <MenuItem value="az">
            A-Z
          </MenuItem>

          <MenuItem value="za">
            Z-A
          </MenuItem>

          <MenuItem value="newest">
            Newest to Oldest
          </MenuItem>

          <MenuItem value="oldest">
            Oldest to Newest
          </MenuItem>
        </Select>
      </div>

      <TableContainer
        component={Paper}
        className="users-table"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Profile
              </TableCell>

              <TableCell>
                Name
              </TableCell>

              <TableCell>
                Email
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedUsers.length >
            0 ? (
              paginatedUsers.map(
                (user) => {
                  const firstName =
                    user.name ??
                    user.firstName ??
                    "";

                  const lastName =
                    user.surname ??
                    user.lastName ??
                    "";

                  const fullName =
                    `${firstName} ${lastName}`.trim() ||
                    user.username ||
                    "User";

                  const isPremium =
                    Boolean(
                      user.isPremium
                    );

                  return (
                    <TableRow
                      key={
                        user.id
                      }
                      className="user-row"
                    >
                      <TableCell>
                        <img
                          src={
                            user.profileImage ||
                            DEFAULT_AVATAR
                          }
                          alt={
                            fullName
                          }
                          className="user-avatar"
                        />
                      </TableCell>

                      <TableCell>
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="user-link"
                        >
                          {
                            fullName
                          }
                        </Link>
                      </TableCell>

                      <TableCell>
                        {user.email ??
                          "-"}
                      </TableCell>

                      <TableCell
                        className={
                          isPremium
                            ? "premium"
                            : "normal"
                        }
                      >
                        {isPremium
                          ? "Premium"
                          : "Normal"}
                      </TableCell>

                      <TableCell>
                        <Switch
                          checked={
                            isPremium
                          }
                          onChange={() =>
                            handlePremiumToggle(
                              user
                            )
                          }
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  );
                }
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length >
        usersPerPage && (
        <Pagination
          count={
            totalPages
          }
          page={
            safePage
          }
          onChange={(
            _event,
            value
          ) =>
            setPage(value)
          }
          className="pagination"
        />
      )}
    </div>
  );
};

export default UsersTable;