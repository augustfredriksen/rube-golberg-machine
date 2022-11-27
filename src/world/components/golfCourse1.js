import * as THREE from "three";
import { addMeshToScene } from "../helpers/myThreeHelper.js";
import { createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies } from "../helpers/myAmmoHelper.js";
import { createMaterials } from "../helpers/materials.js";
import { createConvexTriangleShapeAddToCompound } from "../helpers/triangleMeshHelper.js";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader.js";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry"

export async function createGolfCourseTriangleMesh(position={x: 0, y: 1, z: -22}) {
    const mass = 0;
    let compoundShape = new Ammo.btCompoundShape();
    let groupMesh = new THREE.Group();
    groupMesh.userData.tag = "golf_course";
    await createGolfCourseParts(groupMesh, compoundShape);

    let rigidBody = createAmmoRigidBody(compoundShape, groupMesh, 0.4, 0.6, position, mass);
    groupMesh.userData.physicsBody = rigidBody;
    // Legger til physics world:
    g_ammoPhysicsWorld.addRigidBody(
        rigidBody);

    addMeshToScene(groupMesh);
    g_rigidBodies.push(groupMesh);
    rigidBody.threeMesh = groupMesh;
}

async function createGolfCourseParts(groupMesh, compoundShape) {
    const materials = await createMaterials();

    let teeGeometry = new THREE.BoxGeometry(1, 0.4, 4);
    let teeMesh = new THREE.Mesh(teeGeometry, materials.metalMaterial);
    teeMesh.position.set(0, 0.4, 25 - teeMesh.geometry.parameters.depth/2);
    groupMesh.add(teeMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, teeMesh);

    let wallGeometry = new THREE.BoxGeometry(1, 2, 50);
    let wallMeshRight = new THREE.Mesh(wallGeometry, materials.metalMaterial);
    wallMeshRight.position.x = -4.5;
    wallMeshRight.receiveShadow = true;
    wallMeshRight.castShadow = true;
    groupMesh.add(wallMeshRight);
    createConvexTriangleShapeAddToCompound(compoundShape, wallMeshRight);


    let wallMeshLeft = wallMeshRight.clone();
    wallMeshLeft.position.set(4.5, wallMeshRight.position.y, wallMeshRight.position.z);
    groupMesh.add(wallMeshLeft);
    createConvexTriangleShapeAddToCompound(compoundShape, wallMeshLeft);

    const loader = new FontLoader();
    loader.load("fonts/gentilis.json", async (font) => {
        const geometry = new TextGeometry("Rube Goldberg Machine", {
            font: font,
            size: 1.2,
            height: 0.3,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0.01,
            bevelSegments: 2,
        });
        let textMesh = new THREE.Mesh(geometry, materials.textMaterial);
        textMesh.receiveShadow = true;
        textMesh.castShadow = true;
        textMesh.position.set(wallMeshLeft.position.x, wallMeshLeft.position.y+wallMeshLeft.geometry.parameters.height/2, wallMeshLeft.position.z);
        textMesh.rotateY(-Math.PI/2);
        groupMesh.add(textMesh)
    });


    let shortWallGeometry = new THREE.BoxGeometry(9, 2, 1);
    let shortWallFrontMesh = new THREE.Mesh(shortWallGeometry, materials.metalMaterial);
    shortWallFrontMesh.position.set(0, -0.5, 24.5);
    shortWallFrontMesh.receiveShadow = true;
    shortWallFrontMesh.castShadow = true;
    groupMesh.add(shortWallFrontMesh);

    let shortWallBackMesh = shortWallFrontMesh.clone();
    shortWallBackMesh.position.set(shortWallBackMesh.position.x, shortWallBackMesh.position.y, -shortWallBackMesh.position.z);
    groupMesh.add(shortWallBackMesh);

    let underPlaneGeometry = new THREE.PlaneGeometry(9, 50);
    underPlaneGeometry.rotateX(Math.PI/2);
    let underPlaneMesh = new THREE.Mesh(underPlaneGeometry, materials.fabricMaterial);
    underPlaneMesh.position.y = -0.5
    underPlaneMesh.receiveShadow = true;
    underPlaneMesh.castShadow = true;
    groupMesh.add(underPlaneMesh);

    let obstacleLeftGeometry = new THREE.BoxGeometry(0.5, 1, 7);
    obstacleLeftGeometry.rotateY(Math.PI/7);
    let obstacleLeftMesh = new THREE.Mesh(obstacleLeftGeometry, materials.metalMaterial );
    obstacleLeftMesh.position.set(3, 0, 10);
    obstacleLeftMesh.receiveShadow = true;
    obstacleLeftMesh.castShadow = true;
    groupMesh.add(obstacleLeftMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, obstacleLeftMesh);

    let obstacleRightGeometry = new THREE.BoxGeometry(3, 1, 0.5);
    let obstacleRightMesh = new THREE.Mesh(obstacleRightGeometry, materials.metalMaterial);
    obstacleRightMesh.position.set(-2.5, -0.25, 5);
    obstacleRightMesh.receiveShadow = true;
    obstacleRightMesh.castShadow = true;
    groupMesh.add(obstacleRightMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, obstacleRightMesh);

    let rampGeometry = new THREE.BoxGeometry(1, 0.2, 6);
    rampGeometry.rotateX(Math.PI/10);
    let rampMesh = new THREE.Mesh(rampGeometry, materials.metalMaterial);
    rampMesh.position.set(0, 0.5, -9);
    rampMesh.receiveShadow = true;
    rampMesh.castShadow = true;
    groupMesh.add(rampMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, rampMesh);

    let rampObstacleLeft = new THREE.BoxGeometry(3.5, 2, 1);
    let rampObstacleLeftMesh = new THREE.Mesh(rampObstacleLeft, materials.woodMaterial);
    rampObstacleLeftMesh.position.set(2.25, 0, rampMesh.position.z +2);
    rampObstacleLeftMesh.receiveShadow = true;
    rampObstacleLeftMesh.castShadow = true;
    groupMesh.add(rampObstacleLeftMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, rampObstacleLeftMesh);

    let rampObstacleRightMesh = rampObstacleLeftMesh.clone();
    rampObstacleRightMesh.position.set(-2.25, 0, rampMesh.position.z +2);
    groupMesh.add(rampObstacleRightMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, rampObstacleRightMesh);

    let rampPlatformGeometry = new THREE.BoxGeometry(8, 2, 8);
    let rampPlatformMesh = new THREE.Mesh(rampPlatformGeometry, materials.woodMaterial);
    rampPlatformMesh.position.set(0, 0.5, -15.8)
    rampPlatformMesh.receiveShadow = true;
    rampPlatformMesh.castShadow = true;
    groupMesh.add(rampPlatformMesh);
    createConvexTriangleShapeAddToCompound(compoundShape, rampPlatformMesh);

    const headLight = new THREE.SpotLight(0xffffff, 1, 55, Math.PI*0.2, 0, 0);
    headLight.position.set(0, 10, 55)
    headLight.visible = true;
    headLight.castShadow = true;
    headLight.shadow.camera.near = .1;
    headLight.shadow.camera.far = 30;
    headLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    headLight.target = rampMesh;
    groupMesh.add(headLight);
}

