import * as THREE from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";

export function createAmmoDomino(rotation = {x: 0, y: 0, z: 0}, position= {x: 0, y: 0, z: 0}) {
	const mass=2;
    const width = 0.5;
    const height = 1;
    const depth = 0.15;
	// THREE:
	let geometry = new THREE.BoxGeometry( width, height, depth, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: colorScheme.gray, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.position.set(position.x, position.y, position.z);
    mesh.collisionResponse = (mesh1) => {
        rigidBody.setGravity(new Ammo.btVector3(0, -18, 0))
	};

	mesh.receiveShadow = true;
    mesh.castShadow = true;
	mesh.name = 'domino';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, height/2, depth/2));
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, .1, .6, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		1,
        1 | 1 | 1 | 1);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function createRotatedDomino(radius, steps, centerX, centerZ) {
    var xValues = [centerX]
    var zValues = [centerZ]
    for (let i = 1; i < steps; i++) {
        xValues[i] = (centerX + radius * Math.cos(Math.PI * i / steps*2-Math.PI/2));
        zValues[i] = (centerZ + radius * Math.sin(Math.PI * i / steps*2-Math.PI/2));
    }
    for (let i = 1; i < xValues.length; i++) {
        createAmmoDomino(
            {x: 0, y: Math.PI/2 - i*Math.PI/180, z: 0},
            {x: xValues[i], y: 0, z: zValues[i]}
            )
    }
}

export function createMultipleDominos(steps, position={x: 0, y: 7.5, z: -39}) {
    for (let i = 0; i < steps; i++) {
        createAmmoDomino(
            {x: 0, y: 0, z: 0},
            {x: position.x, y: position.y, z: position.z + i*0.5}
            )
    }
}

export function createTriangleDominos(steps, position={x: 0, y: 0, z: 0}) {
    let xPos;
    for (let i = 0; i < steps; i++) {
            if(xPos == position.x) {
                position.x += .01;
            }
            createAmmoDomino(
                {x: 0, y: 0, z: 0},
                {x: xPos+i*0.5, y: position.y, z: position.z+i}
            )
            createAmmoDomino(
                {x: 0, y: 0, z: 0},
                {x: xPos-i*0.5, y: position.y, z: position.z+i}
            )
            xPos = position.x;
        }
}

export function createOppositeTriangleDominos(steps, position={x: 0, y: 0, z: 0}) {
    let xPos;
    for (let i = 0; i < steps; i++) {
            if(xPos == position.x) {
                position.x += .01;
            }
            createAmmoDomino(
                {x: 0, y: 0, z: 0},
                {x: xPos+i*0.5, y: position.y, z: position.z-i}
            )
            createAmmoDomino(
                {x: 0, y: 0, z: 0},
                {x: xPos-i*0.5, y: position.y, z: position.z-i}
            )
            xPos = position.x;
        }
}