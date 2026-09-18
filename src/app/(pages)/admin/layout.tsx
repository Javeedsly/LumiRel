"use client";

import { store } from "@/app/redux/store/store";
import { Provider } from "react-redux";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <main>{children}</main>
    </Provider>
  );
};

export default Layout;
