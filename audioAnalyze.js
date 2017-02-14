window.onload = function() {
  var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');
  var source = document.getElementById('mySource');
  var audioSrc = ctx.createMediaElementSource(audio);
  var analyser = ctx.createAnalyser();
  audio.crossOrigin = "anonymous";
  source.src = "http://crossorigin.me/https://w-labs.at/experiments/audioviz/GYAKO.mp3";
  // we have to connect the MediaElementSource with the analyser
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
  // frequencyBinCount tells you how many values you'll receive from the analyser
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  var renderer = new THREE.WebGLRenderer({alpha: true});
  camera.position.z = 18;
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // Setup all the cubes
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //the line below makes it so that scaling the y axis only scales from the bottom,
  //removing it will create a symettric visualization of the frequencies
  geometry.translate( 0, 0.5, 0 );

  // each cube side gets another color
  var cubeMaterials1 = [
      new THREE.MeshBasicMaterial({color:0x00e500, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0x00b200, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0x009900, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0x007f00, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0x00cc00, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0x00e500, transparent:true, opacity:0.8}),
  ];
  // create a MeshFaceMaterial, allows cube to have different materials on each face
  var cubeMaterial1 = new THREE.MeshFaceMaterial(cubeMaterials1);
  var cubeMaterials2 = [
      new THREE.MeshBasicMaterial({color:0xff4c4c, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xff6666, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xff7f7f, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xff9999, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xffb2b2, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xffcccc, transparent:true, opacity:0.8}),
  ];
  // create a MeshFaceMaterial, allows cube to have different materials on each face
  var cubeMaterial2 = new THREE.MeshFaceMaterial(cubeMaterials2);
  var cubeMaterials3 = [
      new THREE.MeshBasicMaterial({color:0xffa64c, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xffb266, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xffcc99, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xffbf7f, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xffd8b2, transparent:true, opacity:0.8}),
      new THREE.MeshBasicMaterial({color:0xffe5cc, transparent:true, opacity:0.8}),
  ];
  // create a MeshFaceMaterial, allows cube to have different materials on each face
  var cubeMaterial3 = new THREE.MeshFaceMaterial(cubeMaterials3);
  var cubes = [];

  //add all the cubes you want to the scene
  for (var i = 0; i < 12; i++){
    if (i < 3){
      var rCube = new THREE.Mesh(geometry, cubeMaterial2);
      rCube.position.y = -4;
      rCube.position.x = -12 + 2*i;
      cubes.push(rCube);
      scene.add(cubes[i]);
    }
    else if (i > 9){
      var yCube = new THREE.Mesh(geometry, cubeMaterial3);
      yCube.position.y = -4;
      yCube.position.x = -12 + 2*i;
      cubes.push(yCube);
      scene.add(cubes[i]);
    }
    else {
      var gCube = new THREE.Mesh(geometry, cubeMaterial1);
      gCube.position.y = -4;
      gCube.position.x = -12 + 2*i;
      cubes.push(gCube);
      scene.add(cubes[i]);
    }
  }

  function renderFrame() {
     requestAnimationFrame(renderFrame);
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);

     for (var i = 0; i < 12; i++){
       cubes[i].scale.y = frequencyData[i] / 25;
     }

     renderer.render( scene, camera );
     // render frame based on values in frequencyData

  }

  audio.load();
  audio.play();
  renderFrame();


};
