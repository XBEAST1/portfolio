"use client";

import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/lib/portfolio-data";

export function ContactSocialLinks(): React.ReactElement {
  return (
    <div className="contact-reveal flex w-full flex-col opacity-0 lg:w-100">
      <div className="contact-line mb-4 h-px w-full origin-left scale-x-0 bg-white/20" />
      {socialLinks.map(
        (link): React.ReactElement => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between border-b border-white/10 py-6 transition-all duration-300 hover:bg-white/5 hover:px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
            data-scroll-hover=""
          >
            <span className="font-heading text-xl font-bold uppercase tracking-wider text-gray-300 transition-colors duration-500">
              {link.label}
            </span>
            <ArrowUpRight
              className="h-5 w-5 text-gray-500 transition-transform duration-300 group-hocus:-translate-y-1 group-hocus:translate-x-1 group-hocus:text-[#fde8bf]"
              aria-hidden="true"
            />
          </a>
        ),
      )}
    </div>
  );
}
