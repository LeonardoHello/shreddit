"use client";

import dynamic from "next/dynamic";

import { Check, ImageIcon, LetterText, Plus } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ReducerAction,
  useSubmitContext,
  useSubmitDispatchContext,
} from "@/context/SubmitContext";
import { PostType } from "@/types";
import { cn } from "@/utils/cn";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const RTEPost = dynamic(() => import("@/components/RTE/RTEPost"));
const SubmitDropzone = dynamic(
  () => import("@/components/submit/SubmitDropzone"),
);

const icons: Record<PostType, React.JSX.Element> = {
  [PostType.TEXT]: <LetterText className="size-6 stroke-[1.5]" />,
  [PostType.IMAGE]: <ImageIcon className="size-6 stroke-[1.5]" />,
};

const maxTitleLength = 300;

export default function SubmitTabs() {
  const state = useSubmitContext();
  const dispatch = useSubmitDispatchContext();

  return (
    <div className="flex flex-col gap-2">
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
        <div className="absolute right-3 text-2xs font-bold text-zinc-500">
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
              disabled={state.isDisabled}
              onClick={() => {
                if (state.isDisabled) return;

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
          className={cn("rounded-full font-normal capitalize tracking-wide", {
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
          className={cn("rounded-full font-normal uppercase tracking-wide", {
            "bg-rose-500 text-background hover:bg-rose-500/90": state.nsfw,
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
    </div>
  );
}
