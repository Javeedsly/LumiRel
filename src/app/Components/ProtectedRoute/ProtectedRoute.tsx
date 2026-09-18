"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store/store";
import { getUserControl } from "@/app/redux/features/authSlice/loginSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const status = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    dispatch(getUserControl()).then((res) => {
      console.log("getUserControl cavabı:", res);
    });
  }, [dispatch]);

  useEffect(() => {
    console.log("User:", user);
    console.log("Status:", status);
    
    if (user === null) {
      setTimeout(() => {
        alert("Bu səhifəyə baxmaq üçün hesabınıza daxil olun!");
        router.push("/main/auth/login");
      }, 300);
    }
  }, [user, router]);

  if (user === null) {
    return <div>Yönləndirilir...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
