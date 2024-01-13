import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Comment } from "@/lib/db/schema";

export default function CommentContent({ text }: { text: Comment["text"] }) {
  const editor = useEditor({
    content: text,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-zinc prose-invert max-w-none focus:outline-none",
      },
    },
    extensions: [
      StarterKit,
      CharacterCount.configure({ limit: 255 }),
      Placeholder.configure({
        placeholder: "What are your thoughts?",
      }),
    ],
    editable: false,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
