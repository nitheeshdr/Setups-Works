"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faTriangleExclamation,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { AdminHeader, Spinner, EmptyState } from "@/components/admin/ui";
import { api } from "@/lib/admin/api";
import { formatDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { crawlerKind } from "@/lib/crawlers";

interface Hit {
  _id: string;
  path: string;
  crawler: string;
  verified: boolean;
  method: string;
  ip: string;
  createdAt: string;
}

interface Summary {
  days: number;
  total: number;
  items: Hit[];
  byCrawler: { _id: string; hits: number; verified: number }[];
  topPaths: { _id: string; hits: number }[];
}

export default function AdminCrawlersPage() {
  const [days, setDays] = useState(7);

  const { data, isLoading } = useQuery<Summary>({
    queryKey: ["crawler-log", days],
    queryFn: () => api.get(`/crawler-log?days=${days}`).then((r) => r.data),
  });

  return (
    <>
      <AdminHeader
        title="Crawlers"
        description="Crawler activity on the site — search engines and AI answer engines. Answers whether Googlebot and GPTBot are actually visiting, rather than assuming."
      />

      <div className="mb-6 flex items-center gap-2">
        {[1, 7, 30].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDays(d)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              days === d
                ? "bg-brand-500/10 text-brand-500"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {d === 1 ? "24 hours" : `${d} days`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Spinner />
      ) : !data || data.total === 0 ? (
        <EmptyState label="No crawler visits recorded yet. Once a search engine fetches a page, it appears here." />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total hits" value={String(data.total)} />
            <Stat
              label="Verified Google"
              value={String(
                data.byCrawler
                  .filter((c) => c._id.startsWith("Google"))
                  .reduce((n, c) => n + c.verified, 0),
              )}
              tone="good"
            />
            <Stat
              label="Claimed but unverified"
              value={String(
                data.byCrawler
                  .filter((c) => c._id.startsWith("Google"))
                  .reduce((n, c) => n + (c.hits - c.verified), 0),
              )}
              tone="warn"
            />
            <Stat
              label="AI answer engines"
              value={String(
                data.byCrawler
                  .filter((c) => crawlerKind(c._id).startsWith("ai"))
                  .reduce((n, c) => n + c.hits, 0),
              )}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="By crawler">
              <div className="space-y-2">
                {data.byCrawler.map((c) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-2/40 px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <FontAwesomeIcon icon={faRobot} className="size-3.5 text-brand-500" />
                      {c._id}
                      {crawlerKind(c._id).startsWith("ai") && (
                        <span className="rounded-md bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-500">
                          {crawlerKind(c._id) === "ai-search" ? "AI search" : "AI training"}
                        </span>
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {c.hits} hits
                      {c._id.startsWith("Google") && (
                        <span className={cn("ml-2", c.verified === c.hits ? "text-emerald-500" : "text-amber-500")}>
                          {c.verified}/{c.hits} verified
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Most crawled pages">
              <div className="space-y-2">
                {data.topPaths.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-2/40 px-4 py-3 text-sm"
                  >
                    <span className="truncate font-mono text-xs">{p._id}</span>
                    <span className="shrink-0 text-muted-foreground">{p.hits}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel title="Recent activity">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="pb-2 font-medium">When</th>
                    <th className="pb-2 font-medium">Crawler</th>
                    <th className="pb-2 font-medium">Path</th>
                    <th className="pb-2 font-medium">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.items.map((h) => (
                    <tr key={h._id}>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {formatDate(h.createdAt)}
                      </td>
                      <td className="py-2.5 pr-4 font-medium">{h.crawler}</td>
                      <td className="max-w-[240px] truncate py-2.5 pr-4 font-mono text-xs">
                        {h.path}
                      </td>
                      <td className="py-2.5">
                        {h.verified ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-500">
                            <FontAwesomeIcon icon={faCircleCheck} className="size-3" />
                            {h.method}
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 text-amber-500"
                            title="User-agent claimed a crawler but the IP could not be verified"
                          >
                            <FontAwesomeIcon icon={faTriangleExclamation} className="size-3" />
                            unverified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}
    </>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "warn";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        tone === "good"
          ? "border-emerald-500/30 bg-emerald-500/10"
          : tone === "warn"
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-border/60 bg-card/50",
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6">
      <h2 className="mb-4 font-display text-base font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}
