import PostType from "@/interfaces/post";
import Link from "next/link";
import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
import style from "./PostList.module.scss";
import Image from "next/image";
import moment from "moment";
import { AUTHOR } from "@/lib/constants";
// import Fire from "./assets/fire.svg";

const cx = classNames.bind(style);

interface PostListProps {
  postList: PostType[];
}

export const PostList = ({ postList }: PostListProps) => {
  const [isClient, setIsClient] = useState(false);

  const generateRandomReaction = () => {
    const reactionList = [];
    for (let i = 0; i < 5; i++) {
      reactionList.push(Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10) + 1);
    }

    return (
      <>
        {reactionList.map((reaction, i) => (
          <span className={cx("reaction_item", { hide: reaction === 0 })} key={i}></span>
        ))}
        <span className={cx("reaction_text")}>{sumArray(reactionList)} reactions</span>
      </>
    );
  };

  const randomCommentCount = () => {
    return Math.floor(Math.random() * 10);
  };

  function sumArray(arr: number[]) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum;
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div className={cx("post_list")}>
        {postList.map((post, i) => {
          const fromNow = moment(post.date, "YYYYMMDD-HH:mm:ss").fromNow();
          const date = String(fromNow).includes("hours") ? fromNow : moment(post.date).format("MMM D, YYYY");
          return (
            <Link className={cx("post_item")} href={`/post/${post.slug}`} aria-label={post.title} key={i}>
              <div className={cx("thumbnail_wrap")}>
                <Image
                  src={post.coverImage ? post.coverImage : `https://source.unsplash.com/random/?programming`}
                  className={cx("thumbnail")}
                  alt={post.title}
                  width={100}
                  height={100}
                />
              </div>
              <div className={cx("text_area")}>
                <div className={cx("profile_area")}>
                  <div className={cx("profile_image_wrap")}>
                    <Image
                      src={"/favicons/apple-icon-114x114.png"}
                      className={cx("profile")}
                      alt={post.title}
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className={cx("writer")}>{AUTHOR}</span>
                </div>
                <strong className={cx("title")}>{post.title}</strong>
                {/* <p className={cx("description")}>{post.description}</p> */}
                {/* <ul className={cx("tag_list")}>
                  {post.tag.map((tag, i) => (
                    <li className={cx("tag_item")} key={i}>
                      <Link className={cx("tag_link")} href={`/tags/${tag}`}>
                        <span>#</span>
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul> */}
                {isClient && (
                  <div className={cx("reaction_area")}>
                    <div className={cx("reaction_list")}>
                      {generateRandomReaction()}
                      {/* <span className={cx("reaction_text")}>{randomCommentCount()} reactions</span> */}
                    </div>
                    <div className={cx("comment")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        role="img"
                        aria-labelledby="a9r26cjkehaw9aroeeenqzf7sqj1obph"
                      >
                        <title id="a9r26cjkehaw9aroeeenqzf7sqj1obph">Comments</title>
                        <path d="M10.5 5h3a6 6 0 110 12v2.625c-3.75-1.5-9-3.75-9-8.625a6 6 0 016-6zM12 15.5h1.5a4.501 4.501 0 001.722-8.657A4.5 4.5 0 0013.5 6.5h-3A4.5 4.5 0 006 11c0 2.707 1.846 4.475 6 6.36V15.5z"></path>
                      </svg>
                      {randomCommentCount()} comment
                    </div>
                  </div>
                )}
                <div className={cx("meta")}>
                  <span className={cx("date")}>{date}</span>
                  <span className={cx("reading_time")}>{post.readingTime} min read</span>
                  <span className={cx("bookmark")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" aria-hidden="true">
                      <path d="M6.75 4.5h10.5a.75.75 0 01.75.75v14.357a.375.375 0 01-.575.318L12 16.523l-5.426 3.401A.375.375 0 016 19.607V5.25a.75.75 0 01.75-.75zM16.5 6h-9v11.574l4.5-2.82 4.5 2.82V6z"></path>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default PostList;
