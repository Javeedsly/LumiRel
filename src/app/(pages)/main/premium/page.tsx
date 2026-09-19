import {
  redirect,
} from "next/navigation";

const PremiumPage =
  () => {
    redirect(
      "/main/allfilms"
    );
  };

export default PremiumPage;