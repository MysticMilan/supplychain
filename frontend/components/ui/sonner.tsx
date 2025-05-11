"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className: '!rounded-md !border !shadow-md !py-2 !px-3 !text-sm',
        classNames: {
          success: '!bg-green-50 !border-green-200 !text-green-800',
          error: '!bg-red-50 !border-red-200 !text-red-800',
          default: '!bg-white !border-gray-200 !text-gray-800'
        },
        duration: 2500
      }}
      {...props}
    />
  )
}

export { Toaster }
