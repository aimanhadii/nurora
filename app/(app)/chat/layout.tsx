import type { Metadata } from "next";

// A title template only reaches one level down, so the chat pages beneath
// this layout ("New chat") need it repeated here to get "· Nurora".
export const metadata: Metadata = { title: { default: "Chat", template: "%s · Nurora" } };

export default function ChatLayout({ children }: LayoutProps<"/chat">) {
  return children;
}
