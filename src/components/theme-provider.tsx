
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

type CustomThemeProviderProps = ThemeProviderProps & {
  children: React.ReactNode
}

const THEME_STORAGE_KEY = 'vite-ui-theme'

function useTheme() {
    const context = useNextTheme()
    const [font, setFont] = React.useState('sarabun')

    React.useEffect(() => {
        const storedFont = localStorage.getItem(`${THEME_STORAGE_KEY}-font`) || 'sarabun';
        setFont(storedFont)
        document.documentElement.style.setProperty(
            '--font-body',
            `var(--font-${storedFont})`
        );
        document.documentElement.style.setProperty(
            '--font-headline',
            `var(--font-${storedFont})`
        );
    }, [])

    const setFontAndStore = (newFont: string) => {
        setFont(newFont)
        localStorage.setItem(`${THEME_STORAGE_KEY}-font`, newFont)
        document.documentElement.style.setProperty(
            '--font-body',
            `var(--font-${newFont})`
        );
         document.documentElement.style.setProperty(
            '--font-headline',
            `var(--font-${newFont})`
        );
    }
    
    return { ...context, font, setFont: setFontAndStore }
}


function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export { ThemeProvider, useTheme }
