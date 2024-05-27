import Header from "@/components/Header";
import style from "./index.module.scss";
import classnames from "classnames/bind";
import PostList from "@/components/PostList";
import { getPosts } from "../lib/api";
import PostType from "@/interfaces/post";
import Section from "@/components/Section";
import CustomHead from "@/components/CustomHead";

const cx = classnames.bind(style);

interface HomeProps {
  allPosts: PostType[];
}

export default function Home({ allPosts }: HomeProps) {
  return (
    <>
      <CustomHead type="home" />
      <main className={cx("container")}>
        <Header />
        <div className={cx("content")}>
          <Section title="Posts" moreLink="/posts/1">
            <PostList postList={allPosts}></PostList>
          </Section>
        </div>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const allPosts = await getPosts({
    fields: ["title", "date", "slug", "author", "coverImage", "description", "ogImage", "tag", "readingTime"],
    count: 10,
  });
  return {
    props: { allPosts },
  };
};
