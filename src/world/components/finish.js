import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { createMaterials } from "../helpers/materials.js";
export async function createCustomThing(radius = 5, position = { x: 0, y: 0, z: 0 }) {
	let clock = new THREE.Clock();
	let color = { r: Math.random(), g: Math.random(), b: Math.random() };

	const uniformData = {
		u_time: {
			type: "f",
			value: clock.getElapsedTime(),
		},
	};
	const render = () => {
		uniformData.u_time.value = clock.getElapsedTime();
		window.requestAnimationFrame(render);
	};
	render();
	// THREE:
	let geometry = new THREE.DodecahedronGeometry(radius, 4);
	let material = new THREE.ShaderMaterial({
		wireframe: true,
		uniforms: uniformData,
		vertexShader: `
        varying vec3 pos;
        uniform float u_time;
        void main() {
            vec4 result;
            pos = position;
            result = vec4(
                position.x + sin(u_time*8.0 + position.z*3.0), 
                position.y + cos(u_time*10.0 + position.y*2.5), 
                position.z - sin(u_time*5.0 + position.x*1.5), 1.0);
            //result = vec4(position.x, position.y, position.z, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * result;
        }`,
		fragmentShader: `
        uniform float u_time;
        varying vec3 pos;
        void main() {
            if(pos.z >= 0.0) {
                gl_FragColor = vec4(sin(u_time*10.0), 0.0, 1.0, 1.0);
            }
            else {
                gl_FragColor = vec4(sin(u_time*10.0), 1.0, 0.0, 1.0);
            }
        }`,
	});

	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(position.x, position.y, position.z);

	mesh.receiveShadow = true;
	mesh.castShadow = true;
	mesh.name = "finish";
	addMeshToScene(mesh);
}

export async function create3dText() {
	let materials = await createMaterials();
	const loader = new FontLoader();
	loader.load("fonts/gentilis.json", async (font) => {
		const geometry = new TextGeometry("Avslutning!", {
			font: font,
			size: 1.5,
			height: 0.3,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.05,
			bevelSize: 0.03,
			bevelOffset: 0.01,
			bevelSegments: 5,
		});
		geometry.rotateY(Math.PI);
		let mesh = new THREE.Mesh(geometry, materials.textMaterial);
		mesh.position.set(15, -4, 22);
		addMeshToScene(mesh);
	});
}
