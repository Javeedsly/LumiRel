import { useRouter } from "next/navigation";

export const useGoToDetail = () => {
  const router = useRouter();

  return (filmId: string | number) => {
    router.push(`/main/${filmId}`);
  };
};
