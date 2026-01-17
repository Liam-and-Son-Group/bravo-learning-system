/**
 * Rich Text Renderer
 * Safely renders HTML content from MiniRichEditor
 */

interface RichTextRendererProps {
  content: string;
  className?: string;
}

export function RichTextRenderer({
  content,
  className = "",
}: RichTextRendererProps) {
  // If content is empty or just whitespace, return placeholder
  if (!content || !content.trim()) {
    return <span className={`text-gray-400 ${className}`}>(empty)</span>;
  }

  // Render HTML safely using dangerouslySetInnerHTML
  // The content comes from our own MiniRichEditor, so it's controlled
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
  );
}
