import React from "react";
import Admintable from "../../../../components/Table/AdminTable/Admintable";
import Aside from "../../../../components/AsideLeft/AsideLeft";
import "./all.css";

const page = () => {
  return (
    <div className="layout">
      <Aside />
      <main>
        <Admintable />
      </main>
    </div>
  );
};

export default page;
