import { HoverFill } from "@/components/hover-fill";

export default function NotFound(): React.ReactElement {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#050505] px-6 text-white">
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
      <section className="relative z-10 max-w-3xl text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-[#fde8bf]">
          System Error: Coordinates Not Found
        </p>
        <h1 className="font-heading text-[24vw] font-black uppercase leading-none tracking-tighter md:text-[12vw]">
          404
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-gray-400">
          This route slipped outside the known interface. Return to the main
          portfolio and reinitialize the experience.
        </p>
        <HoverFill
          as="link"
          href="/"
          className="mt-10 inline-flex rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fde8bf]"
          contentClassName="text-white transition-colors duration-500 group-hocus:text-black"
        >
          Back To Home
        </HoverFill>
      </section>
    </main>
  );
}
