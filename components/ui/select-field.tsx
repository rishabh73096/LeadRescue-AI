"use client";

import { Children, Fragment, isValidElement, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type ComponentProps, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option { value: string; label: string; disabled?: boolean }

const text = (node: ReactNode): string => (typeof node === "string" || typeof node === "number" ? String(node) : Array.isArray(node) ? node.map(text).join("") : isValidElement<{ children?: ReactNode }>(node) ? text(node.props.children) : "");

function collect(children: ReactNode): Option[] {
  const out: Option[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<{ value?: string | number; disabled?: boolean; children?: ReactNode }>(child)) return;
    if (child.type === "option") out.push({ value: String(child.props.value ?? text(child.props.children)), label: text(child.props.children), disabled: child.props.disabled });
    else if (child.type === Fragment || child.type === "optgroup" || child.props.children) out.push(...collect(child.props.children));
  });
  return out;
}

const WRAPPER_CLASS = /^(?:[a-z0-9-]+:)*(?:w|min-w|max-w|flex|shrink|grow|m[trblxy]?|col|row|self)-/;

type Props = Omit<ComponentProps<"select">, "value" | "onChange" | "children" | "multiple"> & { icon?: LucideIcon; value?: string; onChange?: (e: ChangeEvent<HTMLSelectElement>) => void; children?: ReactNode; searchable?: boolean };

export function SelectField({ icon: Icon, className, children, value = "", onChange, onBlur, disabled, id, name, searchable, ...aria }: Props) {
  const options = useMemo(() => collect(children), [children]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState("");
  const [rect, setRect] = useState<{ left: number; top: number; width: number; up: boolean } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const listId = useId();

  const tokens = (className ?? "").split(/\s+/).filter(Boolean);
  const wrapperClass = tokens.filter((t) => WRAPPER_CLASS.test(t)).join(" ");
  const triggerClass = tokens.filter((t) => !WRAPPER_CLASS.test(t)).join(" ");
  const showSearch = searchable ?? options.length > 8;
  const visible = filter ? options.filter((o) => o.label.toLowerCase().includes(filter.toLowerCase())) : options;
  const selected = options.find((o) => o.value === value);

  const close = () => {
    setOpen(false);
    setFilter("");
  };
  const pick = (o: Option) => {
    if (o.disabled) return;
    onChange?.({ target: { value: o.value, name }, currentTarget: { value: o.value, name }, type: "change" } as unknown as ChangeEvent<HTMLSelectElement>);
    close();
    trigger.current?.focus();
  };
  const openMenu = () => {
    const r = trigger.current?.getBoundingClientRect();
    if (!r) return;
    const room = window.innerHeight - r.bottom;
    setRect({ left: r.left, top: room < 300 && r.top > room ? r.top : r.bottom, width: r.width, up: room < 300 && r.top > room });
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menu.current?.contains(t) && !trigger.current?.contains(t)) close();
    };
    const reposition = (e: Event) => {
      if (menu.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("mousedown", outside);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  useEffect(() => {
    if (open) menu.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openMenu(); }
      return;
    }
    const step = (d: number) => setActive((i) => { for (let n = 1; n <= visible.length; n++) { const j = (i + d * n + visible.length) % visible.length; if (!visible[j]?.disabled) return j; } return i; });
    if (e.key === "ArrowDown") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(visible.length - 1); }
    else if (e.key === "Enter" || (e.key === " " && !showSearch)) { e.preventDefault(); if (visible[active]) pick(visible[active]); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); trigger.current?.focus(); }
    else if (e.key === "Tab") close();
    else if (!showSearch && e.key.length === 1) {
      const i = visible.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
    }
  };

  return (
    <div className={cn("relative", wrapperClass)}>
      {Icon ? <Icon className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-slate-500" /> : null}
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={trigger}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={aria["aria-label"]}
        aria-invalid={aria["aria-invalid"]}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onKeyDown}
        onBlur={onBlur as React.FocusEventHandler<HTMLButtonElement> | undefined}
        className={cn("flex h-12 w-full items-center justify-between gap-2 rounded-lg border border-transparent bg-[#ebf8f3] pr-3 text-left text-sm text-slate-800 outline-none transition-colors focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 disabled:opacity-60 aria-invalid:border-destructive", Icon ? "pl-11" : "pl-4", open && "border-brand bg-white ring-3 ring-brand/20", triggerClass)}
      >
        <span className={cn("truncate", !selected && "text-slate-400")}>{selected?.label ?? "Select"}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-slate-500 transition-transform", open && "rotate-180")} />
      </button>

      {open && rect && typeof document !== "undefined"
        ? createPortal(
            <div ref={menu} style={{ position: "fixed", left: rect.left, width: Math.max(rect.width, 160), ...(rect.up ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.top + 6 }) }} className="z-[100] overflow-hidden rounded-xl bg-white text-sm text-slate-800 shadow-2xl ring-1 ring-slate-200">
              {showSearch ? (
                <div className="relative border-b border-slate-100 p-2">
                  <Search className="pointer-events-none absolute top-1/2 left-4.5 size-3.5 -translate-y-1/2 text-slate-400" />
                  <input autoFocus value={filter} onChange={(e) => { setFilter(e.target.value); setActive(0); }} onKeyDown={onKeyDown} placeholder="Search…" aria-label="Filter options" className="h-9 w-full rounded-lg bg-[#ebf8f3] pr-3 pl-8 text-xs outline-none placeholder:text-slate-500" />
                </div>
              ) : null}
              <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto p-1">
                {visible.length === 0 ? <li className="px-3 py-6 text-center text-xs text-slate-400">No matches</li> : null}
                {visible.map((o, i) => {
                  const on = o.value === value;
                  return (
                    <li key={`${o.value}-${i}`} role="option" aria-selected={on} aria-disabled={o.disabled} data-index={i} onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(o)} className={cn("flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2", i === active && "bg-[#ebf8f3]", on && "font-semibold text-[#4338ca]", o.disabled && "cursor-not-allowed opacity-40")}>
                      <span className="truncate">{o.label}</span>
                      {on ? <Check className="size-3.5 shrink-0" strokeWidth={3} /> : null}
                    </li>
                  );
                })}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
