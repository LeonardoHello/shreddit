"use client";

import { Check, ImageIcon, LetterText, Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { cn } from "@/lib/cn";
import { PostType } from "@/types/enums";
import RTEPost from "../RTE/RTEPost";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SubmitDropzone from "./SubmitDropzone";

const icons: Record<PostType, React.JSX.Element> = {
  [PostType.TEXT]: <LetterText className="size-6 stroke-[1.5]" />,
  [PostType.IMAGE]: <ImageIcon className="size-6 stroke-[1.5]" />,
};

const maxTitleLength = 300;

export default function SubmitForm() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  return (
    <>
      <div className="relative flex items-center">
        <Input
          placeholder="Title"
          defaultValue={state.title}
          maxLength={maxTitleLength}
          autoComplete="off"
          className="pr-16"
          onChange={(e) => {
            dispatch({
              type: ReducerAction.SET_TITLE,
              title: e.currentTarget.value,
            });
          }}
        />
        <div className="text-2xs text-muted-foreground absolute right-3 font-bold">
          {state.title.length}/{maxTitleLength}
        </div>
      </div>

      <Tabs defaultValue={state.postType}>
        <TabsList className="h-auto w-full">
          {Object.values(PostType).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="grow gap-1.5"
              disabled={state.isLoading || state.isUploading}
              onClick={() => {
                if (state.isLoading || state.isUploading) return;

                dispatch({
                  type: ReducerAction.SET_POST_TYPE,
                  postType: tab,
                });
              }}
            >
              {icons[tab]}
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={PostType.TEXT}>
          <RTEPost />
        </TabsContent>
        <TabsContent value={PostType.IMAGE}>
          <SubmitDropzone />
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-2">
        <Button
          variant={state.spoiler ? "default" : "outline"}
          className={cn("rounded-full font-normal tracking-wide capitalize", {
            "bg-background text-foreground hover:bg-background/90":
              state.spoiler,
          })}
          onClick={() => {
            dispatch({ type: ReducerAction.TOGGLE_SPOILER });
          }}
        >
          {state.spoiler && <Check className="size-6" />}
          {!state.spoiler && <Plus className="size-6" />}
          spoiler
        </Button>

        <Button
          variant={state.nsfw ? "default" : "outline"}
          className={cn("rounded-full font-normal tracking-wide uppercase", {
            "text-background bg-rose-500 hover:bg-rose-500/90": state.nsfw,
          })}
          onClick={() => {
            dispatch({ type: ReducerAction.TOGGLE_NSFW });
          }}
        >
          {state.nsfw && <Check className="size-6" />}
          {!state.nsfw && <Plus className="size-6" />}
          nsfw
        </Button>
      </div>
    </>
  );
}
