"use client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosHeartDislike } from "react-icons/io";
import { PiHeartStraightFill } from "react-icons/pi";
import "./wishlistButton.css";
import { getUserControl, updateWishlist } from "@/app/redux/features/authSlice/loginSlice";

export default function WishlistButton({ movie }: { movie: any }) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const isWishlisted = user?.wishlist?.some((item: any) => item.id === movie.id);

  useEffect(() => {
    dispatch(getUserControl());
  }, [dispatch]);

  const handleWishlistToggle = () => {
    if (!user) {
      alert("Wishlist üçün daxil olun!");
      return;
    }

    dispatch(updateWishlist({ userId: user.id, movie }));
  };

  return (
    <button onClick={handleWishlistToggle} className="relative-wish">
      {isWishlisted ? (
        <IoIosHeartDislike className="w-6 h-6 text-red-500 transition-all" />
      ) : (
        <PiHeartStraightFill className="w-6 h-6 text-gray-400 transition-all" />
      )}
    </button>
  );
}
