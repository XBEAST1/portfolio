"use client";

import Link from "next/link";
import type {
  ComponentPropsWithoutRef,
  PointerEvent,
  ReactElement,
  ReactNode,
  Ref,
  TouchEvent,
} from "react";

export const HOVER_FILL_DURATION_MS = 1200;
export const HOVER_FILL_DURATION_CLASS: string = "duration-[1200ms]";
export const HOVER_FILL_EASING_CLASS: string = "ease-in-out";
export type HoverFillState = "auto" | "filled" | "unfilled";
export type HoverFillVariant = "default" | "icon";

const HOVER_FILL_TRANSLATE_X_CLASS = "-translate-x-1/2";

const HOVER_FILL_LAYER_SHARED_CLASS: string = `pointer-events-none absolute left-1/2 top-full z-0 aspect-square ${HOVER_FILL_TRANSLATE_X_CLASS} translate-y-0 rounded-full bg-white transition-transform ${HOVER_FILL_DURATION_CLASS} ${HOVER_FILL_EASING_CLASS}`;

export const HOVER_FILL_LAYER_BASE_CLASS: string = `${HOVER_FILL_LAYER_SHARED_CLASS} w-[250%]`;

export const HOVER_FILL_LAYER_ICON_CLASS: string = `${HOVER_FILL_LAYER_SHARED_CLASS} w-[250%]`;

function getHoverFillLayerClass(variant: HoverFillVariant): string {
  return variant === "icon"
    ? HOVER_FILL_LAYER_ICON_CLASS
    : HOVER_FILL_LAYER_BASE_CLASS;
}

export const HOVER_FILL_CONTENT_CLASS: string = `relative z-10 inline-flex items-center leading-none transition-colors ${HOVER_FILL_DURATION_CLASS} ${HOVER_FILL_EASING_CLASS} group-hocus:text-black`;

type HoverFillInternalProp =
  | "as"
  | "className"
  | "contentClassName"
  | "children"
  | "fillState"
  | "variant";

const HOVER_FILL_INTERNAL_PROPS: ReadonlySet<string> = new Set([
  "as",
  "className",
  "contentClassName",
  "children",
  "fillState",
  "variant",
]);

function omitHoverFillInternalProps<TProps extends HoverFillProps>(
  props: TProps,
): Omit<TProps, HoverFillInternalProp> {
  return Object.fromEntries(
    Object.entries(props).filter(
      ([key]: [string, unknown]): boolean =>
        !HOVER_FILL_INTERNAL_PROPS.has(key),
    ),
  ) as Omit<TProps, HoverFillInternalProp>;
}

export function getHoverFillHoverClass(groupName?: string): string {
  if (groupName === "icon") {
    return "group-hocus-icon:-translate-y-[88%]";
  }

  return "group-hocus:-translate-y-[88%]";
}

function getOverlayTransformClass(
  fillState: HoverFillState,
  groupName?: string,
): string {
  switch (fillState) {
    case "unfilled":
      return `${HOVER_FILL_TRANSLATE_X_CLASS} !translate-y-0`;
    case "filled":
      return `${HOVER_FILL_TRANSLATE_X_CLASS} !-translate-y-[88%]`;
    default:
      return getHoverFillHoverClass(groupName);
  }
}

function getContentFillClass(fillState: HoverFillState): string {
  switch (fillState) {
    case "unfilled":
      return "!text-white";
    case "filled":
      return "!text-black";
    default:
      return "";
  }
}

interface HoverFillOverlayProps {
  readonly fillState?: HoverFillState;
  readonly groupName?: string;
  readonly variant?: HoverFillVariant;
}

export function HoverFillOverlay({
  fillState = "auto",
  groupName,
  variant = "default",
}: HoverFillOverlayProps): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={`${getHoverFillLayerClass(variant)} ${getOverlayTransformClass(fillState, groupName)}`}
    />
  );
}

interface HoverFillBaseProps {
  readonly className?: string;
  readonly contentClassName?: string;
  readonly children: ReactNode;
  readonly fillState?: HoverFillState;
  readonly variant?: HoverFillVariant;
}

type HoverFillPointerType = "touch" | "pen";

interface HoverFillPressHandlers<T extends HTMLElement = HTMLElement> {
  onTouchStart?: (event: TouchEvent<T>) => void;
  onTouchEnd?: (event: TouchEvent<T>) => void;
  onTouchCancel?: (event: TouchEvent<T>) => void;
  onPointerDown?: (event: PointerEvent<T>) => void;
  onPointerUp?: (event: PointerEvent<T>) => void;
  onPointerCancel?: (event: PointerEvent<T>) => void;
  onPointerLeave?: (event: PointerEvent<T>) => void;
}

function isTouchLikePointer(
  pointerType: string,
): pointerType is HoverFillPointerType {
  return pointerType === "touch" || pointerType === "pen";
}

