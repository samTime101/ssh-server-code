import { useCallback, useEffect, useRef, useState, type RefCallback } from "react";

const OVERFLOW_THRESHOLD_PX = 2;

export type ScrollOverflowState = {
  canScrollUp: boolean;
  canScrollDown: boolean;
};

const INITIAL_STATE: ScrollOverflowState = { canScrollUp: false, canScrollDown: false };

export const useScrollOverflow = (): [RefCallback<HTMLElement | null>, ScrollOverflowState] => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [state, setState] = useState<ScrollOverflowState>(INITIAL_STATE);
  const frameRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    if (!element) {
      setState((prev) => (prev.canScrollUp || prev.canScrollDown ? INITIAL_STATE : prev));
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = element;
    const maxScroll = scrollHeight - clientHeight;
    const canScrollUp = scrollTop > OVERFLOW_THRESHOLD_PX;
    const canScrollDown = maxScroll - scrollTop > OVERFLOW_THRESHOLD_PX;

    setState((prev) =>
      prev.canScrollUp === canScrollUp && prev.canScrollDown === canScrollDown
        ? prev
        : { canScrollUp, canScrollDown }
    );
  }, [element]);

  const scheduleMeasure = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    if (!element) {
      setState((prev) => (prev.canScrollUp || prev.canScrollDown ? INITIAL_STATE : prev));
      return;
    }

    measure();

    element.addEventListener("scroll", scheduleMeasure, { passive: true });

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(element);

    const mutationObserver = new MutationObserver(scheduleMeasure);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      element.removeEventListener("scroll", scheduleMeasure);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [element, measure, scheduleMeasure]);

  return [setElement, state];
};
