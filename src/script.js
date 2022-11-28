import "./style.css";
import ammo from '../static/lib/ammo/ammo.js'
import { main } from "./world/world.js";
export let checked;
let forceValueZ, forceValueY;
export let startingForceZ, startingForceY;

//START!
export async function start() {
	startingForceZ = -forceValueZ.value
	startingForceY = forceValueY.value
console.log(startingForceZ)
console.log(startingForceY)

	ammo().then(async function (AmmoLib) {
		Ammo = AmmoLib;
		await main();
	});
}
document.getElementById("soundCheck").addEventListener("click", function () {
	if (!checked) {
		checked = true;
	} else {
		checked = false;
	}
});
document.getElementById("startBtn").addEventListener("click", function () {
	getForceValue();
	document.getElementById("startScreen").remove();
	start();
});

function getForceValue() {
	forceValueZ = document.getElementById("forceValueZ");
	forceValueY = document.getElementById("forceValueY");
}
