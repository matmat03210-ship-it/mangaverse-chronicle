import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import booAsset from "@/assets/models/majin-buu.glb.asset.json";
import vegetaAsset from "@/assets/models/vegeta.glb.asset.json";
import trunksAsset from "@/assets/models/trunks.glb.asset.json";
import cellAsset from "@/assets/models/cell.glb.asset.json";
import piccoloAsset from "@/assets/models/piccolo.glb.asset.json";
import gohanAsset from "@/assets/models/gohan.glb.asset.json";
import krilinAsset from "@/assets/models/krilin.glb.asset.json";
import freezerAsset from "@/assets/models/freezer.glb.asset.json";

const MODEL_URLS: Record<string, string> = {
  boo: booAsset.url,
  vegeta: vegetaAsset.url,
  trunks: trunksAsset.url,
  cell: cellAsset.url,
  piccolo: piccoloAsset.url,
  gohan: gohanAsset.url,
  krilin: krilinAsset.url,
  freezer: freezerAsset.url,
};

const MODEL_ROTATIONS: Partial<Record<string, [number, number, number]>> = {
  freezer: [-Math.PI / 2, 0, 0],
  piccolo: [Math.PI / 2, 0, 0],
  boo: [-Math.PI / 2, 0, 0],
};

// Les fichiers viennent de logiciels différents (unités, axes et origines variés).
// Ces cadrages utilisent leurs dimensions réelles afin de garder tous les héros
// à la même taille, y compris avant le démarrage de leurs squelettes.
const MODEL_FRAMES: Record<string, { scale: number; position: [number, number, number] }> = {
  vegeta: { scale: 1.436, position: [-0.074, -0.823, 0.902] },
  freezer: { scale: 115.59, position: [0, -1.08, 0.749] },
  gohan: { scale: 10.055, position: [0, -1.18, 0] },
  piccolo: { scale: 3.6, position: [0, -0.82, 0.02] },
  cell: { scale: 1.194, position: [0, -0.807, 0.327] },
  boo: { scale: 48.98, position: [0.132, -0.82, 0.002] },
  trunks: { scale: 10.881, position: [-0.076, -3.074, -1.856] },
  krilin: { scale: 0.59, position: [0, -0.82, -0.043] },
};

function preparedClone(source: THREE.Group, slug: string) {
  const object = source.clone(true);
  const rotation = MODEL_ROTATIONS[slug];
  if (rotation) object.rotation.set(...rotation);
  const frame = MODEL_FRAMES[slug];
  if (frame) {
    object.scale.setScalar(frame.scale);
    object.position.set(...frame.position);
  }

  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!(material instanceof THREE.MeshStandardMaterial)) continue;
      material.roughness = 0.82;
      material.metalness = Math.min(material.metalness, 0.08);
      if (material.map) {
        material.map.colorSpace = THREE.SRGBColorSpace;
        material.map.anisotropy = 4;
      }
      material.needsUpdate = true;
    }
  });

  return object;
}

export function ImportedCharacterModel({ slug }: { slug: string }) {
  const url = MODEL_URLS[slug] ?? vegetaAsset.url;
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const model = useMemo(() => preparedClone(scene, slug), [scene, slug]);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

Object.values(MODEL_URLS).forEach((url) => useGLTF.preload(url));

export const importedCharacterSlugs = new Set(Object.keys(MODEL_URLS));