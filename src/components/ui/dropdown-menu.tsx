"use client";
import * as Radix from "@radix-ui/react-dropdown-menu";
import { MoreVertical, Check } from "lucide-react";
import React from "react";

export const DropdownMenu = {
  Root: (props: React.ComponentProps<typeof Radix.Root>) => (
    <Radix.Root {...props} />
  ),
  Trigger: (props: React.ComponentProps<typeof Radix.Trigger>) => (
    <Radix.Trigger asChild {...props}>
      {props.children}
    </Radix.Trigger>
  ),
  TriggerIcon: ({
    className = "w-4 h-4 ml-2 text-gray-500",
  }: {
    className?: string;
  }) => <MoreVertical className={className} />,
  Content: ({
    className = "",
    ...props
  }: React.ComponentProps<typeof Radix.Content>) => (
    <Radix.Content
      sideOffset={6}
      align="end"
      alignOffset={-5}
      collisionPadding={10}
      avoidCollisions={true}
      className={`rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg py-1 w-56 z-50 ${className}`}
      {...props}
    />
  ),
  Item: ({
    children,
    className = "",
    ...props
  }: React.ComponentProps<typeof Radix.Item>) => (
    <Radix.Item
      className={`px-3 py-2 text-sm flex items-center gap-2 cursor-default select-none focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}
      {...props}
    >
      {children}
    </Radix.Item>
  ),
  CheckboxItem: ({
    children,
    checked,
    ...props
  }: React.ComponentProps<typeof Radix.CheckboxItem>) => (
    <Radix.CheckboxItem
      className="px-3 py-2 text-sm flex items-center gap-2"
      checked={checked}
      {...props}
    >
      <Radix.ItemIndicator>
        <Check className="w-3 h-3" />
      </Radix.ItemIndicator>
      {children}
    </Radix.CheckboxItem>
  ),
  Separator: (props: React.ComponentProps<typeof Radix.Separator>) => (
    <Radix.Separator
      className="h-px bg-gray-100 dark:bg-gray-800 my-1"
      {...props}
    />
  ),
  Sub: Radix.Sub,
  SubTrigger: (props: React.ComponentProps<typeof Radix.SubTrigger>) => (
    <Radix.SubTrigger
      className="px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      {...props}
    />
  ),
  SubContent: (props: React.ComponentProps<typeof Radix.SubContent>) => (
    <Radix.SubContent
      className="rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg py-1 w-48"
      {...props}
    />
  ),
};

export default DropdownMenu;
