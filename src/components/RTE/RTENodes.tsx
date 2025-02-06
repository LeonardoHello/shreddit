import { useEditorState, type Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  SquareCode,
} from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function RTENodes({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    // This function will be called every time the editor state changes
    selector: ({ editor }: { editor: Editor }) => ({
      isHeading1: editor.isActive("heading", { level: 1 }),
      isHeading2: editor.isActive("heading", { level: 2 }),
      isBulletList: editor.isActive("bulletList"),
      isOrderedList: editor.isActive("orderedList"),
      isBlockquote: editor.isActive("blockquote"),
      isCodeBlock: editor.isActive("codeBlock"),
    }),
  });

  return (
    <ToggleGroup
      type="multiple"
      value={[
        editorState.isHeading1 ? "heading1" : "",
        editorState.isHeading2 ? "heading2" : "",
        editorState.isBulletList ? "bulletList" : "",
        editorState.isOrderedList ? "orderedList" : "",
        editorState.isBlockquote ? "blockquote" : "",
        editorState.isCodeBlock ? "codeBlock" : "",
      ]}
    >
      <ToggleGroupItem
        value="heading1"
        aria-label="Toggle heading 1"
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="heading2"
        aria-label="Toggle heading 2"
        disabled={
          !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="bulletList"
        aria-label="Toggle bullet list"
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="orderedList"
        aria-label="Toggle ordered list"
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="blockquote"
        aria-label="Toggle blockquote"
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="codeBlock"
        aria-label="Toggle code block"
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <SquareCode />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
