/**
 * Editor configuration for Mini Rich Text Editor
 */

import { HeadingNode } from "@lexical/rich-text";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { ImageNode } from "./nodes/ImageNode";
import { VideoNode } from "./nodes/VideoNode";
import { AudioNode } from "./nodes/AudioNode";

export const miniEditorConfig = {
  namespace: "MiniRichEditor",
  theme: {
    paragraph: "mb-1",
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
    },
  },
  onError: (error: Error) => {
    console.error(error);
  },
  nodes: [
    HeadingNode,
    LinkNode,
    ListNode,
    ListItemNode,
    ImageNode,
    VideoNode,
    AudioNode,
  ],
};
