"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Container, Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/motion-primitives";
import { faqs as defaultFaqs, type FAQ } from "@/data/site-content";
import { cn } from "@/lib/utils";

export function FAQSection({
  faqs = defaultFaqs,
  eyebrow = "FAQ",
  title = "Questions, answered",
  description = "Everything you need to know before we start working together.",
}: {
  faqs?: FAQ[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section className="relative">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.question} delay={i * 0.04}>
                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-colors",
                    isOpen ? "border-brand-500/40" : "border-border/60",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium">{faq.question}</span>
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-full border border-border/60 transition-all",
                        isOpen && "rotate-45 border-brand-500 bg-brand-500 text-white",
                      )}
                    >
                      <FontAwesomeIcon icon={faPlus} className="size-3" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
