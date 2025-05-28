import Color from "color";
import React from "react";

interface TodoHeaderProps {
  title: string;
  color: string;
}

export default function TodoHeader({ title, color }: TodoHeaderProps) {
  const baseColor = Color(color);
  const darkerColor = baseColor.darken(0.4).hex();
  return (
    <div
      style={{ backgroundColor: color }}
      className="flex items-center px-4 py-1 rounded-full w-fit"
    >
      <div
        className="rounded-full h-2 w-2 inline-flex mr-2"
        style={{ backgroundColor: darkerColor }}
      />
      <label>{title}</label>
    </div>
  );
}
