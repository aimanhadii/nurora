"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from "lucide-react"

import { useResolvedTheme } from "@/lib/theme"

/** Toasts, themed with our tokens. Sits above the phone tab bar. */
const Toaster = (props: ToasterProps) => {
  const theme = useResolvedTheme()

  return (
    <Sonner
      theme={theme}
      position="bottom-center"
      offset={{ bottom: 24 }}
      mobileOffset={{ bottom: "calc(var(--tabbar-h) + 16px)" }}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-brand" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!shadow-lg !text-sm !gap-3",
          actionButton: "!bg-primary !text-primary-foreground !rounded-md !h-8 !px-3 !text-meta !font-medium",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
