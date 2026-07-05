"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faStar,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/section";
import { AuroraBackground, GridGlow } from "@/components/backgrounds";
import { MagneticButton } from "@/components/interactive";
import BlurText from "@/components/reactbits/BlurText";
import RotatingText from "@/components/reactbits/RotatingText";
import ShinyText from "@/components/reactbits/ShinyText";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16">
      <AuroraBackground opacity={0.5} />
      <GridGlow />

      <Container className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Link
              href="/products/codeforge-ai"
              className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface-2/60 py-1.5 pl-1.5 pr-4 text-sm backdrop-blur-sm transition-colors hover:border-brand-500/40"
            >
              <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              <ShinyText
                text="Introducing CodeForge AI"
                speed={4}
                className="font-medium"
              />
              <FontAwesomeIcon
                icon={faArrowRight}
                className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-6xl md:text-7xl">
            <BlurText
              text="We design & build"
              animateBy="words"
              delay={90}
              className="justify-center"
            />
            <span className="mt-1 flex flex-wrap items-center justify-center gap-x-3">
              <span className="text-gradient">digital products</span>
              <span className="text-muted-foreground">that</span>
            </span>
            <span className="mt-1 inline-flex justify-center">
              <RotatingText
                texts={["convert.", "scale.", "delight.", "last.", "win."]}
                mainClassName="text-brand-500"
                rotationInterval={2200}
                staggerFrom="last"
                staggerDuration={0.02}
                splitBy="characters"
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
            className="mx-auto mt-7 max-w-2xl text-lg text-muted-foreground text-balance"
          >
            Setups Works is a premium digital agency crafting high-performance
            websites, web &amp; mobile apps, and AI products — engineered for
            speed, designed to be unforgettable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: easeOut }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <MagneticButton href="/contact" size="lg" icon={faArrowRight}>
              Start a project
            </MagneticButton>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2.5 rounded-xl border border-border/60 bg-surface-2/50 px-6 py-3 font-semibold backdrop-blur-sm transition-colors hover:border-brand-500/40"
            >
              <span className="grid size-6 place-items-center rounded-full bg-brand-500/15 text-brand-500">
                <FontAwesomeIcon icon={faPlay} className="size-2.5" />
              </span>
              See our work
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className="size-3.5 text-amber-400"
                />
              ))}
              <span className="ml-1 font-medium text-foreground">4.9/5</span>
              average rating
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>
              <span className="font-medium text-foreground">240+</span> projects
              delivered
            </span>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span>
              <span className="font-medium text-foreground">120+</span> happy
              clients
            </span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
