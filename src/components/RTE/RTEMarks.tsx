import { useEditorState, type Editor } from "@tiptap/react";
import { Bold, Code, Italic, Strikethrough } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function RTEMarks({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    // This function will be called every time the editor state changes
    selector: ({ editor }: { editor: Editor }) => ({
      isBold: editor.isActive("bold"),
      isItalic: editor.isActive("italic"),
      isStrike: editor.isActive("strike"),
      isCode: editor.isActive("code"),
    }),
  });

  return (
    <ToggleGroup
      type="multiple"
      value={[
        editorState.isBold ? "bold" : "",
        editorState.isItalic ? "italic" : "",
        editorState.isStrike ? "strike" : "",
        editorState.isCode ? "code" : "",
      ]}
    >
      <ToggleGroupItem
        value="bold"
        aria-label="Toggle bold"
        disabled={!editor.can().chain().focus().toggleBold().run()}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="italic"
        aria-label="Toggle italic"
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="strike"
        aria-label="Toggle strike"
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="code"
        aria-label="Toggle code"
        disabled={!editor.can().chain().focus().toggleCode().run()}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
