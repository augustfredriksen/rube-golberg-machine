import './style.css';
import { main } from './world/world.js'

//START!
Ammo().then( async function( AmmoLib ) {
	Ammo = AmmoLib;
	await main();
} );
