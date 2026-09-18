"use client";

import { useEffect, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

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
  Button,
  Select,
  MenuItem,
  Pagination,
  Checkbox,
  Snackbar,
} from "@mui/material";

import type {
  AppDispatch,
  RootState,
} from "@/app/redux/store/store";

import {
  fetchAdmins,
  deleteAdmin,
} from "@/app/redux/features/adminSlice/adminSlice";

import EditAdminModal from "./Edit/EditAdminModal";

import "./table.css";

type BaseAdmin =
  RootState["admin"]["adminData"][number];

interface AdminRow extends BaseAdmin {
  email?: string;
  createdAt?: string;
}

const AdminTable = () => {
  const dispatch =
    useDispatch<AppDispatch>();

  const adminData =
    useSelector(
      (state: RootState) =>
        state.admin.adminData
    ) as AdminRow[];

  const [
    admins,
    setAdmins,
  ] = useState<AdminRow[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filterRole,
    setFilterRole,
  ] = useState("all");

  const [
    sortOrder,
    setSortOrder,
  ] = useState("az");

  const [
    selectedAdmins,
    setSelectedAdmins,
  ] = useState<number[]>([]);

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    selectedAdmin,
    setSelectedAdmin,
  ] =
    useState<AdminRow | null>(
      null
    );

  const [
    openSnackbar,
    setOpenSnackbar,
  ] = useState(false);

  const [
    snackbarMessage,
    setSnackbarMessage,
  ] = useState("");

  const adminsPerPage = 5;

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  useEffect(() => {
    setAdmins(adminData);
  }, [adminData]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    filterRole,
    sortOrder,
  ]);

  const handleDeleteAdmin =
    async (
      id: number
    ) => {
      try {
        await dispatch(
          deleteAdmin(id)
        ).unwrap();

        setSelectedAdmins(
          (prev) =>
            prev.filter(
              (
                adminId
              ) =>
                adminId !==
                id
            )
        );

        setSnackbarMessage(
          "Admin successfully deleted!"
        );

        setOpenSnackbar(true);
      } catch (error) {
        console.error(
          "Admin delete error:",
          error
        );

        setSnackbarMessage(
          "Failed to delete admin!"
        );

        setOpenSnackbar(true);
      }
    };

  const handleEdit = (
    admin: AdminRow
  ) => {
    setSelectedAdmin(admin);
    setOpenModal(true);
  };

  const handleSelectAdmin = (
    id: number
  ) => {
    setSelectedAdmins(
      (prev) =>
        prev.includes(id)
          ? prev.filter(
              (
                adminId
              ) =>
                adminId !==
                id
            )
          : [
              ...prev,
              id,
            ]
    );
  };

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredAdmins =
    [...admins]
      .filter(
        (admin) => {
          const name =
            admin.name
              ?.toLowerCase() ??
            "";

          const email =
            admin.email
              ?.toLowerCase() ??
            "";

          return (
            name.includes(
              normalizedSearch
            ) ||
            email.includes(
              normalizedSearch
            )
          );
        }
      )
      .filter(
        (admin) =>
          filterRole ===
          "all"
            ? true
            : admin.role ===
              filterRole
      )
      .sort(
        (a, b) => {
          if (
            sortOrder ===
            "az"
          ) {
            return (
              a.name ??
              ""
            ).localeCompare(
              b.name ?? ""
            );
          }

          if (
            sortOrder ===
            "za"
          ) {
            return (
              b.name ??
              ""
            ).localeCompare(
              a.name ?? ""
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

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredAdmins.length /
          adminsPerPage
      )
    );

  const paginatedAdmins =
    filteredAdmins.slice(
      (page - 1) *
        adminsPerPage,

      page *
        adminsPerPage
    );

  return (
    <div className="users-container">
      <Typography
        variant="h5"
        className="table-title"
      >
        Admin Management
      </Typography>

      <div className="actions">
        <TextField
          label="Search Admins"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="search-field"
        />

        <Select
          value={
            filterRole
          }
          onChange={(e) =>
            setFilterRole(
              e.target.value
            )
          }
          className="filter-select"
        >
          <MenuItem value="all">
            All Admins
          </MenuItem>

          <MenuItem value="superadmin">
            Super Admin
          </MenuItem>

          <MenuItem value="filmadmin">
            Film Admin
          </MenuItem>

          <MenuItem value="useradmin">
            User Admin
          </MenuItem>
        </Select>

        <Select
          value={
            sortOrder
          }
          onChange={(e) =>
            setSortOrder(
              e.target.value
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
                Select
              </TableCell>

              <TableCell>
                Avatar
              </TableCell>

              <TableCell>
                Name
              </TableCell>

              <TableCell>
                Role
              </TableCell>

              <TableCell>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedAdmins.length >
            0 ? (
              paginatedAdmins.map(
                (admin) => (
                  <TableRow
                    key={
                      admin.id
                    }
                    className="user-row"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedAdmins.includes(
                          admin.id
                        )}
                        onChange={() =>
                          handleSelectAdmin(
                            admin.id
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <img
                        src={
                          admin.avatar ||
                          "/default-avatar.png"
                        }
                        alt={
                          admin.name ||
                          "Admin"
                        }
                        className="user-avatar"
                      />
                    </TableCell>

                    <TableCell>
                      <span>
                        {
                          admin.name
                        }
                      </span>
                    </TableCell>

                    <TableCell>
                      <span>
                        {
                          admin.role
                        }
                      </span>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                          handleEdit(
                            admin
                          )
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          handleDeleteAdmin(
                            admin.id
                          )
                        }
                        sx={{
                          ml: 1,
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No admins found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={Math.min(
          page,
          totalPages
        )}
        onChange={(
          _event,
          value
        ) =>
          setPage(value)
        }
        className="pagination"
      />

      <EditAdminModal
        open={openModal}
        handleClose={() => {
          setOpenModal(
            false
          );

          setSelectedAdmin(
            null
          );
        }}
        admin={
          selectedAdmin
        }
      />

      <Snackbar
        open={
          openSnackbar
        }
        autoHideDuration={
          4000
        }
        onClose={() =>
          setOpenSnackbar(
            false
          )
        }
        message={
          snackbarMessage
        }
      />
    </div>
  );
};

export default AdminTable;