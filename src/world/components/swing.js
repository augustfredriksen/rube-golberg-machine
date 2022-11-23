import * as THREE from "three";
import { addMeshToScene, g_camera, g_controls, initializeBoing, intializeDomino, intializeGolfSwing } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { colorScheme } from "../../../static/colorScheme.js";
import { createConvexTriangleShapeAddToCompound } from "../helpers/triangleMeshHelper.js";

export async function createHingedSphere() {
    const sphere = createSphere();
    const anchor = createAnchor();

	const anchorPivot = new Ammo.btVector3( 0, 0.5, 0 );
	const anchorAxis = new Ammo.btVector3(1,0,0);
	const armPivot = new Ammo.btVector3( -2, 0, 0 );
	const armAxis = new Ammo.btVector3(0,1,0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		anchor,
		sphere,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI;
	const upperLimit = Math.PI;
	const softness = 5;
	const biasFactor = 1;
	const relaxationFactor = .1;
	hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	hingeConstraint.enableAngularMotor(true, 0.3, 0.01);
	g_ammoPhysicsWorld.addConstraint( hingeConstraint, true );
}

function createSphere(position={x: 0, y: 5, z:-40}) {
    let isCollided = false;
	const radius = .2;;
	const mass = .2;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: colorScheme.gray, transparent: true, opacity: 1}));
	mesh.name = 'hinge_sphere';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
        if(!isCollided) {
            initializeBoing();
            isCollided = true;
        }
	};
	//AMMO
	const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
    }

function createAnchor(position={x: 0, y: 5.2, z:-40}) {
	const radius = .2;;
	const mass = 0;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: 0xb846db, transparent: true, opacity: 0}));
	mesh.name = 'anchor';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//AMMO
	const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
    }

    export async function createSwingTriangleMesh(position={x: 2.5, y: 4, z: -40}) {
        const mass = 0;
        let compoundShape = new Ammo.btCompoundShape();
        let groupMesh = new THREE.Group();
        groupMesh.userData.tag = "swing";
        await createSwingParts(groupMesh, compoundShape);

        let rigidBody = createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);
        groupMesh.userData.physicsBody = rigidBody;
        // Legger til physics world:
        g_ammoPhysicsWorld.addRigidBody(
            rigidBody);
    
        addMeshToScene(groupMesh);
        g_rigidBodies.push(groupMesh);
        rigidBody.threeMesh = groupMesh;
    }

    async function createSwingParts(groupMesh, compoundShape) {
        let pillarGeometry = new THREE.BoxGeometry(.5, 5, .5);
        let material = new THREE.MeshStandardMaterial({color: colorScheme.pink, transparent: true, opacity: 1});
        let pillarMesh = new THREE.Mesh(pillarGeometry, material);
        pillarMesh.castShadow = true;
        pillarMesh.receiveShadow = true;
        pillarMesh.name = "pillar";
        groupMesh.add(pillarMesh);
        createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh);

        let pillarMesh2 = pillarMesh.clone();
        pillarMesh2.position.set(-5, 0, 0);
        groupMesh.add(pillarMesh2);
        createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh2);

        let pillarMesh3 = pillarMesh.clone();
        pillarMesh3.position.set(-3.5, 0, 7);
        groupMesh.add(pillarMesh3);
        createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh3);

        let pillarMesh4 = pillarMesh.clone();
        pillarMesh4.position.set(-1.5, 0, 7);
        groupMesh.add(pillarMesh4);
        createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh4);

        let pillarMesh5 = pillarMesh.clone();
        pillarMesh5.position.set(-3.5, 0, 23);
        groupMesh.add(pillarMesh5);
        createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh5);

        let pillarMesh6 = pillarMesh.clone();
        pillarMesh6.position.set(-1.5, 0, 23);
        groupMesh.add(pillarMesh6);
        createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh6);

        let pillarMesh7 = pillarMesh.clone();
        pillarMesh7.position.set(-3.5, 0, 17);
        groupMesh.add(pillarMesh7);
        createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh7);

        let pillarMesh8 = pillarMesh.clone();
        pillarMesh8.position.set(-1.5, 0, 17);
        groupMesh.add(pillarMesh8);
        createConvexTriangleShapeAddToCompound(compoundShape, pillarMesh8);

        let topGeometry = new THREE.BoxGeometry(6, .5, 1);
        let topMesh = new THREE.Mesh(topGeometry, material);
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        topMesh.name = "top";
        topMesh.position.set(pillarMesh2.position.x/2, pillarMesh.geometry.parameters.height/2, 0);
        groupMesh.add(topMesh);
        createConvexTriangleShapeAddToCompound(compoundShape, topMesh);

        let roofGeometry = new THREE.BoxGeometry(3, .5, 10);
        let roofMesh = new THREE.Mesh(roofGeometry, material);
        roofMesh.castShadow = true;
        roofMesh.receiveShadow = true;
        roofMesh.name = "roof";
        roofMesh.position.set(pillarMesh2.position.x/2, pillarMesh.geometry.parameters.height/2, roofMesh.geometry.parameters.depth/2);
        groupMesh.add(roofMesh);
        createConvexTriangleShapeAddToCompound(compoundShape, roofMesh);

        let roofMiddleGeometry = new THREE.BoxGeometry(.5, .5, 10);
        let roofMiddleMesh = new THREE.Mesh(roofMiddleGeometry, material);
        roofMiddleMesh.castShadow = true;
        roofMiddleMesh.receiveShadow = true;
        roofMiddleMesh.name = "roof";
        roofMiddleMesh.position.set(roofMesh.position.x/2, pillarMesh.geometry.parameters.height/2, roofMesh.geometry.parameters.depth);
        groupMesh.add(roofMiddleMesh);
        createConvexTriangleShapeAddToCompound(compoundShape, roofMiddleMesh);

        let roofMiddleMesh2 = roofMiddleMesh.clone();
        roofMiddleMesh2.position.x = roofMiddleMesh.position.x*3;
        groupMesh.add(roofMiddleMesh2);
        createConvexTriangleShapeAddToCompound(compoundShape, roofMiddleMesh2);

        let roofMesh2 = roofMesh.clone();
        roofMesh2.position.set(pillarMesh2.position.x/2, pillarMesh.geometry.parameters.height/2, roofMiddleMesh.geometry.parameters.depth*2);
        groupMesh.add(roofMesh2);
        createConvexTriangleShapeAddToCompound(compoundShape, roofMesh2);
        
    }