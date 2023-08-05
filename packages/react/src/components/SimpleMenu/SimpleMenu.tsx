import { useEffect, useRef, useState } from "react";
import styles from "./SimpleMenu.module.css"; // Import the CSS module

interface Props {
  disabled?: boolean;
  items: { label: string; action: () => void }[];
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
    document.addEventListener("click", () => {
      setIsOpen(false);
    });
  }, []);

  function toggleOpen(event: React.MouseEvent<HTMLButtonElement>) {
    if (event.target !== buttonRef.current) {
      event.stopPropagation();
    }

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
