import { type Editor } from "@tiptap/react";

import cn from "@/lib/utils/cn";

export default function RTEButtons({
  children,
  editor,
}: {
  children?: React.ReactNode;
  editor: Editor;
}) {
  return (
    <div className="hidden flex-wrap gap-2 lg:flex">
      <RTEButtonsInline editor={editor} />
      <div className="h-4 w-px self-center bg-zinc-700/70" />
      <RTEButtonsNode editor={editor} />
      <div className="h-4 w-px self-center bg-zinc-700/70" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={cn(
            "p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70",
            { "opacity-30": !editor.can().chain().focus().undo().run() },
          )}
          title="Undo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M5.82843 6.99955L8.36396 9.53509L6.94975 10.9493L2 5.99955L6.94975 1.0498L8.36396 2.46402L5.82843 4.99955H13C17.4183 4.99955 21 8.58127 21 12.9996C21 17.4178 17.4183 20.9996 13 20.9996H4V18.9996H13C16.3137 18.9996 19 16.3133 19 12.9996C19 9.68584 16.3137 6.99955 13 6.99955H5.82843Z"
              fill="#71717a"
            />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={cn(
            "p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70",
            { "opacity-30": !editor.can().chain().focus().redo().run() },
          )}
          title="Redo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M18.1716 6.99955H11C7.68629 6.99955 5 9.68584 5 12.9996C5 16.3133 7.68629 18.9996 11 18.9996H20V20.9996H11C6.58172 20.9996 3 17.4178 3 12.9996C3 8.58127 6.58172 4.99955 11 4.99955H18.1716L15.636 2.46402L17.0503 1.0498L22 5.99955L17.0503 10.9493L15.636 9.53509L18.1716 6.99955Z"
              fill="#71717a"
            />
          </svg>
        </button>
      </div>
      {children}
    </div>
  );
}

export function RTEButtonsInline({ editor }: { editor: Editor }) {
  const setActive = (name: string, attributes?: {} | undefined) =>
    cn({
      "#d4d4d8": editor.isActive(name, attributes),
      "#71717a": !editor.isActive(name, attributes),
    });

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn(
          "p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70",
          { "opacity-30": !editor.can().chain().focus().toggleBold().run() },
        )}
        title="Bold"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M8 11H12.5C13.8807 11 15 9.88071 15 8.5C15 7.11929 13.8807 6 12.5 6H8V11ZM18 15.5C18 17.9853 15.9853 20 13.5 20H6V4H12.5C14.9853 4 17 6.01472 17 8.5C17 9.70431 16.5269 10.7981 15.7564 11.6058C17.0979 12.3847 18 13.837 18 15.5ZM8 13V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H8Z"
            fill={setActive("bold")}
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn(
          "p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "opacity-30": !editor.can().chain().focus().toggleItalic().run(),
          },
        )}
        title="Italic"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M15 20H7V18H9.92661L12.0425 6H9V4H17V6H14.0734L11.9575 18H15V20Z"
            fill={setActive("italic")}
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn(
          "p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70",
          {
            "opacity-30": !editor.can().chain().focus().toggleStrike().run(),
          },
        )}
        title="Strike"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M17.1538 14C17.3846 14.5161 17.5 15.0893 17.5 15.7196C17.5 17.0625 16.9762 18.1116 15.9286 18.867C14.8809 19.6223 13.4335 20 11.5862 20C9.94674 20 8.32335 19.6185 6.71592 18.8555V16.6009C8.23538 17.4783 9.7908 17.917 11.3822 17.917C13.9333 17.917 15.2128 17.1846 15.2208 15.7196C15.2208 15.0939 15.0049 14.5598 14.5731 14.1173C14.5339 14.0772 14.4939 14.0381 14.4531 14H3V12H21V14H17.1538ZM13.076 11H7.62908C7.4566 10.8433 7.29616 10.6692 7.14776 10.4778C6.71592 9.92084 6.5 9.24559 6.5 8.45207C6.5 7.21602 6.96583 6.165 7.89749 5.299C8.82916 4.43299 10.2706 4 12.2219 4C13.6934 4 15.1009 4.32808 16.4444 4.98426V7.13591C15.2448 6.44921 13.9293 6.10587 12.4978 6.10587C10.0187 6.10587 8.77917 6.88793 8.77917 8.45207C8.77917 8.87172 8.99709 9.23796 9.43293 9.55079C9.86878 9.86362 10.4066 10.1135 11.0463 10.3004C11.6665 10.4816 12.3431 10.7148 13.076 11H13.076Z"
            fill={setActive("strike")}
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={cn(
          "p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70",
          { "opacity-30": !editor.can().chain().focus().toggleCode().run() },
        )}
        title="Code"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M16.95 8.46451L18.3642 7.05029L23.3139 12L18.3642 16.9498L16.95 15.5356L20.4855 12L16.95 8.46451ZM7.05048 8.46451L3.51495 12L7.05048 15.5356L5.63627 16.9498L0.686523 12L5.63627 7.05029L7.05048 8.46451Z"
            fill={setActive("code")}
          />
        </svg>
      </button>
    </div>
  );
}

