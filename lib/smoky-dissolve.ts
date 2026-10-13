// Fades an element out like smoke (soft blur + slight grow), then calls onComplete.
export function dissolve(el: HTMLElement, { onComplete }: { onComplete: () => void }) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onComplete();
  const run = el.animate(
    [
      { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
      { opacity: 0, filter: "blur(10px)", transform: "scale(1.06)" },
    ],
    { duration: 260, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" },
  );
  run.onfinish = onComplete;
}
