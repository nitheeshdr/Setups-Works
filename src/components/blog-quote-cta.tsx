import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { LeadFormModal } from "@/components/lead-form-modal";

/**
 * Quotation prompt placed inside an article.
 *
 * Opens the lead form in a modal rather than linking away: someone reading a
 * 1,500-word piece has invested attention, and sending them to another page to
 * start over is where that intent gets lost. The modal keeps their place.
 *
 * `service` pre-selects the dropdown from the article's category, so a reader
 * of the pricing piece lands on a form already pointed at what they were
 * reading about.
 */
export function BlogQuoteCTA({
  service,
  services = [],
  source,
  heading = "Thinking about a project like this?",
  body = "Tell us what you're building and we'll come back with an honest scope and price — usually within one business day.",
}: {
  service?: string;
  services?: string[];
  source?: string;
  heading?: string;
  body?: string;
}) {
  return (
    <aside className="not-prose my-12 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
        {heading}
      </h2>
      <p className="mt-2.5 max-w-xl text-muted-foreground">{body}</p>

      <ul className="mt-5 grid gap-2 sm:grid-cols-3">
        {["No obligation", "Reply within a day", "A real person, not a bot"].map(
          (point) => (
            <li key={point} className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="size-3.5 shrink-0 text-brand-500"
              />
              <span className="text-muted-foreground">{point}</span>
            </li>
          ),
        )}
      </ul>

      <div className="mt-6">
        <LeadFormModal
          triggerLabel="Get a quote"
          defaultService={service}
          services={services}
          source={source}
        />
      </div>
    </aside>
  );
}
