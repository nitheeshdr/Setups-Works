"use client";

import {
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUserGroup,
  faLayerGroup,
  faCube,
  faBriefcase,
  faNewspaper,
  faEnvelope,
  faBlog,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { services } from "@/data/services";

const CommandCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useCommandPalette = () => useContext(CommandCtx);

const pages = [
  { label: "Home", href: "/", icon: faHouse },
  { label: "About", href: "/about", icon: faUserGroup },
  { label: "Services", href: "/services", icon: faLayerGroup },
  { label: "Products", href: "/products", icon: faCube },
  { label: "Portfolio", href: "/portfolio", icon: faBriefcase },
  { label: "Blog", href: "/blog", icon: faNewspaper },
  { label: "Careers", href: "/careers", icon: faBriefcase },
  { label: "Contact", href: "/contact", icon: faEnvelope },
];

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          e.key === "/" &&
          ["INPUT", "TEXTAREA"].includes(
            (e.target as HTMLElement)?.tagName ?? "",
          )
        )
          return;
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandCtx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search Setups Works"
      >
        <CommandInput placeholder="Search pages, services, actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {pages.map((p) => (
              <CommandItem
                key={p.href}
                onSelect={() => go(p.href)}
                value={p.label}
              >
                <FontAwesomeIcon
                  icon={p.icon}
                  className="size-3.5 text-brand-500"
                />
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Services">
            {services.slice(0, 8).map((s) => (
              <CommandItem
                key={s.slug}
                onSelect={() => go(`/services/${s.slug}`)}
                value={`service ${s.title}`}
              >
                <FontAwesomeIcon
                  icon={s.icon}
                  className="size-3.5 text-brand-500"
                />
                {s.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => go("/blog")} value="blog articles">
              <FontAwesomeIcon
                icon={faBlog}
                className="size-3.5 text-brand-500"
              />
              Read the blog
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.open("https://github.com/setupsworks", "_blank");
              }}
              value="github"
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="size-3.5 text-brand-500"
              />
              GitHub
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.open(
                  "https://linkedin.com/company/setupsworks",
                  "_blank",
                );
              }}
              value="linkedin"
            >
              <FontAwesomeIcon
                icon={faLinkedin}
                className="size-3.5 text-brand-500"
              />
              LinkedIn
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </CommandCtx.Provider>
  );
}
