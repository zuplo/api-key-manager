import { useEffect, useRef, useState } from "react";

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
      <button disabled={disabled} ref={buttonRef} onClick={toggleOpen}>
        {children}
      </button>
      <div className="relative">
        {isOpen && (
          <div className="absolute top-0 right-0 z-50">
            <div className="bg-white text-zinc-800 rounded shadow-md ring-1 ring-zinc-200 p-1">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => click(item.action)}
                  className="whitespace-nowrap rounded w-full hover:bg-slate-50 px-3 py-1 text-right"
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
