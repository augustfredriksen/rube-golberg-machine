import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";

export async function createSeesaw() {
    const arm = createArm();
    const anchor = createAnchor();
    createAmmoSeesawBottom();
    const armLength = arm.threeMesh.geometry.parameters.height;

	const anchorPivot = new Ammo.btVector3( 0, .5, 1 );
	const anchorAxis = new Ammo.btVector3(0,1,0);
	const armPivot = new Ammo.btVector3( - armLength/2, .5, 0.8 );
	const armAxis = new Ammo.btVector3(0,1,0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		anchor,
		arm,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI;
	const upperLimit = Math.PI;
	const softness = 5;
	const biasFactor = .1;
	const relaxationFactor = .1;
	hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	hingeConstraint.enableAngularMotor(true, 0, 1);
	g_ammoPhysicsWorld.addConstraint( hingeConstraint, true );
}

function createArm(position={x: 0, y: 7.5, z:-22}) {
	let width = .5;
    let height = .1;
    let depth = 6;
	const mass = 0.2;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.BoxGeometry(width, height, depth),
		new THREE.MeshStandardMaterial({color: colorScheme.gray, transparent: true, opacity: 1}));
	mesh.name = 'hinge_arm';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
	const shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, length/2, depth/2));
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		1,
		1 | 1 | 1);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
    }

function createAnchor(position={x: 0, y: 7.5, z:-24}) {
	const radius = .2;;
	const mass = 0;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: 0xb846db, transparent: true, opacity: .5}));
	mesh.name = 'anchor';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
	const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		1,
		1 | 1 | 1);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
    }

    function createAmmoSeesawBottom(position={x: 0, y: 7, z:-24}) {
        let width = .2;
        let height = 1;
        let depth = .2;
        const mass = 0;
    
        //THREE
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            new THREE.MeshStandardMaterial({color: colorScheme.gray, transparent: true, opacity: 1}));
        mesh.name = 'seesaw_bottom';
        mesh.position.set(position.x, position.y, position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        //AMMO
        let shape = new Ammo.btBoxShape(new Ammo.btVector3(width/2, height/2, depth/2));
        shape.setMargin( 0.05 );
        let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 1, position, mass);
    
        mesh.userData.physicsBody = rigidBody;
    
        // Legger til physics world:
        g_ammoPhysicsWorld.addRigidBody(
            rigidBody,
            1,
            1 | 1 | 1);
    
        addMeshToScene(mesh);
        g_rigidBodies.push(mesh);
        rigidBody.threeMesh = mesh;
        }