export function RTEButtonsNode({ editor }: { editor: Editor }) {
  const setActive = (name: string, attributes?: {} | undefined) =>
    cn({
      "#d4d4d8": editor.isActive(name, attributes),
      "#71717a": !editor.isActive(name, attributes),
    });

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70"
        title="Heading 1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M13 20H11V13H4V20H2V4H4V11H11V4H13V20ZM21.0005 8V20H19.0005L19 10.204L17 10.74V8.67L19.5005 8H21.0005Z"
            fill={setActive("heading", { level: 1 })}
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70"
        title="Heading 2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M4 4V11H11V4H13V20H11V13H4V20H2V4H4ZM18.5 8C20.5711 8 22.25 9.67893 22.25 11.75C22.25 12.6074 21.9623 13.3976 21.4781 14.0292L21.3302 14.2102L18.0343 18H22V20H15L14.9993 18.444L19.8207 12.8981C20.0881 12.5908 20.25 12.1893 20.25 11.75C20.25 10.7835 19.4665 10 18.5 10C17.5818 10 16.8288 10.7071 16.7558 11.6065L16.75 11.75H14.75C14.75 9.67893 16.4289 8 18.5 8Z"
            fill={setActive("heading", { level: 2 })}
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70"
        title="Bullet List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
          className="p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"
            fill={setActive("bulletList")}
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70"
        title="Ordered List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
          className="p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M8 4H21V6H8V4ZM5 3V6H6V7H3V6H4V4H3V3H5ZM3 14V11.5H5V11H3V10H6V12.5H4V13H6V14H3ZM5 19.5H3V18.5H5V18H3V17H6V21H3V20H5V19.5ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"
            fill={setActive("orderedList")}
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className="p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70"
        title="Blockquote"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M19.4167 6.67891C20.4469 7.77257 21.0001 9 21.0001 10.9897C21.0001 14.4891 18.5436 17.6263 14.9695 19.1768L14.0768 17.7992C17.4121 15.9946 18.0639 13.6539 18.3245 12.178C17.7875 12.4557 17.0845 12.5533 16.3954 12.4895C14.591 12.3222 13.1689 10.8409 13.1689 9C13.1689 7.067 14.7359 5.5 16.6689 5.5C17.742 5.5 18.7681 5.99045 19.4167 6.67891ZM9.41669 6.67891C10.4469 7.77257 11.0001 9 11.0001 10.9897C11.0001 14.4891 8.54359 17.6263 4.96951 19.1768L4.07682 17.7992C7.41206 15.9946 8.06392 13.6539 8.32447 12.178C7.78747 12.4557 7.08452 12.5533 6.39539 12.4895C4.59102 12.3222 3.16895 10.8409 3.16895 9C3.16895 7.067 4.73595 5.5 6.66895 5.5C7.742 5.5 8.76814 5.99045 9.41669 6.67891Z"
            fill={setActive("blockquote")}
          />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className="p-0.5 transition-colors hover:rounded hover:bg-zinc-700/70"
        title="Code Block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          height="24"
          width="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path
            d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM20 12L16.4645 15.5355L15.0503 14.1213L17.1716 12L15.0503 9.87868L16.4645 8.46447L20 12ZM6.82843 12L8.94975 14.1213L7.53553 15.5355L4 12L7.53553 8.46447L8.94975 9.87868L6.82843 12ZM11.2443 17H9.11597L12.7557 7H14.884L11.2443 17Z"
            fill={setActive("codeBlock")}
          />
        </svg>
      </button>
    </div>
  );
}
