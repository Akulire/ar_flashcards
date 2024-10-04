const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './pqr.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		const pumpkin = await loadGLTF("./pumpkin/scene.gltf");
		pumpkin.scene.scale.set(0.3, 0.3, 0.3);
		pumpkin.scene.position.set(0, -0.2, 0);
		
		const pumpkinMixer = new THREE.AnimationMixer(pumpkin.scene);
		const pumpkinAction = pumpkinMixer.clipAction(pumpkin.animations[0]);
		pumpkinAction.play();
		// calling pumpkinClip and we are loading the audio from our hard disk
		const pumpkinAclip = await loadAudio("./sound/pumpkin.mp3");
		// we instantiated the THREE listener component using airListener variable
		const pumpkinListener = new THREE.AudioListener();
		// instantiated a speaker positional audio as pumpkinAudio
		const pumpkinAudio = new THREE.PositionalAudio(pumpkinListener);	
		
		
		const quil = await loadGLTF("./quil/scene.gltf");
		quil.scene.scale.set(0.4, 0.4, 0.4);
		quil.scene.position.set(0, -0.3, 0);
		
		const quilMixer = new THREE.AnimationMixer(quil.scene);
		const quilAction = quilMixer.clipAction(quil.animations[0]);
		quilAction.play();
		
		const quilAclip = await loadAudio("./sound/quil.mp3");
		const quilListener = new THREE.AudioListener();
		const quilAudio = new THREE.PositionalAudio(quilListener);	
		
		const robot = await loadGLTF("./robot/scene.gltf");
		robot.scene.scale.set(0.1, 0.1, 0.1);
		robot.scene.position.set(0, -0.3, 0);
		
		const robotMixer = new THREE.AnimationMixer(robot.scene);
		const robotAction = robotMixer.clipAction(robot.animations[0]);
		robotAction.play();
		
		const robotAclip = await loadAudio("./sound/robot.mp3");
		const robotListener = new THREE.AudioListener();
		const robotAudio = new THREE.PositionalAudio(robotListener);	
		
		const pumpkinAnchor = mindarThree.addAnchor(0);
		pumpkinAnchor.group.add(pumpkin.scene);
		// added listener to the camera
		camera.add(pumpkinListener);
		// we set the referal distance from which the audio should fade out
		pumpkinAudio.setRefDistance(100);
		// set the buffer of audio to stream
		pumpkinAudio.setBuffer(pumpkinAclip);
		// we sset the audio to loop
		pumpkinAudio.setLoop(true);
		// we added the audio to the anchor of pumpkin which will be activated on seeing  the pumpkin image
		pumpkinAnchor.group.add(pumpkinAudio)
		
		// make pumpkin audio play only when the target of pumpkin image is detected
		pumpkinAnchor.onTargetFound = () => {
			pumpkinAudio.play();
		}
		// make pumpkin audio pause then the target image is lost in the camera
		pumpkinAnchor.onTargetLost = () => {
			pumpkinAudio.pause();
		}
		
		
		const quilAnchor = mindarThree.addAnchor(1);
		quilAnchor.group.add(quil.scene);
		
		camera.add(quilListener);
		quilAudio.setRefDistance(100);
		quilAudio.setBuffer(quilAclip);
		quilAudio.setLoop(true);
		quilAnchor.group.add(quilAudio)
		quilAnchor.onTargetFound = () => {
			quilAudio.play();
		}
		quilAnchor.onTargetLost = () => {
			quilAudio.pause();
		}
		
		
		const robotAnchor = mindarThree.addAnchor(2);
		robotAnchor.group.add(robot.scene);
		
		camera.add(robotListener);
		robotAudio.setRefDistance(100);
		robotAudio.setBuffer(robotAclip);
		robotAudio.setLoop(true);
		robotAnchor.group.add(robotAudio)
		robotAnchor.onTargetFound = () => {
			robotAudio.play();
		}
		robotAnchor.onTargetLost = () => {
			robotAudio.pause();
		}
		
		const clock = new THREE.Clock();
		
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			pumpkinMixer.update(delta);
			quilMixer.update(delta);
			robotMixer.update(delta);
			robot.scene.rotation.set(0, robot.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
	
});
