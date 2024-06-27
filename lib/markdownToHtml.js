import rehypeExternalLinks from "rehype-external-links";
import rehypeDocument from "rehype-document";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import { unified } from "unified";
export default async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeExternalLinks, { target: ["_blank"] })
    .use(rehypeHighlight)
    .use(rehypeDocument)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
