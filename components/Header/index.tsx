import React, { useState } from "react";
import style from "./Header.module.scss";
import classnames from "classnames/bind";
import Link from "next/link";
import { useRouter } from "next/router";
import { AUTHOR } from "@/lib/constants";

const cx = classnames.bind(style);

const Header = () => {
  const router = useRouter();

  return (
    <header className={cx("header")}>
      <div className={cx("inner")}>
        <strong className={cx("title")}>
          <Link href={`/`}>{AUTHOR}</Link>
        </strong>
        <nav className={cx("nav_area")}>
          <Link href={`/posts/1`} className={cx("nav_item")}>
            Posts
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
