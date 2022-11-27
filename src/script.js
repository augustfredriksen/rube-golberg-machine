import "./style.css";
import { main } from "./world/world.js";
export let checked;

//START!
export async function start() {
	Ammo().then(async function (AmmoLib) {
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
	document.getElementById("startScreen").remove();
	start();
});
