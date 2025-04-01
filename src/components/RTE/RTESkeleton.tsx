import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
  SquareCode,
  Strikethrough,
} from "lucide-react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function RTESkeleton({
  content,
  isSubmitPage = false,
}: {
  content?: string | TrustedHTML;
  isSubmitPage?: boolean;
}) {
  return (
    <div className="bg-card rounded-lg border">
      <RTEButtons />

      <div
        className="prose prose-sm prose-zinc prose-invert min-h-[8rem] max-w-none px-4 py-2 focus:outline-hidden"
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
      />

      {!isSubmitPage && (
        <div className="flex justify-end gap-2 p-2">
          <Button
            size="sm"
            variant="secondary"
            disabled
            className="rounded-full"
          >
            Clear
          </Button>

          <Button size="sm" disabled className="rounded-full">
            <Loader2 className="size-4 animate-spin" />
          </Button>
        </div>
      )}
    </div>
  );
}

function RTEButtons() {
  return (
    <div className="hidden flex-wrap items-center gap-2 p-1 sm:flex">
      <ToggleGroup type="multiple" disabled>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <Bold />
        </ToggleGroupItem>

        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <Italic />
        </ToggleGroupItem>

        <ToggleGroupItem value="strike" aria-label="Toggle strike">
          <Strikethrough />
        </ToggleGroupItem>

        <ToggleGroupItem value="code" aria-label="Toggle code">
          <Code />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="h-5" />

      <ToggleGroup type="multiple" disabled>
        <ToggleGroupItem value="heading1" aria-label="Toggle heading 1">
          <Heading1 />
        </ToggleGroupItem>

        <ToggleGroupItem value="heading2" aria-label="Toggle heading 2">
          <Heading2 />
        </ToggleGroupItem>

        <ToggleGroupItem value="bulletList" aria-label="Toggle bullet list">
          <List />
        </ToggleGroupItem>

        <ToggleGroupItem value="orderedList" aria-label="Toggle ordered list">
          <ListOrdered />
        </ToggleGroupItem>

        <ToggleGroupItem value="blockquote" aria-label="Toggle blockquote">
          <Quote />
        </ToggleGroupItem>

        <ToggleGroupItem value="codeBlock" aria-label="Toggle code block">
          <SquareCode />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
