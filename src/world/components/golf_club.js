import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

export function createHingedArm(mass = 10, color=0x00FF00, position={x:50, y:0, z:0}) {

	const rigidBodyArm = createAmmoGolfClub();
	const rigidBodyAnchor = createAnchor({x:-5, y:6, z:0});
	//const armLength = rigidBodyArm.domino;
    console.log()
	//AMMO, hengsel: SE F.EKS: https://www.panda3d.org/manual/?title=Bullet_Constraints#Hinge_Constraint:
	const anchorPivot = new Ammo.btVector3( 0, 0, 0 );
	const anchorAxis = new Ammo.btVector3(0,1,0);
	const armPivot = new Ammo.btVector3( 4, 0, 0 );
	const armAxis = new Ammo.btVector3(0,1,0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		rigidBodyAnchor,
		rigidBodyArm,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI/3;
	const upperLimit = Math.PI/3;
	const softness = 0.9;
	const biasFactor = 0.3;
	const relaxationFactor = 1.0;
	hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	hingeConstraint.enableAngularMotor(true, 0, 10);
	g_ammoPhysicsWorld.addConstraint( hingeConstraint, false );

}


function createAmmoGolfClub(rotation={x: -Math.PI/2, y: 0, z: 0}, position= {x: -3, y: 6, z: 0}) {
	const mass=1;
    let domino;
	// THREE:
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    loader.load('assets/models/golf_club/golf_club.glb', (gltf) => {
        console.log(gltf.scene)
        domino =  gltf.scene.children[0].children[0].children[0].children[0];
        console.log(domino.geometry)
        domino.scale.set(5, 5, 5);
        domino.position.set(position.x, position.y, position.z);
        domino.rotation.set(rotation.x, rotation.y, rotation.z);
        domino.receiveShadow = true;
        domino.castShadow = true;

        let triangle_mesh = new Ammo.btTriangleMesh();
        let vecA = new Ammo.btVector3(0, 0, 0);
        let vecB = new Ammo.btVector3(0, 0, 0);
        let vecC = new Ammo.btVector3(0, 0, 0);

        let verticesPos = domino.geometry.getAttribute('position').array;
        let triangles = [];
        for(let i = 0; i < verticesPos.length; i +=3) {
            triangles.push({
                x: verticesPos[i],
                y: verticesPos[i+1],
                z: verticesPos[i+2],
            });
        }

        for(let i = 0; i < triangles.length - 3; i +=3) {
            vecA.setX(triangles[i].x);
            vecA.setY(triangles[i].y);
            vecA.setZ(triangles[i].z);

            vecB.setX(triangles[i + 1].x);
            vecB.setY(triangles[i + 1].y);
            vecB.setZ(triangles[i + 1].z);

            vecC.setX(triangles[i + 2].x);
            vecC.setY(triangles[i + 2].y);
            vecC.setZ(triangles[i + 2].z);

            triangle_mesh.addTriangle(vecA, vecB, vecC, true)
        }
        Ammo.destroy(vecA);
        Ammo.destroy(vecB);
        Ammo.destroy(vecC);

        const shape = new Ammo.btConvexTriangleMeshShape(triangle_mesh);
        domino.geometry.verticesNeedUpdate = true;
        shape.getMargin( 0.05 );
        let rigidBody = createAmmoRigidBody(shape, domino, 0.3, 1, position, mass);
        rigidBody.setDamping(0.1, 0.5);
        rigidBody.setActivationState(4);

        domino.userData.physicsBody = rigidBody;

        // Legger til physics world:
        g_ammoPhysicsWorld.addRigidBody(
            rigidBody,
            1, 1 | 1 | 1);
    
        addMeshToScene(domino);
        g_rigidBodies.push(domino);
        rigidBody.threeMesh = domino;
    })
    return domino;
}

function createAnchor(position={x: 0, y: 0, z:0}) {
	const radius = .2;;
	const mass = 0;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: 0xb846db, transparent: true, opacity: 0.5}));
	mesh.name = 'hinge_anchor';
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