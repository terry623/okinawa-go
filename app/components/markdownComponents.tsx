"use client";

import { ComponentPropsWithoutRef } from "react";

export const markdownComponents = {
  a: ({ node, ...props }: ComponentPropsWithoutRef<"a"> & { node: any }) => (
    <a {...props} className="text-blue-500 hover:underline" />
  ),
  pre: ({
    node,
    ...props
  }: ComponentPropsWithoutRef<"pre"> & { node: any }) => (
    <pre {...props} className="overflow-auto max-w-full" />
  ),
  code: ({
    node,
    inline,
    ...props
  }: ComponentPropsWithoutRef<"code"> & { node: any; inline?: boolean }) =>
    inline ? (
      <code {...props} className="break-words" />
    ) : (
      <code {...props} className="overflow-x-auto block" />
    ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => {
    return <div className="space-y-1">{children}</div>;
  },
  ul: ({ children }: ComponentPropsWithoutRef<"ul">) => {
    return <div className="space-y-1">{children}</div>;
  },
  ol: ({ children }: ComponentPropsWithoutRef<"ol">) => {
    return <div className="space-y-1">{children}</div>;
  },
};
