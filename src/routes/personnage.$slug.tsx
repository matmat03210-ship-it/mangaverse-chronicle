import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getCharacter } from "@/data/characters";

export const Route = createFileRoute("/personnage/$slug")({
  loader: ({ params }) => {
    const character = getCharacter(params.slug);
    if (!character) throw notFound();
    return { character };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Personnage introuvable — MangaVerse" }, { name: "robots", content: "noindex" }],
      };
    }
    const { character } = loaderData;
    const title = `${character.name} — histoire, puissance et vidéo | MangaVerse`;
    return {
      meta: [
        { title },
        { name: "description", content: character.whyIconic.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: character.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CharacterPage,
});

const tabs = ["Histoire", "Pourquoi il marque", "Moments clés"] as const;

function CharacterPage() {
  const { character } = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Histoire");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: character.aura }} />
        <div className="relative mx-auto max-w-5xl px-6 py-10">
          <Link to="/" className="text-sm font-semibold text-foreground/80 hover:text-foreground">
            ← Tous les personnages
          </Link>
          <span
            className="mt-8 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: character.accent, color: "oklch(0.16 0.035 275)" }}
          >
            {character.manga} · {character.role}
          </span>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">{character.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-foreground/80">{character.tagline}</p>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <Character3D slug={character.slug} className="h-[26rem] w-full cursor-grab" />
          <p className="px-6 py-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Modèle 3D — glisse pour tourner, molette pour zoomer
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${character.videoId}`}
              title={`${character.name} — ${character.videoLabel}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              ▶ {character.videoLabel}
            </p>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                `${character.name} ${character.videoLabel}`,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground"
            >
              Vidéo indisponible ? Ouvrir sur YouTube
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoCard label="Puissance" value={character.power} />
          <InfoCard label="Première apparition" value={character.firstAppearance} />
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 text-base leading-relaxed text-foreground/90">
          {tab === "Histoire" && <p>{character.story}</p>}
          {tab === "Pourquoi il marque" && <p>{character.whyIconic}</p>}
          {tab === "Moments clés" && (
            <ul className="space-y-3">
              {character.moments.map((m) => (
                <li key={m} className="flex gap-3">
                  <span style={{ color: character.accent }}>◆</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  );
}
