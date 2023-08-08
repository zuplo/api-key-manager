"use client";
import { useContext } from "react";
import Toggle from "./Toggle";
import { ThemeContext } from "@/contexts/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemePicker() {
  const [theme, setTheme] = useContext(ThemeContext);
  const handleThemeChange = (useDarkTheme: boolean) => {
    setTheme(useDarkTheme ? "dark" : "light");
  };

  return (
    <Toggle
      isEnabled={theme !== "light"}
      enabledBackgroundStyle="bg-[#3d4eac]"
      disabledBackgroundStyle="bg-gray-200"
      onChange={handleThemeChange}
      enabledIcon={<MoonIcon className="h-4 w-4 text-[#3d4eac]" />}
      disabledIcon={<SunIcon className="h-4 w-4 text-yellow-400" />}
    />
  );
}
