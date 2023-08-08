"use client";
import React, { PropsWithChildren, useEffect, useState } from "react";

const getSystemDefaultThemePreference = (): "dark" | "light" => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

export const ThemeContext = React.createContext<
  ["dark" | "light", (theme: "dark" | "light") => void]
>([
  getSystemDefaultThemePreference(),
  () => {
    return;
  },
]);

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  useEffect(() => {
    setTheme(getSystemDefaultThemePreference());
  }, []);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
