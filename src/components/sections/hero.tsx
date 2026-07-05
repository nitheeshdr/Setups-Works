"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faStar,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/section";
import {
  ParticleBackground,
  AuroraBackground,
  GridGlow,
} from "@/components/backgrounds";
import { PremiumButton } from "@/components/premium-button";
import BlurText from "@/components/reactbits/BlurText";
import RotatingText from "@/components/reactbits/RotatingText";
import ShinyText from "@/components/reactbits/ShinyText";
import GradientText from "@/components/reactbits/GradientText";
import TextType from "@/components/reactbits/TextType";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36">
      {/* Background */}
      <AuroraBackground opacity={0.28} />
      <ParticleBackground count={120} />
      <GridGlow />

      <Container className="relative">
        {/* Centered copy */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Link
              href="/products/codeforgeai-io"
              className="group mb-7 inline-flex items-center gap-2 rounded-full glass py-1.5 pl-1.5 pr-4 text-sm transition-colors hover:border-brand-500/40"
            >
              <span className="flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                <FontAwesomeIcon icon={faBolt} className="size-2.5" />
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

          <h1 className="font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance sm:text-6xl md:text-7xl">
            <BlurText
              text="We design & build"
              animateBy="words"
              delay={80}
              className="justify-center"
            />
            <span className="mt-1 flex flex-wrap items-center justify-center gap-x-3">
              <GradientText
                colors={["#4D86F7", "#8B5CF6", "#4D86F7"]}
                className="!mx-0 inline-block"
              >
                digital products
              </GradientText>
              <span className="text-muted-foreground">that</span>
            </span>
            <span className="mt-1 flex justify-center">
              <RotatingText
                texts={["convert.", "scale.", "delight.", "win."]}
                mainClassName="text-brand-500"
                rotationInterval={2200}
                staggerFrom="last"
                staggerDuration={0.02}
                splitBy="characters"
              />
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
            className="mt-7 max-w-2xl text-lg text-muted-foreground text-balance"
          >
            <TextType
              text={[
                "A premium digital agency crafting websites, apps & AI products.",
                "Engineered for speed. Designed to be unforgettable.",
              ]}
              typingSpeed={35}
              pauseDuration={2200}
              deletingSpeed={18}
              showCursor
              cursorCharacter="▍"
              className="text-muted-foreground"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: easeOut }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <PremiumButton href="/contact" size="lg" icon={faArrowRight}>
              Start a project
            </PremiumButton>
            <PremiumButton href="/portfolio" variant="glass" size="lg">
              See our work
            </PremiumButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-7 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className="size-3.5 text-amber-400"
                />
              ))}
            </span>
            <span className="font-medium text-foreground">4.9/5</span>
            from 120+ happy clients
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
