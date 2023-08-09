"use client";
import { Switch } from "@headlessui/react";

type ToggleProps = {
  enabledIcon: JSX.Element;
  disabledIcon: JSX.Element;
  enabledBackgroundStyle: string;
  disabledBackgroundStyle: string;
  isEnabled: boolean;
  onChange: (isEnabled: boolean) => void;
};

export default function Toggle({
  enabledIcon,
  disabledIcon,
  enabledBackgroundStyle,
  disabledBackgroundStyle,
  isEnabled,
  onChange,
}: ToggleProps) {
  return (
    <Switch
      checked={isEnabled}
      onChange={onChange}
      className={`${
        isEnabled ? enabledBackgroundStyle : disabledBackgroundStyle
      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={`${
          isEnabled ? "translate-x-5" : "translate-x-0"
        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
      >
        <span
          className={`${
            isEnabled
              ? "opacity-0 ease-out duration-100"
              : "opacity-100 ease-in duration-200"
          } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
          {disabledIcon}
        </span>
        <span
          className={`${
            isEnabled
              ? "opacity-100 ease-in duration-200"
              : "opacity-0 ease-out duration-100"
          } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
          {enabledIcon}
        </span>
      </span>
    </Switch>
  );
}
