"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { AppDispatch, RootState } from "@/app/redux/store/store";
import {
  fetchAdmins,
  deleteAdmin,
} from "@/app/redux/features/adminSlice/adminSlice";
import "./table.css";
import EditAdminModal from "./Edit/EditAdminModal";

const AdminTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adminData} = useSelector(
    (state: RootState) => state.admin
  );

  const [admins, setAdmins] = useState(adminData);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortOrder, setSortOrder] = useState("az");
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const adminsPerPage = 5;
  const [openModal, setOpenModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  useEffect(() => {
    setAdmins(adminData);
  }, [adminData]);

  const handleDeleteAdmin = async (id: number) => {
    await dispatch(deleteAdmin(id));
    setOpenSnackbar(true);
    setSnackbarMessage("Admin successfully deleted!");
  };

  const handleEdit = (admin: any) => {
    setSelectedAdmin(admin);
    setOpenModal(true);
  };

  const handleSelectAdmin = (id: number) => {
    setSelectedAdmins((prev) =>
      prev.includes(id)
        ? prev.filter((adminId) => adminId !== id)
        : [...prev, id]
    );
  };

  const filteredAdmins = admins
  .filter((admin) => {
    const name = admin.name ? admin.name.toLowerCase() : "";
    const email = admin.email ? admin.email.toLowerCase() : "";
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  })
  .filter((admin) => (filterRole === "all" ? true : admin.role === filterRole))
  .sort((a, b) => {
    if (sortOrder === "az") return a.name?.localeCompare(b.name);
    if (sortOrder === "za") return b.name?.localeCompare(a.name);
    if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return 0;
  });


  const paginatedAdmins = filteredAdmins.slice(
    (page - 1) * adminsPerPage,
    page * adminsPerPage
  );

  return (
    <div className="users-container">
      <Typography variant="h5" className="table-title">
        Admin Management
      </Typography>

      <div className="actions">
        <TextField
          label="Search Admins"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-field"
        />

        <Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="filter-select"
        >
          <MenuItem value="all">All Admins</MenuItem>
          <MenuItem value="superadmin">Super Admin</MenuItem>
          <MenuItem value="filmadmin">Film Admin</MenuItem>
          <MenuItem value="useradmin">User Admin</MenuItem>
        </Select>

        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="filter-select"
        >
          <MenuItem value="az">A-Z</MenuItem>
          <MenuItem value="za">Z-A</MenuItem>
          <MenuItem value="newest">Newest to Oldest</MenuItem>
          <MenuItem value="oldest">Oldest to Newest</MenuItem>
        </Select>
      </div>

      <TableContainer component={Paper} className="users-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAdmins.map((admin) => (
              <TableRow key={admin.id} className="user-row">
                <TableCell>
                  <Checkbox
                    checked={selectedAdmins.includes(admin.id)}
                    onChange={() => handleSelectAdmin(admin.id)}
                  />
                </TableCell>
                <TableCell>
                  <img
                    src={admin.avatar}
                    alt={admin.name}
                    className="user-avatar"
                  />
                </TableCell>
                <TableCell><span>{admin.name}</span></TableCell>
                <TableCell><span>{admin.role}</span></TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(admin)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteAdmin(admin.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredAdmins.length / adminsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        className="pagination"
      />

      <EditAdminModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        admin={selectedAdmin}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default AdminTable;
