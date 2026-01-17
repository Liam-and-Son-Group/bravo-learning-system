/**
 * Custom Audio Node for Lexical Editor
 * Renders audio players as decorators that can be displayed in the editor
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

export type SerializedAudioNode = Spread<
  {
    src: string;
  },
  SerializedLexicalNode
>;

function convertAudioElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLAudioElement) {
    const src =
      domNode.getAttribute("src") ||
      domNode.querySelector("source")?.getAttribute("src") ||
      "";
    if (src) {
      const node = $createAudioNode({ src });
      return { node };
    }
  }
  return null;
}

export class AudioNode extends DecoratorNode<ReactElement> {
  __src: string;

  static getType(): string {
    return "audio";
  }

  static clone(node: AudioNode): AudioNode {
    return new AudioNode(node.__src, node.__key);
  }

  static importJSON(serializedNode: SerializedAudioNode): AudioNode {
    const { src } = serializedNode;
    return $createAudioNode({ src });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      audio: () => ({
        conversion: convertAudioElement,
        priority: 0,
      }),
    };
  }

  constructor(src: string, key?: NodeKey) {
    super(key);
    this.__src = src;
  }

  exportJSON(): SerializedAudioNode {
    return {
      type: "audio",
      version: 1,
      src: this.__src,
    };
  }

  exportDOM(): DOMExportOutput {
    const audio = document.createElement("audio");
    audio.setAttribute("controls", "true");
    audio.style.width = "100%";
    audio.style.margin = "8px 0";

    const source = document.createElement("source");
    source.setAttribute("src", this.__src);
    audio.appendChild(source);

    return { element: audio };
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
      <audio
        controls
        style={{
          width: "100%",
          margin: "8px 0",
        }}
      >
        <source src={this.__src} />
        Your browser does not support audio.
      </audio>
    );
  }
}

export function $createAudioNode({ src }: { src: string }): AudioNode {
  return new AudioNode(src);
}

export function $isAudioNode(
  node: LexicalNode | null | undefined
): node is AudioNode {
  return node instanceof AudioNode;
}
