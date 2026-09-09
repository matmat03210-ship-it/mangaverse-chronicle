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

const MODEL_FRAMES: Record<string, { scale: number; position: [number, number, number] }> = {
  vegeta: { scale: 1.58, position: [-0.081, -0.84, 0.992] },
  freezer: { scale: 127.15, position: [0, -1.1, 0.824] },
  gohan: { scale: 11.06, position: [0, -1.2, 0] },
  piccolo: { scale: 8.1, position: [0, -1.66, 0.03] },
  cell: { scale: 1.55, position: [0, -0.87, 0.425] },
  boo: { scale: 53.88, position: [0.145, -0.84, 0.002] },
  trunks: { scale: 11.64, position: [-0.081, -3.23, -1.986] },
  krilin: { scale: 0.68, position: [0, -0.84, -0.05] },
};

function removeTrunksStand(geometry: THREE.BufferGeometry) {
  const positions = geometry.getAttribute("position");
  const indices = geometry.getIndex();
  if (!positions || !indices) return geometry;

  const kept: number[] = [];
  for (let i = 0; i < indices.count; i += 3) {
    const a = indices.getX(i);
    const b = indices.getX(i + 1);
    const c = indices.getX(i + 2);
    const isStand = positions.getZ(a) < 0.219 && positions.getZ(b) < 0.219 && positions.getZ(c) < 0.219;
    if (!isStand) kept.push(a, b, c);
  }

  const cleaned = geometry.clone();
  cleaned.setIndex(kept);
  cleaned.computeBoundingBox();
  cleaned.computeBoundingSphere();
  return cleaned;
}

function restorePiccoloColors(geometry: THREE.BufferGeometry) {
  const sourceColors = geometry.getAttribute("color");
  const positions = geometry.getAttribute("position");
  if (!sourceColors || !positions) return geometry;

  const corrected = geometry.clone();
  const colors = new Float32Array(sourceColors.count * 4);
  const green = new THREE.Color("#65c84a");
  const purple = new THREE.Color("#5c2a92");
  const pink = new THREE.Color("#dc73a8");
  const boots = new THREE.Color("#7a5838");

  for (let i = 0; i < sourceColors.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const r = sourceColors.getX(i);
    const g = sourceColors.getY(i);
    const b = sourceColors.getZ(i);
    const isPinkDetail = r > 0.65 && b > 0.65 && g < 0.45;
    const isSkin = y > 1.36 || (y > 0.48 && y < 1.38 && Math.abs(x) > 0.31);
    const color = y < 0.2 ? boots : isPinkDetail ? pink : isSkin ? green : purple;
    colors[i * 4] = color.r;
    colors[i * 4 + 1] = color.g;
    colors[i * 4 + 2] = color.b;
    colors[i * 4 + 3] = 1;
  }

  corrected.setAttribute("color", new THREE.BufferAttribute(colors, 4));
  return corrected;
}

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

    if (slug === "trunks") mesh.geometry = removeTrunksStand(mesh.geometry);
    if (slug === "piccolo") mesh.geometry = restorePiccoloColors(mesh.geometry);

    const materials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((material) =>
      material.clone(),
    );
    const firstMaterial = materials[0];
    if (!firstMaterial) return;
    mesh.material = Array.isArray(mesh.material) ? materials : firstMaterial;
    for (const material of materials) {
      if (!(material instanceof THREE.MeshStandardMaterial)) continue;
      material.roughness = 0.82;
      material.metalness = Math.min(material.metalness, 0.08);
      if (slug === "piccolo") {
        material.color.set("#ffffff");
        material.vertexColors = true;
      }
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