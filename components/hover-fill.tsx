import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

export const HOVER_FILL_DURATION_CLASS: string = "duration-[1200ms]";
export const HOVER_FILL_EASING_CLASS: string = "ease-in-out";

export const HOVER_FILL_LAYER_BASE_CLASS: string = `pointer-events-none absolute left-1/2 top-full z-0 aspect-square w-[250%] -translate-x-1/2 translate-y-0 rounded-full bg-white transition-transform ${HOVER_FILL_DURATION_CLASS} ${HOVER_FILL_EASING_CLASS}`;

export const HOVER_FILL_CONTENT_CLASS: string = `relative z-10 inline-flex items-center leading-none transition-colors ${HOVER_FILL_DURATION_CLASS} ${HOVER_FILL_EASING_CLASS} group-hocus:text-black`;

type HoverFillInternalProp =
  | "as"
  | "className"
  | "contentClassName"
  | "children";

const HOVER_FILL_INTERNAL_PROPS: ReadonlySet<string> = new Set([
  "as",
  "className",
  "contentClassName",
  "children",
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

interface HoverFillOverlayProps {
  readonly groupName?: string;
}

export function HoverFillOverlay({
  groupName,
}: HoverFillOverlayProps): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={`${HOVER_FILL_LAYER_BASE_CLASS} ${getHoverFillHoverClass(groupName)}`}
    />
  );
}

interface HoverFillBaseProps {
  readonly className?: string;
  readonly contentClassName?: string;
  readonly children: ReactNode;
}

type HoverFillAnchorProps = HoverFillBaseProps &
  ComponentPropsWithoutRef<"a"> & {
    readonly as?: "a";
  };

type HoverFillButtonProps = HoverFillBaseProps &
  ComponentPropsWithoutRef<"button"> & {
    readonly as: "button";
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
  const { className = "", contentClassName = "", children } = props;
  const baseClassName: string = `group relative inline-flex items-center justify-center overflow-hidden ${className}`;

  if (props.as === "button") {
    const rest = omitHoverFillInternalProps(props);

    return (
      <button
        type="button"
        className={baseClassName}
        data-scroll-hover=""
        {...rest}
      >
        <HoverFillOverlay />
        <span className={`${HOVER_FILL_CONTENT_CLASS} ${contentClassName}`}>
          {children}
        </span>
      </button>
    );
  }

  if (props.as === "link") {
    const rest = omitHoverFillInternalProps(props);

    return (
      <Link className={baseClassName} data-scroll-hover="" {...rest}>
        <HoverFillOverlay />
        <span className={`${HOVER_FILL_CONTENT_CLASS} ${contentClassName}`}>
          {children}
        </span>
      </Link>
    );
  }

  const rest = omitHoverFillInternalProps(props);

  return (
    <a className={baseClassName} data-scroll-hover="" {...rest}>
      <HoverFillOverlay />
      <span className={`${HOVER_FILL_CONTENT_CLASS} ${contentClassName}`}>
        {children}
      </span>
    </a>
  );
}
