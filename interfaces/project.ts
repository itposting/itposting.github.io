import type Author from "./author";

type Project = {
  slug: string;
  title: string;
  url?: string;
  coverImage?: any;
  youtubeUrl?: string;
  date: string;
  author: Author;
  description: string;
  ogImage: {
    url: string;
  };
  content: string;
};

export default Project;
