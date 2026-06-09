"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import {
  HOVER_FILL_DURATION_MS,
  HoverFill,
  type HoverFillState,
} from "@/components/hover-fill";
import { handleHomeHashLinkClick, scrollToTop } from "@/lib/animation";
import {
  contactSectionHref,
  homeHref,
  navbarBrandName,
  navigationLinks,
} from "@/lib/portfolio-data";

const mainNavLinks = navigationLinks.filter(
  (link): boolean => link.href !== contactSectionHref,
);

export function Navbar(): React.ReactElement {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuFillState, setMenuFillState] = useState<HoverFillState>("auto");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const unfillTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect((): (() => void) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return (): void => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect((): (() => void) => {
    return (): void => {
      if (unfillTimerRef.current !== null) {
        clearTimeout(unfillTimerRef.current);
      }
    };
  }, []);

  const clearStickyHover = (button: HTMLButtonElement | null): void => {
    if (!button) {
      return;
    }

    button.blur();
    button.removeAttribute("data-cursor-hover");
    button.style.pointerEvents = "none";

    requestAnimationFrame((): void => {
      requestAnimationFrame((): void => {
        button.style.pointerEvents = "";
      });
    });
  };

  const animateMenuButtonUnfill = (): void => {
    if (unfillTimerRef.current !== null) {
      clearTimeout(unfillTimerRef.current);
    }

    setMenuFillState("unfilled");
    clearStickyHover(menuButtonRef.current);

    unfillTimerRef.current = setTimeout((): void => {
      unfillTimerRef.current = null;
      setMenuFillState("auto");
      clearStickyHover(menuButtonRef.current);
    }, HOVER_FILL_DURATION_MS);
  };

  const closeMenu = (): void => {
    setIsOpen(false);
    animateMenuButtonUnfill();
  };

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    closeMenu();

    if (pathname !== homeHref) {
      return;
    }

    event.preventDefault();
    requestAnimationFrame((): void => {
      requestAnimationFrame((): void => {
        scrollToTop();
      });
    });
  };

  const handleHashLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ): void => {
    closeMenu();
    handleHomeHashLinkClick(event, href, pathname, homeHref);
  };

  return (
    <>
      <nav className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-6">
        <div className="pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/5 bg-zinc-950/40 px-8 py-4 shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)] backdrop-blur-3xl transition-all duration-500 hover:border-white/10 hover:bg-zinc-950/60 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)]">
          <Link
            className="group relative z-10"
            data-scroll-hover=""
            href={homeHref}
            onClick={handleBrandClick}
          >
            <div className="flex items-center gap-1">
              <span className="font-heading text-xl font-black tracking-tighter text-white">
                {navbarBrandName}
                <span className="ml-1 text-xs font-light tracking-widest text-gray-500">
                  / DEV
                </span>
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-12 md:flex">
            {mainNavLinks.map(
              (link): React.ReactElement => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-scroll-hover=""
                  onClick={(e): void => handleHashLinkClick(e, link.href)}
                  className="group relative -mx-3 -my-2 px-3 py-2 text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white opacity-0 shadow-[0_0_10px_white] transition-all duration-300 group-hocus:opacity-100" />
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <HoverFill
                as="link"
                href={contactSectionHref}
                onClick={(e: MouseEvent<HTMLAnchorElement>): void =>
                  handleHashLinkClick(e, contactSectionHref)
                }
                className="rounded-full border border-white/20 bg-transparent px-6 py-2.5 transition-all hover:border-white/60"
                contentClassName="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-colors duration-500 group-hocus:text-black"
              >
                Contact
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hocus:-translate-y-0.5 group-hocus:translate-x-0.5"
                  aria-hidden="true"
                />
              </HoverFill>
            </div>

            <HoverFill
              ref={menuButtonRef}
              as="button"
              type="button"
              fillState={menuFillState}
              className="rounded-full p-2 text-white md:hidden"
              contentClassName="flex items-center justify-center text-white transition-colors duration-500 group-hocus:text-black"
              onClick={(): void =>
                setIsOpen((currentValue: boolean): boolean => {
                  if (currentValue) {
                    animateMenuButtonUnfill();
                  }

                  return !currentValue;
                })
              }
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
            >
              {isOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </HoverFill>
          </div>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-zinc-950/95 px-6 backdrop-blur-3xl transition-all duration-500 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {mainNavLinks.map(
          (link): React.ReactElement => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e): void => handleHashLinkClick(e, link.href)}
              className="font-heading text-3xl font-bold text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ),
        )}
        <HoverFill
          as="link"
          href={contactSectionHref}
          onClick={(e: MouseEvent<HTMLAnchorElement>): void =>
            handleHashLinkClick(e, contactSectionHref)
          }
          className="mt-4 rounded-full border border-white/20 px-6 py-2.5 transition-all hover:border-white/60"
          contentClassName="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-colors duration-500 group-hocus:text-black"
        >
          Contact
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </HoverFill>
      </div>
    </>
  );
}
