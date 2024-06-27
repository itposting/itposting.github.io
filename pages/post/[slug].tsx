import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getPosts } from "@/lib/api";
import type PostType from "@/interfaces/post";
import Header from "@/components/Header";
import style from "./posts.module.scss";
import classnames from "classnames/bind";
import Image from "next/image";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import rehypeHighlight from "rehype-highlight";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";

import markdownIt from "markdown-it";
import highlightjs from "markdown-it-highlightjs";
import markdownContainer from "markdown-it-container";
import { AUTHOR, LANG_LOCALE, SITE_NAME, SITE_URL } from "@/lib/constants";
import CustomHead from "@/components/CustomHead";
import GoogleAd from "@/components/GoogleAd";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import markdownToHtml from "@/lib/markdownToHtml";

const cx = classnames.bind(style);
const components = { Image, GoogleAd };
type Props = {
  post: PostType;
  morePosts: PostType[];
  preview?: boolean;
  content: any;
};

export default function Post({ post, content }: Props) {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      {router.isFallback ? (
        " Loading…"
      ) : (
        <>
          <CustomHead type="post" post={post} />
          <Header></Header>
          <main className={cx("container")}>
            <div className={cx("inner")}>
              <h1 className={cx("post_title")}>{post.title}</h1>
              <div className={cx("meta")}>
                <div className={cx("profile_wrap")}>
                  <div className={cx("profile_image_wrap")}>
                    <Image
                      src={"/favicons/apple-icon-114x114.png"}
                      className={cx("profile")}
                      alt={post.title}
                      width={44}
                      height={44}
                    />
                  </div>
                  <div className={cx("textarea")}>
                    <span className={cx("writer")}>{AUTHOR}</span>
                    <span className={cx("info")}>
                      <span className={cx("date")}>{`Posted On ${moment(post.date).format("MMM D, YYYY")}`}</span>
                      <span className={cx("reading_time")}>{post.readingTime} min read</span>
                    </span>
                  </div>
                </div>

                <Image
                  width={"50"}
                  height={"50"}
                  className={cx("view_badge")}
                  src={`https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fallround-coder.github.io${router.asPath}&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=views&edge_flat=false`}
                  alt=""
                />
              </div>

              <article className={cx("post_content")}>
                {/* <div dangerouslySetInnerHTML={{ __html: md.render(post.content) }}></div> */}
                <div dangerouslySetInnerHTML={{ __html: content }} />
                {/* <MDXRemote {...content} components={components} /> */}
              </article>
            </div>
          </main>
        </>
      )}
    </>
  );
}

export function myRemarkPlugin() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node.type === "textDirective" || node.type === "leafDirective" || node.type === "containerDirective") {
        if (node.name === "tip") {
          const data = node.data || (node.data = {});
          const tagName = node.type === "textDirective" ? "span" : "div";

          data.hName = tagName;
          // data.hProperties = h(tagName, node.attributes).properties;
          data.hProperties = { className: ["tip"] };
        }

        if (node.name === "warning") {
          const data = node.data || (node.data = {});
          const tagName = node.type === "textDirective" ? "span" : "div";

          data.hName = tagName;
          data.hProperties = { className: ["warning"] };
        }
      }
    });
  };
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const [post]: any = await getPosts({
    file: params.slug,
    fields: [
      "title",
      "description",
      "date",
      "slug",
      "author",
      "content",
      "ogImage",
      "coverImage",
      "date",
      "tag",
      "readingTime",
    ],
  });

  // const content = await serialize(post.content, {
  //   mdxOptions: {
  //     rehypePlugins: [rehypeHighlight],
  //     remarkPlugins: [remarkDirective, myRemarkPlugin],
  //   },
  // });
  // console.log(post.content);
  // console.log(mdxcontent);
  const content = await markdownToHtml(post.content || "");
  return {
    props: {
      post: {
        ...post,
      },
      content,
    },
  };
}

export async function getStaticPaths() {
  const posts: any = await getPosts({ fields: ["slug"] });
  let paths = [];
  // console.log(posts);

  for (let i in posts) {
    const post = posts[i];

    paths.push({
      params: {
        slug: post.slug,
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
}
