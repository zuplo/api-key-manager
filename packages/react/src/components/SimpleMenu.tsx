import { useEffect, useRef, useState } from "react";

import styles from "./SimpleMenu.module.css";

interface Props {
  disabled?: boolean;
  items: { label: string; action: () => void; icon?: JSX.Element }[];
  children: JSX.Element;
}

export function SimpleMenu({ disabled, items, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function click(action: () => void) {
    setIsOpen(false);
    action();
  }

  useEffect(() => {
    window.addEventListener("click", (e) => {
      // If the click is inside the button, don't close the menu.
      if (buttonRef.current?.contains(e.target as Node)) {
        e.stopPropagation();
        return;
      }
      setIsOpen(false);
    });
  }, []);

  function toggleOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <button
        disabled={disabled}
        ref={buttonRef}
        onClick={toggleOpen}
        className={styles["simple-menu-button"]}
      >
        {children}
      </button>
      <div className={styles["simple-menu-wrapper"]}>
        {isOpen && (
          <div className={styles["simple-menu-dialog"]}>
            <div className={styles["simple-menu-dropdown"]}>
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => click(item.action)}
                  className={styles["simple-menu-item-button"]}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
