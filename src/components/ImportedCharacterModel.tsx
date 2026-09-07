import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
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
  piccolo: [-Math.PI / 2, 0, 0],
  boo: [-Math.PI / 2, 0, 0],
};

function preparedClone(source: THREE.Group, slug: string) {
  const object = SkeletonUtils.clone(source);
  const rotation = MODEL_ROTATIONS[slug];
  if (rotation) object.rotation.set(...rotation);

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
  const { scene, animations } = useGLTF(url);
  const model = useMemo(() => preparedClone(scene, slug), [scene, slug]);
  const { actions } = useAnimations(animations, group);

  // La boîte des modèles skinnés n'est fiable qu'une fois le squelette monté.
  // On cadre donc après le premier rendu, avec la pose réellement affichée.
  useLayoutEffect(() => {
    model.scale.setScalar(1);
    model.position.set(0, 0, 0);
    model.updateWorldMatrix(true, true);

    const bounds = new THREE.Box3().setFromObject(model, true);
    const size = bounds.getSize(new THREE.Vector3());
    if (!Number.isFinite(size.y) || size.y < 0.00001) return;

    const scale = 2.75 / size.y;
    model.scale.setScalar(scale);
    model.updateWorldMatrix(true, true);

    const framedBounds = new THREE.Box3().setFromObject(model, true);
    const center = framedBounds.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -0.82 - framedBounds.min.y, -center.z);
    model.updateWorldMatrix(true, true);
  }, [model]);

  useEffect(() => {
    const idle = actions["Idle"];
    if (!idle) return;
    idle.reset().fadeIn(0.25).play();
    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

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