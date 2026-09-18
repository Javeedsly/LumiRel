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
  Switch,
  Pagination,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { AppDispatch, RootState } from "@/app/redux/store/store";
import { getLogin, updateUserProfile } from "@/app/redux/features/authSlice/loginSlice";
import Link from "next/link";
import "./table.css";

const UsersTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users: reduxUsers } = useSelector((state: RootState) => state.auth);

  const [users, setUsers] = useState(reduxUsers);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("az");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const usersPerPage = 5;
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(getLogin());
  }, [dispatch]);

  useEffect(() => {
    setUsers(reduxUsers);
  }, [reduxUsers]);

  const handlePremiumToggle = async (user: any) => {
    const updatedUser = { ...user, isPremium: !user.isPremium };

    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
    );

    await dispatch(updateUserProfile({ id: user.id, updatedData: updatedUser }));
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      console.log("Deleting user:", selectedUser.id);
      setOpenDialog(false);
    }
  };

  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const filteredUsers = users
    .filter((user: any) => {
      const fullName = `${user.name || ""} ${user.surname || ""}`.trim();
      const isPremiumMatch =
        filter === "all" || (filter === "premium" ? user.isPremium : !user.isPremium);
      const isSearchMatch =
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      return isPremiumMatch && isSearchMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "az") return a.name.localeCompare(b.name);
      if (sortOrder === "za") return b.name.localeCompare(a.name);
      if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });

  const paginatedUsers = filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage);

  return (
    <div className="users-container">
      <Typography variant="h5" className="table-title">
        Users Management
      </Typography>

      <div className="actions">
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-field"
        />

        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <MenuItem value="all">All Users</MenuItem>
          <MenuItem value="premium">Premium</MenuItem>
          <MenuItem value="normal">Normal</MenuItem>
        </Select>

        <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-select">
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
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user: any) => (
              <TableRow key={user.id} className="user-row">
                <TableCell>
                  <img
                    src={user.profileImage || "https://i.pinimg.com/736x/20/e8/36/20e836d27bea68d015f0da6694151466.jpg"}
                    alt={user.name || "User"}
                    className="user-avatar"
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/admin/users/${user.id}`} className="user-link">
                    {user.name} {user.surname}
                  </Link>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className={user.isPremium ? "premium" : "normal"}>
                  {user.isPremium ? "Premium" : "Normal"}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.isPremium}
                    onChange={() => handlePremiumToggle(user)}
                    color="primary"
                  />
                  {/* <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => openDeleteModal(user)}
                    style={{ marginLeft: "10px" }}
                  >
                    Remove
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredUsers.length / usersPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        className="pagination"
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to remove <b>{selectedUser?.name} {selectedUser?.surname}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersTable;
