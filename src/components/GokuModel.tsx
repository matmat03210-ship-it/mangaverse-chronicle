import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import gokuGlb from "@/assets/models/goku.glb.asset.json";
import texUpper from "@/assets/models/goku-Upper.png.asset.json";
import texLower from "@/assets/models/goku-Lower.png.asset.json";
import texOther from "@/assets/models/goku-other.png.asset.json";
import texBody from "@/assets/models/goku-Body.png.asset.json";
import texHead from "@/assets/models/goku-HeadSSj.png.asset.json";

/** Modèle 3D réel de Goku (Sketchfab), textures appliquées par nom de matériau */
export function GokuModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(gokuGlb.url);

  const textures = useTexture({
    "Upper.bmp": texUpper.url,
    "Lower.bmp": texLower.url,
    "other.bmp": texOther.url,
    "Body.bmp": texBody.url,
    "HeadSSj.bmp": texHead.url,
  });

  useMemo(() => {
    for (const t of Object.values(textures)) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.flipY = false;
      t.needsUpdate = true;
    }
  }, [textures]);

  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);
    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mesh.material = Array.isArray(mesh.material)
          ? mats.map((m) => {
              const tex = textures[m.name as keyof typeof textures];
              return new THREE.MeshStandardMaterial({
                map: tex ?? null,
                color: tex ? "#ffffff" : "#ff8833",
                roughness: 0.85,
                metalness: 0,
              });
            })
          : new THREE.MeshStandardMaterial({
              map: (mats[0] ? textures[mats[0].name as keyof typeof textures] : undefined) ?? null,
              roughness: 0.85,
              metalness: 0,
            });
      }
    });

    // Normalise depuis la bbox *skinnée* (le rendu réel), pas les noeuds du squelette
    const skinnedBox = new THREE.Box3();
    clone.traverse((obj) => {
      const sm = obj as THREE.SkinnedMesh;
      if (sm.isSkinnedMesh) {
        sm.computeBoundingBox();
        if (sm.boundingBox) skinnedBox.union(sm.boundingBox);
      }
    });
    const size = new THREE.Vector3();
    skinnedBox.getSize(size);
    const scale = 3.1 / size.y;
    clone.scale.setScalar(scale);
    const center = new THREE.Vector3();
    skinnedBox.getCenter(center);
    clone.position.set(-center.x * scale, -skinnedBox.min.y * scale - 0.9, -center.z * scale);
    return clone;
  }, [scene, textures]);

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

useGLTF.preload(gokuGlb.url);
