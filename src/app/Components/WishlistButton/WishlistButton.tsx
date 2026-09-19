"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import type { Film } from "@/app/redux/features/apiSlice/apiSlice";

import { updateWishlist } from "@/app/redux/features/authSlice/loginSlice";

import "./wishlistButton.css";

interface WishlistButtonProps {
  movie: Film;
}

export default function WishlistButton({
  movie,
}: WishlistButtonProps) {
  const dispatch =
    useDispatch<AppDispatch>();

  const router =
    useRouter();

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    );

  const [
    updating,
    setUpdating,
  ] =
    useState(false);

  const isWishlisted =
    Boolean(
      user?.wishlist?.some(
        (item) =>
          String(
            item.id
          ) ===
          String(
            movie.id
          )
      )
    );

  const handleWishlistToggle =
    async () => {
      if (!user) {
        router.push(
          "/main/auth/login"
        );

        return;
      }

      if (updating) {
        return;
      }

      setUpdating(true);

      try {
        await dispatch(
          updateWishlist({
            userId:
              user.id,

            movie,
          })
        ).unwrap();
      } catch (error) {
        console.error(
          "Wishlist update error:",
          error
        );
      } finally {
        setUpdating(
          false
        );
      }
    };

  return (
    <button
      type="button"
      onClick={
        handleWishlistToggle
      }
      disabled={
        updating
      }
      className={`relative-wish ${
        isWishlisted
          ? "relative-wish--active"
          : ""
      }`}
      aria-label={
        isWishlisted
          ? `Remove ${movie.title} from favorites`
          : `Add ${movie.title} to favorites`
      }
      title={
        isWishlisted
          ? "Remove from favorites"
          : "Add to favorites"
      }
    >
      {isWishlisted ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </button>
  );
}