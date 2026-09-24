import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class NodeFileReader {
    result = null;
    onload = null;
    onloadend = null;
    _finish() {
      if (typeof this.onload === "function") this.onload({ target: this });
      if (typeof this.onloadend === "function") this.onloadend({ target: this });
    }
    readAsDataURL(blob) {
      const type = blob.type || "application/octet-stream";
      blob.arrayBuffer().then((buf) => {
        this.result = `data:${type};base64,${Buffer.from(buf).toString("base64")}`;
        this._finish();
      });
    }
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        const arrayBuffer = buf.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        this.result = arrayBuffer;
        this._finish();
      });
    }
  };
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "models");
mkdirSync(outDir, { recursive: true });

const RX = (a) => new THREE.Matrix4().makeRotationX(a);
const RY = (a) => new THREE.Matrix4().makeRotationY(a);
const RZ = (a) => new THREE.Matrix4().makeRotationZ(a);
const TX = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
const SC = (x, y, z) => new THREE.Matrix4().makeScale(x, y, z);

const AIRFRAME = new THREE.MeshStandardMaterial({
  name: "Airframe",
  color: 0xcfd8ec,
  metalness: 0.75,
  roughness: 0.3,
});
const GLASS = new THREE.MeshStandardMaterial({
  name: "Canopy",
  color: 0x9ff4ff,
  metalness: 0.4,
  roughness: 0.12,
  transparent: true,
  opacity: 0.92,
});

const parts = [];

function pushPrimitive(geometry, matrix) {
  geometry.applyMatrix4(matrix);
  parts.push(geometry);
}

function compose(...mats) {
  let m = new THREE.Matrix4().identity();
  for (const mat of mats) {
    m = m.multiply(mat);
  }
  return m;
}

const FUSE_LEN = 3.6;
const FUSE_NOSE_R = 0.1;
const FUSE_TAIL_R = 0.24;

const fuselage = new THREE.CylinderGeometry(FUSE_NOSE_R, FUSE_TAIL_R, FUSE_LEN, 28, 1, false);
pushPrimitive(fuselage, compose(TX(0, 0, 0), RX(Math.PI / 2)));

const noseCone = new THREE.ConeGeometry(FUSE_NOSE_R, 1.2, 28);
pushPrimitive(noseCone, compose(TX(0, 0, FUSE_LEN / 2), RX(Math.PI / 2)));

const canopy = new THREE.SphereGeometry(0.22, 24, 16);
pushPrimitive(
  canopy,
  compose(TX(0, 0.16, 0.75), SC(1, 0.72, 1.9))
);

const leftWing = new THREE.BoxGeometry(1.75, 0.032, 1.6);
pushPrimitive(
  leftWing,
  compose(TX(-0.86, -0.08, -0.05), RZ(0.16), RX(-0.5))
);

const rightWing = new THREE.BoxGeometry(1.75, 0.032, 1.6);
pushPrimitive(
  rightWing,
  compose(TX(0.86, -0.08, -0.05), RZ(-0.16), RX(-0.5))
);

const wingTipLeft = new THREE.BoxGeometry(0.03, 0.34, 0.22);
pushPrimitive(wingTipLeft, compose(TX(-1.72, 0.05, 0.12), RZ(0.45)));

const wingTipRight = new THREE.BoxGeometry(0.03, 0.34, 0.22);
pushPrimitive(wingTipRight, compose(TX(1.72, 0.05, 0.12), RZ(-0.45)));

const horizTail = new THREE.BoxGeometry(0.72, 0.028, 1.5);
pushPrimitive(
  horizTail,
  compose(TX(0, -0.06, -1.5), RX(-0.5))
);

const vertFin = new THREE.BoxGeometry(0.045, 0.62, 0.98);
pushPrimitive(vertFin, compose(TX(0, 0.3, -1.45), RX(0.12), RZ(0.12)));

const bellyKeel = new THREE.BoxGeometry(0.09, 0.16, 2.4);
pushPrimitive(bellyKeel, compose(TX(0, -0.2, -0.15)));

const merged = mergeGeometries(parts, false);
merged.computeVertexNormals();

const glider = new THREE.Mesh(merged, AIRFRAME);
glider.name = "glider";
glider.rotation.x = 0;
glider.position.set(0, 0, 0);

const scene = new THREE.Scene();
scene.add(glider);

const exporter = new GLTFExporter();
const outPath = join(outDir, "glider.gltf");
await exporter.parseAsync(scene, {
  binary: false,
  onlyVisible: true,
}).then((result) => {
  writeFileSync(outPath, JSON.stringify(result));
  console.log("GLTF written:", outPath);
  console.log("Vertices:", merged.attributes.position.count);
  console.log("Indices:", merged.index?.count ?? "none");
  console.log("Size:", (Buffer.byteLength(JSON.stringify(result)) / 1024).toFixed(1), "KB");
});