function setTouchActive(element: HTMLElement): void {
  element.setAttribute("data-touch-active", "true");
}

function clearTouchActive(element: HTMLElement): void {
  element.removeAttribute("data-touch-active");
}

export function getHoverFillTouchHandlers<T extends HTMLElement = HTMLElement>(
  userHandlers: HoverFillPressHandlers<T> = {},
): HoverFillPressHandlers<T> {
  return {
    onTouchStart: (event: TouchEvent<T>): void => {
      setTouchActive(event.currentTarget);
      userHandlers.onTouchStart?.(event);
    },
    onTouchEnd: (event: TouchEvent<T>): void => {
      clearTouchActive(event.currentTarget);
      userHandlers.onTouchEnd?.(event);
    },
    onTouchCancel: (event: TouchEvent<T>): void => {
      clearTouchActive(event.currentTarget);
      userHandlers.onTouchCancel?.(event);
    },
    onPointerDown: (event: PointerEvent<T>): void => {
      if (isTouchLikePointer(event.pointerType)) {
        setTouchActive(event.currentTarget);
      }

      userHandlers.onPointerDown?.(event);
    },
    onPointerUp: (event: PointerEvent<T>): void => {
      if (isTouchLikePointer(event.pointerType)) {
        clearTouchActive(event.currentTarget);
      }

      userHandlers.onPointerUp?.(event);
    },
    onPointerCancel: (event: PointerEvent<T>): void => {
      if (isTouchLikePointer(event.pointerType)) {
        clearTouchActive(event.currentTarget);
      }

      userHandlers.onPointerCancel?.(event);
    },
    onPointerLeave: (event: PointerEvent<T>): void => {
      if (
        isTouchLikePointer(event.pointerType) &&
        event.currentTarget.hasAttribute("data-touch-active")
      ) {
        clearTouchActive(event.currentTarget);
      }

      userHandlers.onPointerLeave?.(event);
    },
  };
}

function getHoverFillRootClassName(
  className: string,
  variant: HoverFillVariant,
): string {
  const variantClassName: string =
    variant === "icon" ? "h-10 w-10 shrink-0 p-0" : "";

  return `group relative inline-flex items-center justify-center overflow-hidden ${variantClassName} ${className}`;
}

type HoverFillAnchorProps = HoverFillBaseProps &
  ComponentPropsWithoutRef<"a"> & {
    readonly as?: "a";
  };

type HoverFillButtonProps = HoverFillBaseProps &
  ComponentPropsWithoutRef<"button"> & {
    readonly as: "button";
    readonly ref?: Ref<HTMLButtonElement>;
  };

type HoverFillLinkProps = HoverFillBaseProps &
  ComponentPropsWithoutRef<typeof Link> & {
    readonly as: "link";
  };

export type HoverFillProps =
  | HoverFillAnchorProps
  | HoverFillButtonProps
  | HoverFillLinkProps;

export function HoverFill(props: HoverFillProps): ReactElement {
  const {
    className = "",
    contentClassName = "",
    children,
    fillState = "auto",
    variant = "default",
  } = props;
  const baseClassName: string = getHoverFillRootClassName(className, variant);
  const contentClass: string = `${HOVER_FILL_CONTENT_CLASS} ${getContentFillClass(fillState)} ${variant === "icon" ? "flex h-full w-full items-center justify-center " : ""}${contentClassName}`;
  if (props.as === "button") {
    const {
      ref,
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
      ...rest
    } = omitHoverFillInternalProps(props);
    const pressHandlers = getHoverFillTouchHandlers({
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
    });

    return (
      <button
        ref={ref}
        type="button"
        className={baseClassName}
        data-scroll-hover=""
        {...pressHandlers}
        {...rest}
      >
        <HoverFillOverlay fillState={fillState} variant={variant} />
        <span className={contentClass}>{children}</span>
      </button>
    );
  }

  if (props.as === "link") {
    const {
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
      ...rest
    } = omitHoverFillInternalProps(props);
    const pressHandlers = getHoverFillTouchHandlers({
      onTouchStart,
      onTouchEnd,
      onTouchCancel,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onPointerLeave,
    });

    return (
      <Link
        className={baseClassName}
        data-scroll-hover=""
        {...pressHandlers}
        {...rest}
      >
        <HoverFillOverlay fillState={fillState} variant={variant} />
        <span className={contentClass}>{children}</span>
      </Link>
    );
  }

  const {
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    ...rest
  } = omitHoverFillInternalProps(props);
  const pressHandlers = getHoverFillTouchHandlers({
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
  });

  return (
    <a
      className={baseClassName}
      data-scroll-hover=""
      {...pressHandlers}
      {...rest}
    >
      <HoverFillOverlay fillState={fillState} variant={variant} />
      <span className={contentClass}>{children}</span>
    </a>
  );
}
