import { useEffect, useRef, useState } from "react";

interface Props {
  items: { label: string; action: () => void }[];
  children: JSX.Element;
}

export function SimpleMenu({ items, children }: Props) {
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
      <button ref={buttonRef} onClick={toggleOpen} className="mt-1">
        {children}
      </button>
      <div className="relative">
        {isOpen && (
          <div className="absolute top-1 right-0 z-50">
            <div className="bg-white rounded shadow-md p-1">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => click(item.action)}
                  className="whitespace-nowrap rounded hover:bg-gray-200 px-3 py-1"
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
