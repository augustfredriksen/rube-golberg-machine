import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { intializeBrick, intializeDomino } from "../helpers/myAudioHelper.js";
import { createConvexTriangleShapeAddToCompound } from "../helpers/triangleMeshHelper.js";
import { createMaterials } from "../helpers/materials.js";

export async function createCustomThing(radius = 5, position = { x: 0, y: 0, z: 0 }) {
	let hasCollided = false;
    let clock = new THREE.Clock();
    let color = {r: Math.random(), g: Math.random(), b: Math.random()}

    const uniformData = {
        u_time: {
            type: 'f',
            value: clock.getElapsedTime(),
        },
        u_color: {
            type: 'f',
            r: color.r,
            g: color.g,
            b: color.b,
        }
    };
    const render = () => {
        uniformData.u_time.value = clock.getElapsedTime();
        window.requestAnimationFrame(render);
    }
    render();
	// THREE:
    let geometry = new THREE.DodecahedronGeometry(radius, 4);
    let material = new THREE.ShaderMaterial({
        wireframe: true,
        uniforms: uniformData,
        vertexShader: `
        varying vec3 pos;
        uniform float u_time;
        uniform float u_color;
        void main() {
            vec4 result;
            pos = position;
            result = vec4(
                position.x + sin(u_time*8.0 + position.z*3.0), 
                position.y + cos(u_time*10.0 + position.y*2.0) + u_time*0.1, 
                position.z - sin(u_time*5.0 + position.x*1.5), 1.0);
            //result = vec4(position.x, position.y, position.z, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * result;
        }`,
        fragmentShader: `
        float random (vec2 st) {
            return fract(sin(dot(st.xy,
                                 vec2(12.9898,78.233)))*
                43758.5453123);
        }
        uniform float u_time;
        varying vec3 pos;
        void main() {
            if(pos.x >= 0.0) {
                gl_FragColor = vec4(sin(u_time*10.0), 1.0, 0.0, 1.0);
            }
            else {
                gl_FragColor = vec4(sin(u_time*10.0), 1.0, 0.0, 1.0);
            }
        }`
    });

	let mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(position.x, position.y, position.z);

	mesh.receiveShadow = true;
	mesh.castShadow = true;
	mesh.name = "finish";
    addMeshToScene(mesh);
}