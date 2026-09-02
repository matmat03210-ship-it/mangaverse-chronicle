export type Look = {
  skin: string;
  hair: string;
  hairStyle: "spiky" | "flame" | "bald" | "bob" | "smooth" | "antenna" | "horn";
  top: string;
  bottom: string;
  belt: string;
  boots: string;
  cape?: string;
  scale?: number;
};

export const looks: Record<string, Look> = {
  goku: {
    skin: "#f2c9a0",
    hair: "#1b1b22",
    hairStyle: "spiky",
    top: "#f4931f",
    bottom: "#f4931f",
    belt: "#2f5fd0",
    boots: "#2f5fd0",
  },
  vegeta: {
    skin: "#f2c9a0",
    hair: "#221f2e",
    hairStyle: "flame",
    top: "#2b3240",
    bottom: "#2b3240",
    belt: "#e8e2d6",
    boots: "#e8e2d6",
  },
  freezer: {
    skin: "#f0f2f7",
    hair: "#b07fd6",
    hairStyle: "horn",
    top: "#b07fd6",
    bottom: "#f0f2f7",
    belt: "#5c4a8c",
    boots: "#b07fd6",
    scale: 0.95,
  },
  gohan: {
    skin: "#f2c9a0",
    hair: "#1b1b22",
    hairStyle: "spiky",
    top: "#3f7f46",
    bottom: "#f4931f",
    belt: "#2f5fd0",
    boots: "#2f5fd0",
    scale: 0.92,
  },
  piccolo: {
    skin: "#79c07a",
    hair: "#79c07a",
    hairStyle: "antenna",
    top: "#6e2fb0",
    bottom: "#6e2fb0",
    belt: "#3f8fd0",
    boots: "#c9b48a",
    cape: "#e9e4d8",
  },
  cell: {
    skin: "#8fd07a",
    hair: "#2f6f3f",
    hairStyle: "horn",
    top: "#2f6f3f",
    bottom: "#111a14",
    belt: "#e6dc6a",
    boots: "#2f6f3f",
    scale: 1.05,
  },
  boo: {
    skin: "#f4a7c7",
    hair: "#f4a7c7",
    hairStyle: "antenna",
    top: "#f0e6d2",
    bottom: "#2f2f3a",
    belt: "#e6c04a",
    boots: "#f0e6d2",
    scale: 1.08,
  },
  trunks: {
    skin: "#f2c9a0",
    hair: "#b48ce0",
    hairStyle: "bob",
    top: "#2f5fd0",
    bottom: "#2b2f3a",
    belt: "#e8e2d6",
    boots: "#e8d05a",
  },
  krilin: {
    skin: "#f2c9a0",
    hair: "#1b1b22",
    hairStyle: "bald",
    top: "#f4931f",
    bottom: "#f4931f",
    belt: "#8b1f2f",
    boots: "#3a3f4a",
    scale: 0.85,
  },
  bulma: {
    skin: "#f7d6b6",
    hair: "#4fc3e8",
    hairStyle: "smooth",
    top: "#e85b8a",
    bottom: "#f0e6d2",
    belt: "#e8d05a",
    boots: "#e85b8a",
    scale: 0.9,
  },
};

export const defaultLook: Look = {
  skin: "#f2c9a0",
  hair: "#1b1b22",
  hairStyle: "spiky",
  top: "#f4931f",
  bottom: "#f4931f",
  belt: "#2f5fd0",
  boots: "#2f5fd0",
};
