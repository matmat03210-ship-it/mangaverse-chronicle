export type Character = {
  slug: string;
  name: string;
  manga: string;
  role: string;
  tagline: string;
  aura: string; // css gradient
  accent: string; // css color
  power: string;
  firstAppearance: string;
  videoId: string; // YouTube id
  videoLabel: string;
  story: string;
  whyIconic: string;
  moments: string[];
};

export const characters: Character[] = [
  {
    slug: "goku",
    name: "Son Goku",
    manga: "Dragon Ball",
    role: "Héros saiyan",
    tagline: "Le combattant éternellement affamé de dépassement",
    aura: "linear-gradient(135deg, oklch(0.78 0.19 55), oklch(0.68 0.21 25))",
    accent: "oklch(0.78 0.19 55)",
    power: "Kaméhaméha, Super Saiyan, Ultra Instinct",
    firstAppearance: "Dragon Ball, chapitre 1 (1984)",
    videoId: "YIfL5EBGZLg",
    videoLabel: "Le premier Super Saiyan",
    story:
      "Envoyé sur Terre bébé sous le nom de Kakarot, Goku est recueilli par le vieux Son Gohan. Un coup sur la tête efface sa violence saiyanne et fait de lui un enfant curieux, increvable, obsédé par la nourriture et les arts martiaux. De la quête des Dragon Balls au tournoi du Cercle Céleste, chaque adversaire le pousse un cran plus loin.",
    whyIconic:
      "Goku a défini l'archétype du héros shonen : plus fort par l'entraînement, jamais par la haine. Sa transformation en Super Saiyan sur Namek est l'un des instants les plus copiés de la pop culture.",
    moments: [
      "Le Kaméhaméha appris en une seule observation",
      "Super Saiyan face à Freezer sur Namek",
      "Le Genkidama contre Boubou",
      "L'Ultra Instinct au Tournoi du Pouvoir",
    ],
  },
  {
    slug: "vegeta",
    name: "Vegeta",
    manga: "Dragon Ball",
    role: "Prince des Saiyans",
    tagline: "L'orgueil fait personnage",
    aura: "linear-gradient(135deg, oklch(0.62 0.2 265), oklch(0.5 0.18 300))",
    accent: "oklch(0.66 0.2 265)",
    power: "Final Flash, Big Bang Attack, Super Saiyan Blue Evolution",
    firstAppearance: "Dragon Ball, chapitre 204 (1988)",
    videoId: "kbGP8Rr5rHw",
    videoLabel: "Final Flash",
    story:
      "Dernier prince d'un peuple détruit, Vegeta débarque sur Terre en conquérant. Battu, humilié, il reste et transforme sa rage en discipline. Époux, père, rival : sa trajectoire est celle d'un antagoniste qui apprend lentement à protéger au lieu de dominer.",
    whyIconic:
      "Vegeta est le meilleur arc de rédemption du shonen. Il ne devient jamais gentil par facilité : il choisit, encore et encore, de se surpasser malgré l'échec.",
    moments: [
      "Son arrivée sur Terre avec Nappa",
      "Le sacrifice contre Cell puis contre Boubou",
      "« C'est moi le Vegeta d'aujourd'hui ! »",
      "Le Final Flash resté culte",
    ],
  },
  {
    slug: "freezer",
    name: "Freezer",
    manga: "Dragon Ball",
    role: "Empereur galactique",
    tagline: "La cruauté élégante",
    aura: "linear-gradient(135deg, oklch(0.72 0.16 330), oklch(0.55 0.16 285))",
    accent: "oklch(0.72 0.16 330)",
    power: "Death Beam, Supernova, forme dorée",
    firstAppearance: "Dragon Ball, chapitre 247 (1990)",
    videoId: "3rC9nqXn0Zk",
    videoLabel: "La transformation finale",
    story:
      "Tyran d'un empire commercial de planètes, Freezer extermine les Saiyans par peur d'un rival. Sur Namek, il révèle quatre formes successives, chacune plus froide et plus meurtrière, jusqu'à provoquer sans le vouloir la légende qu'il redoutait.",
    whyIconic:
      "Un méchant qui parle doucement, sourit, et détruit une planète. Freezer a redéfini le grand vilain de manga : classe, calme, absolument sans pitié.",
    moments: [
      "Le meurtre de Krillin qui déclenche le Super Saiyan",
      "La 100 % de puissance",
      "Le retour en Golden Freezer",
      "Son alliance forcée au Tournoi du Pouvoir",
    ],
  },
  {
    slug: "gohan",
    name: "Son Gohan",
    manga: "Dragon Ball",
    role: "Le potentiel caché",
    tagline: "Le savant au poing dévastateur",
    aura: "linear-gradient(135deg, oklch(0.75 0.17 150), oklch(0.6 0.16 190))",
    accent: "oklch(0.75 0.17 150)",
    power: "Masenko, Super Saiyan 2, Gohan Beast",
    firstAppearance: "Dragon Ball, chapitre 195 (1988)",
    videoId: "Zvo1kZ0DwCE",
    videoLabel: "Super Saiyan 2 face à Cell",
    story:
      "Fils de Goku, élevé pour étudier plutôt que combattre, Gohan porte une puissance qui n'explose que sous la colère. Enfant soldat malgré lui, il devient adulte le héros discret qui choisit la famille et la recherche avant la gloire.",
    whyIconic:
      "Sa transformation contre Cell est le passage de témoin le plus émouvant du manga : un enfant qui gagne parce qu'il a trop perdu.",
    moments: [
      "L'entraînement d'un an avec Piccolo",
      "Super Saiyan 2 et la mort de Cell",
      "Great Saiyaman, la parenthèse comique",
      "Gohan Beast dans Super Hero",
    ],
  },
  {
    slug: "piccolo",
    name: "Piccolo",
    manga: "Dragon Ball",
    role: "Le Namek stratège",
    tagline: "L'ennemi devenu mentor",
    aura: "linear-gradient(135deg, oklch(0.7 0.16 155), oklch(0.45 0.12 250))",
    accent: "oklch(0.7 0.16 155)",
    power: "Makankosappo, régénération, fusion nameke",
    firstAppearance: "Dragon Ball, chapitre 161 (1987)",
    videoId: "eLLDvJHfXTU",
    videoLabel: "Le Makankosappo",
    story:
      "Né de la haine du Grand Démon Piccolo, il n'existe d'abord que pour tuer Goku. En protégeant Gohan, il découvre l'attachement, puis le rôle de père de substitution et de cerveau tactique de l'équipe.",
    whyIconic:
      "Piccolo prouve qu'un personnage peut changer de camp sans perdre son caractère : toujours sec, toujours sarcastique, mais prêt à mourir pour un enfant.",
    moments: [
      "Le sacrifice pour sauver Gohan face à Nappa",
      "La fusion avec Kami",
      "L'entraînement de Gohan puis de Pan",
      "Orange Piccolo",
    ],
  },
  {
    slug: "cell",
    name: "Cell",
    manga: "Dragon Ball",
    role: "L'organisme parfait",
    tagline: "Un monstre né de tous les autres",
    aura: "linear-gradient(135deg, oklch(0.72 0.18 140), oklch(0.55 0.14 100))",
    accent: "oklch(0.72 0.18 140)",
    power: "Absorption cellulaire, Kaméhaméha solaire, autodestruction",
    firstAppearance: "Dragon Ball, chapitre 361 (1992)",
    videoId: "sHKPHhtEtxk",
    videoLabel: "Cell Games",
    story:
      "Créé par le Dr Gero à partir des cellules des plus grands guerriers, Cell voyage dans le temps pour atteindre sa forme parfaite. Une fois complet, il n'organise pas une invasion : il organise un tournoi, par pure vanité.",
    whyIconic:
      "Cell est le méchant théâtral par excellence, celui qui transforme la fin du monde en spectacle télévisé.",
    moments: [
      "L'absorption de C-17 et C-18",
      "L'annonce des Cell Games",
      "L'explosion qui tue Goku",
      "Le duel final de Kaméhaméha contre Gohan",
    ],
  },
  {
    slug: "boubou",
    name: "Majin Boubou",
    manga: "Dragon Ball",
    role: "Chaos rose",
    tagline: "Un enfant tout-puissant sans morale",
    aura: "linear-gradient(135deg, oklch(0.8 0.15 350), oklch(0.65 0.18 20))",
    accent: "oklch(0.8 0.15 350)",
    power: "Transformation en bonbon, régénération infinie, absorption",
    firstAppearance: "Dragon Ball, chapitre 460 (1994)",
    videoId: "Gc7T5R2sVEg",
    videoLabel: "Le réveil de Boubou",
    story:
      "Arme magique millénaire, Boubou change de forme et d'humeur au gré de ceux qu'il absorbe. Tour à tour puéril, monstrueux et étrangement innocent, il finit par se réincarner en un adversaire amical.",
    whyIconic:
      "Le seul grand méchant de Dragon Ball qui fait peur parce qu'il ne comprend pas ce qu'il détruit.",
    moments: [
      "La destruction de la Terre en un souffle",
      "Kid Boubou, la version la plus pure et la plus dangereuse",
      "Le Genkidama de l'humanité",
      "Sa renaissance en Oub",
    ],
  },
  {
    slug: "trunks",
    name: "Trunks du futur",
    manga: "Dragon Ball",
    role: "Voyageur temporel",
    tagline: "Le héros venu d'un monde déjà perdu",
    aura: "linear-gradient(135deg, oklch(0.72 0.14 290), oklch(0.6 0.15 240))",
    accent: "oklch(0.72 0.14 290)",
    power: "Épée, Burning Attack, Super Saiyan Rage",
    firstAppearance: "Dragon Ball, chapitre 331 (1991)",
    videoId: "gYqCFB7cq0Y",
    videoLabel: "Trunks contre Freezer",
    story:
      "Venu d'un futur ravagé par les Cyborgs, Trunks arrive pour prévenir Goku. Fils de Vegeta et Bulma, il porte le deuil de tout un monde et se bat pour un passé qui n'est pas le sien.",
    whyIconic:
      "Son entrée — trancher Freezer en quelques secondes — reste l'une des présentations de personnage les plus efficaces jamais écrites.",
    moments: [
      "L'exécution de Freezer et King Cold",
      "L'avertissement sur les Cyborgs",
      "Son duel contre Black Goku",
      "Le retour dans son époque pour la reconstruire",
    ],
  },
  {
    slug: "krilin",
    name: "Krilin",
    manga: "Dragon Ball",
    role: "Le plus fort des humains",
    tagline: "Le courage sans superpouvoir",
    aura: "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.66 0.14 40))",
    accent: "oklch(0.78 0.16 75)",
    power: "Kienzan (disque destructeur), Taiyoken",
    firstAppearance: "Dragon Ball, chapitre 25 (1985)",
    videoId: "T5m9nMYcnbI",
    videoLabel: "Le disque destructeur",
    story:
      "Moine, rival puis meilleur ami de Goku, Krilin est l'humain qui refuse de quitter le champ de bataille alors que tout le dépasse. Il finit par fonder une famille avec C-18 et devient policier.",
    whyIconic:
      "Il est le point de vue du lecteur : mortel, effrayé, et pourtant toujours présent. Sa mort sur Namek change le cours de la série.",
    moments: [
      "Le Kienzan qui blesse Freezer",
      "Sa mort qui déclenche le Super Saiyan",
      "Le mariage avec C-18",
      "Son retour au Tournoi du Pouvoir",
    ],
  },
  {
    slug: "bulma",
    name: "Bulma",
    manga: "Dragon Ball",
    role: "Génie de la Capsule Corp",
    tagline: "L'aventure commence grâce à elle",
    aura: "linear-gradient(135deg, oklch(0.75 0.15 200), oklch(0.62 0.16 250))",
    accent: "oklch(0.75 0.15 200)",
    power: "Radar Dragon Ball, machine à voyager dans le temps",
    firstAppearance: "Dragon Ball, chapitre 1 (1984)",
    videoId: "6xTt1kQfVWQ",
    videoLabel: "La rencontre avec Goku",
    story:
      "Sans Bulma et son radar, il n'y a pas de Dragon Ball. Inventrice, héritière de la Capsule Corp, elle traverse toute la saga : de l'adolescente en scooter à la mère de famille qui construit des vaisseaux interstellaires.",
    whyIconic:
      "Elle représente l'intelligence dans un monde de poings : chaque grande avancée technique de la série vient d'elle.",
    moments: [
      "Le radar Dragon Ball",
      "Le vaisseau vers Namek",
      "La machine à voyager dans le temps",
      "Le mariage avec Vegeta",
    ],
  },
];

export const getCharacter = (slug: string) => characters.find((c) => c.slug === slug);
