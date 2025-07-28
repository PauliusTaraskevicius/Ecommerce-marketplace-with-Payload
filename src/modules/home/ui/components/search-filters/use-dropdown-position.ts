import { RefObject } from "react";

export function useDropdownPosition(
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) {
  function getDropdownPosition() {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // Width of dropdown (w-60 = 15 rem = 240px)

    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    if (left + dropdownWidth > window.innerWidth) {
      left = rect.right + window.scrollX - dropdownWidth;

      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }

    if (left < 0) {
      left = 16;
    }

    return { top, left };
  }

  return {
    getDropdownPosition,
  };
}
