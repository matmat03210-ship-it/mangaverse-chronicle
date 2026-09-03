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

    // Normalise : recentre au sol, hauteur ~2.6 unités
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log("[goku] bbox size:", size.toArray(), "min:", box.min.toArray());
    const scale = 2.6 / Math.max(size.x, size.y, size.z);
    clone.scale.setScalar(scale);
    const box2 = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    box2.getCenter(center);
    clone.position.set(-center.x, -box2.min.y - 0.9, -center.z);
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
