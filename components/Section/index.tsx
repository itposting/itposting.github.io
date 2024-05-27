import React from "react";
import style from "./Section.module.scss";
import classnames from "classnames/bind";
import SectionTitle from "../SectionTitle";
import Link from "next/link";

const cx = classnames.bind(style);

interface SectoinTitleProps {
  title: string;
  moreLink?: string;
  children?: React.ReactNode;
}

export const Section = ({ title, moreLink, children }: SectoinTitleProps) => {
  return (
    <div className={cx("section_wrap")}>
      <div className={cx("title_area")}>
        <SectionTitle title={title} />
        {moreLink && (
          <Link className={cx("more_link")} href={moreLink}>
            more <span className="blind">{title}</span>
          </Link>
        )}
      </div>
      <div className={cx("section")}>{children}</div>
    </div>
  );
};

export default Section;
