import * as THREE from "three";

export const LOCAL_GLIDER_URL = "/models/glider.glb";

export const FALLBACK_GLIDER_URL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/CesiumAir/glTF-Binary/CesiumAir.glb";

export const TARGET_SPAN = 4;

export function normalizingMatrix(root: THREE.Object3D): THREE.Matrix4 {
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 1e-6);
  const scale = TARGET_SPAN / maxDim;
  return new THREE.Matrix4().compose(
    new THREE.Vector3(-center.x * scale, -center.y * scale, -center.z * scale),
    new THREE.Quaternion(),
    new THREE.Vector3(scale, scale, scale)
  );
}

export function decomposeMatrix(
  matrix: THREE.Matrix4
): { position: THREE.Vector3; quaternion: THREE.Quaternion; scale: THREE.Vector3 } {
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  matrix.decompose(position, quaternion, scale);
  return { position, quaternion, scale };
}