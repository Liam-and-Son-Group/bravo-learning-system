/**
 * Custom Video Node for Lexical Editor
 * Renders videos as decorators that can be displayed in the editor
 */

import type { ReactElement } from "react";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { DecoratorNode } from "lexical";

export type SerializedVideoNode = Spread<
  {
    src: string;
  },
  SerializedLexicalNode
>;

function convertVideoElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLVideoElement) {
    const src =
      domNode.getAttribute("src") ||
      domNode.querySelector("source")?.getAttribute("src") ||
      "";
    if (src) {
      const node = $createVideoNode({ src });
      return { node };
    }
  }
  return null;
}

export class VideoNode extends DecoratorNode<ReactElement> {
  __src: string;

  static getType(): string {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__src, node.__key);
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const { src } = serializedNode;
    return $createVideoNode({ src });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: () => ({
        conversion: convertVideoElement,
        priority: 0,
      }),
    };
  }

  constructor(src: string, key?: NodeKey) {
    super(key);
    this.__src = src;
  }

  exportJSON(): SerializedVideoNode {
    return {
      type: "video",
      version: 1,
      src: this.__src,
    };
  }

  exportDOM(): DOMExportOutput {
    const video = document.createElement("video");
    video.setAttribute("controls", "true");
    video.style.maxWidth = "100%";
    video.style.height = "auto";
    video.style.display = "block";
    video.style.margin = "8px 0";

    const source = document.createElement("source");
    source.setAttribute("src", this.__src);
    video.appendChild(source);

    return { element: video };
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.style.display = "block";
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactElement {
    return (
      <video
        controls
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "8px 0",
          borderRadius: "4px",
        }}
      >
        <source src={this.__src} />
        Your browser does not support video.
      </video>
    );
  }
}

export function $createVideoNode({ src }: { src: string }): VideoNode {
  return new VideoNode(src);
}

export function $isVideoNode(
  node: LexicalNode | null | undefined
): node is VideoNode {
  return node instanceof VideoNode;
}
