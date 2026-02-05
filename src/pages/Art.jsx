import React from "react";
import Gallery from "./Gallery";
import About from "./About";
import PoemFlow from "./PoemFlow";

export default function Art({ selectedArt }) {
  const artModules = {
    gallery: {
      label: "Gallery",
      component: <Gallery />,
    },
    canvas: {
      label: "Canvas",
      component: <About />,
    },
    poem: {
      label: "Poem",
      component: <PoemFlow />,
    },
  };

  return (
    <div className="relative w-full">
      {/* 动态渲染选中的模块 */}
      <div className="w-full">
        {artModules[selectedArt].component}
      </div>
    </div>
  );
}
