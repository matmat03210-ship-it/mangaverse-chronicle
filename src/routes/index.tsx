import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { characters } from "@/data/characters";
import { Character3D } from "@/components/Character3D";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MangaVerse — les personnages de manga en vidéo" },
      {
        name: "description",
        content:
          "Explore les personnages cultes de manga : vidéos de leur puissance, première apparition, histoire et moments marquants. On commence par Dragon Ball.",
      },
      { property: "og:title", content: "MangaVerse — les personnages de manga en vidéo" },
      {
        property: "og:description",
        content:
          "Clique sur un personnage pour voir sa puissance en vidéo et découvrir son histoire. Univers Dragon Ball disponible.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return characters;
    return characters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.power.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div style={{ backgroundImage: "var(--gradient-hero)" }}>
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <span className="text-lg font-black tracking-tight">
            MANGA<span className="text-primary">VERSE</span>
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Univers : Dragon Ball
          </span>
        </header>

        <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">
            Explorateur interactif
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
            Chaque personnage,{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              sa légende
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Clique sur un personnage : sa puissance ou sa première apparition en vidéo, puis
            son histoire, ce qu'il a fait et pourquoi il a marqué le manga.
          </p>

          <div className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-border bg-card/70 px-5 py-3 backdrop-blur">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Chercher Goku, Kaméhaméha, prince..."
              aria-label="Rechercher un personnage"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <span className="text-xs font-semibold text-muted-foreground">
              {results.length}
            </span>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-6 text-2xl font-black tracking-tight">Personnages marquants</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <div
              key={c.slug}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div
                className="absolute inset-0 opacity-25 transition-opacity duration-300 group-hover:opacity-60"
                style={{ backgroundImage: c.aura }}
              />
              <div className="relative">
                <span
                  className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                  style={{ backgroundColor: c.accent, color: "oklch(0.16 0.035 275)" }}
                >
                  {c.role}
                </span>

                <Character3D slug={c.slug} className="mt-4 h-64 w-full cursor-grab" />
                <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Glisse pour le faire tourner
                </p>

                <h3 className="mt-3 text-3xl font-black tracking-tight">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.tagline}</p>
                <Link
                  to="/personnage/$slug"
                  params={{ slug: c.slug }}
                  className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground"
                >
                  Voir sa fiche · {c.videoLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
        {results.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            Aucun personnage ne correspond à « {query} ».
          </p>
        )}
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Version de démonstration — d'autres univers (Naruto, One Piece) arriveront ensuite.
      </footer>
    </main>
  );
}
