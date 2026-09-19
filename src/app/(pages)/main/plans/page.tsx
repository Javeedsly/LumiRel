import {
  redirect,
} from "next/navigation";

const PlansPage =
  () => {
    redirect(
      "/main/allfilms"
    );
  };

export default PlansPage;