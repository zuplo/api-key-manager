import { cloneElement, useEffect, useRef, useState } from "react";

import styles from "./SimpleMenu.module.css";
import { Consumer, MenuItem } from "..";

interface Props {
  consumer: Consumer;
  disabled?: boolean;
  items: MenuItem[];
  children: JSX.Element;
}

export function SimpleMenu({ consumer, disabled, items, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function click(action: (consumer: Consumer) => void) {
    setIsOpen(false);
    action(consumer);
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
        title={isOpen ? "Close consumer menu" : "Open consumer menu"}
        disabled={disabled}
        ref={buttonRef}
        onClick={toggleOpen}
        id="consumer-menu-button"
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
                  id={`consumer-menu-option-${item.label
                    .toLowerCase()
                    .replace(" ", "-")}`}
                  title={item.label}
                  onClick={() => click(item.action)}
                  className={styles["simple-menu-item-button"]}
                >
                  {item.icon && (
                    <>
                      {cloneElement(item.icon, {
                        className: styles["simple-menu-item-icon"],
                      })}
                    </>
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
