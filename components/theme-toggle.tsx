"use client"

import * as React from "react"
import type { JSX } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Laptop, Moon, Sun } from "lucide-react"

export function ThemeToggle(): JSX.Element {
  const { setTheme, theme, systemTheme } = useTheme()
  const resolved = theme === "system" ? systemTheme : theme

  const Icon = resolved === "dark" ? Moon : resolved === "light" ? Sun : Laptop

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Cambia tema">
          <Icon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")} aria-label="Tema chiaro">
          <Sun className="mr-2 h-4 w-4" /> Chiaro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} aria-label="Tema scuro">
          <Moon className="mr-2 h-4 w-4" /> Scuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} aria-label="Tema di sistema">
          <Laptop className="mr-2 h-4 w-4" /> Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


