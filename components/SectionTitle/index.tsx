import React from "react";
import style from "./SectionTitle.module.scss";
import classnames from "classnames/bind";

const cx = classnames.bind(style);

interface SectoinTitleProps {
  title: React.ReactNode | string;
}

export const SectionTitle = ({ title }: SectoinTitleProps) => {
  return <h2 className={cx("section_title")}>{title}</h2>;
};

export default SectionTitle;
