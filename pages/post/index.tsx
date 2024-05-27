import { useRouter } from "next/router";
import { getPosts } from "@/lib/api";
import Header from "@/components/Header";
import style from "./posts.module.scss";
import classnames from "classnames/bind";
import PostList from "@/components/PostList";
import SectionTitle from "@/components/SectionTitle";
import PostType from "@/interfaces/post";
import CustomHead from "@/components/CustomHead";
import { SITE_NAME } from "@/lib/constants";

const cx = classnames.bind(style);

type Props = {
  posts: PostType[];
  morePosts: PostType[];
  preview?: boolean;
};

export default function Post({ posts }: Props) {
  const router = useRouter();
  const title = `${SITE_NAME} | Post`;
  // if (!router.isFallback && !project?.slug) {
  //   return <ErrorPage statusCode={404} />;
  // }
  return (
    <>
      {router.isFallback ? (
        " Loading…"
      ) : (
        <>
          <CustomHead type="home" />
          <div className={cx("container", "-list")}>
            <Header />
            <div className={cx("inner")}>
              <article>
                <SectionTitle title="Posts"></SectionTitle>
                <div className={cx("project_list")}>
                  <PostList postList={posts}></PostList>
                </div>
              </article>
            </div>
          </div>
        </>
      )}
    </>
  );
}

type Params = {
  params: {
    slug: string;
  };
  query: {
    page: string;
  };
};

export async function getStaticProps(props: any) {
  console.log(props);
  const allPosts = await getPosts({
    fields: ["title", "date", "slug", "author", "coverImage", "description", "ogImage", "tag", "readingTime"],
  });
  return {
    props: {
      posts: allPosts,
    },
  };
}
