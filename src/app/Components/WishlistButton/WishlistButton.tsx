"use client";

import {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  IoIosHeartDislike,
} from "react-icons/io";

import {
  PiHeartStraightFill,
} from "react-icons/pi";

import type {
  RootState,
  AppDispatch,
} from "@/app/redux/store/store";

import type {
  Film,
} from "@/app/redux/features/apiSlice/apiSlice";

import {
  getUserControl,
  updateWishlist,
} from "@/app/redux/features/authSlice/loginSlice";

import "./wishlistButton.css";

interface WishlistButtonProps {
  movie: Film;
}

export default function WishlistButton({
  movie,
}: WishlistButtonProps) {
  const dispatch =
    useDispatch<AppDispatch>();

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    );

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

  useEffect(() => {
    if (!user) {
      dispatch(
        getUserControl()
      );
    }
  }, [
    dispatch,
    user,
  ]);

  const handleWishlistToggle =
    async () => {
      if (!user) {
        alert(
          "Wishlist üçün daxil olun!"
        );

        return;
      }

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
      }
    };

  return (
    <button
      type="button"
      onClick={
        handleWishlistToggle
      }
      className="relative-wish"
    >
      {isWishlisted ? (
        <IoIosHeartDislike className="w-6 h-6 text-red-500 transition-all" />
      ) : (
        <PiHeartStraightFill className="w-6 h-6 text-gray-400 transition-all" />
      )}
    </button>
  );
}