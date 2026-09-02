# MangaVerse — explorer interactif de personnages de manga

Une application colorée et dynamique pour découvrir les personnages de manga, en commençant par Dragon Ball. On clique sur un personnage, une vidéo (YouTube, parfois clip IA) montre sa puissance ou sa première apparition, puis on lit son histoire et pourquoi il est marquant.

## Écrans

1. **Accueil** — grille de cartes personnages très colorées (une couleur d'aura par personnage), filtre par manga (Dragon Ball pour l'instant), barre de recherche, section "personnages marquants".
2. **Fiche personnage** — bannière avec le nom et l'aura du personnage, lecteur vidéo (extrait YouTube intégré, ou clip IA quand il existe), onglets : Histoire / Pourquoi il est marquant / Moments clés / Puissance.
3. **Connexion / inscription** — email + mot de passe, pseudo affiché.
4. **Espace membre** — favoris, et formulaire "proposer un personnage" (nom, manga, images, liens vidéo, textes). Les propositions arrivent en attente de validation ; un rôle admin approuve pour publication.

## Contenu de départ (Dragon Ball, ~10)

Goku, Vegeta, Freezer, Gohan, Piccolo, Cell, Majin Buu, Trunks, Krillin, Bulma — chacun avec fiche complète et un extrait vidéo YouTube.

## Vidéos

- Principalement YouTube : chaque personnage a un ou deux extraits (première apparition, transformation/puissance) intégrés en lecteur.
- IA en complément : un bouton permet de générer un court clip d'ambiance pour un personnage (action explicite de l'utilisateur, car la génération coûte cher et prend 1-3 min). Le clip est stocké et rejoué ensuite.

## Design

Palette électrique et saturée (orange Kamé, bleu ki, violet), grandes typographies, cartes avec halo lumineux et animations au survol. Je proposerai d'abord 3 directions visuelles rendues pour que tu choisisses avant de construire.

## Détails techniques

- Lovable Cloud activé : base de données, authentification, stockage des images et des clips générés.
- Tables : `characters` (slug, nom, manga, résumé, histoire, marquant, puissance, couleurs, statut publié/en attente, auteur), `character_videos` (type, url YouTube ou fichier IA, titre), `favorites` (utilisateur + personnage), `profiles` (pseudo, avatar), `user_roles` (admin/user, table séparée + fonction `has_role`).
- RLS : lecture publique des personnages publiés, écriture par l'auteur, validation réservée aux admins ; favoris privés.
- Personnages Dragon Ball insérés directement dans la migration (données présentes dès le premier chargement).
- Vidéos IA via la passerelle IA Lovable, appelée côté serveur, avec création de job + polling + stockage du MP4.
- Routes TanStack : `/`, `/personnage/$slug`, `/auth`, `/mon-espace`, `/proposer`, `/admin`.

## Ordre de réalisation

1. Directions visuelles → ton choix
2. Cloud + base de données + données Dragon Ball
3. Accueil et fiches personnages avec vidéos YouTube
4. Comptes, favoris, propositions + validation admin
5. Génération de clips IA
