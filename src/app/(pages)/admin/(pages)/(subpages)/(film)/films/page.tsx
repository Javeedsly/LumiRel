import React from "react";
import Aside from "../../../../components/AsideLeft/AsideLeft";
import AsideRight from "../../../../components/AsideRight/AsideRight";
import "./film.css"
import Filmtable from "../../../../components/Table/FilmTable/Filmtable";

const page = () => {
  return (
    <div className="layout">
        <Aside />
      <main>
        <Filmtable />
      </main>
        <AsideRight />
    </div>
  );
};

export default page;
