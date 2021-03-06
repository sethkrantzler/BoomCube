const NUM_BARS = 16

window.onload = function() {
  setupFileUpload()


  var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');
  var source = document.getElementById('mySource');
  var audioSrc = ctx.createMediaElementSource(audio);
  var analyser = ctx.createAnalyser();

  analyser.fftSize = NUM_BARS*2
  audio.crossOrigin = "anonymous";
  
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
  let third = Math.floor(NUM_BARS/3)

  for (var i = 0; i < NUM_BARS; i++){
    if (i < third){
      var rCube = new THREE.Mesh(geometry, cubeMaterial2);
      rCube.position.y = -4;
      rCube.position.x = -1 * NUM_BARS + 2*i;
      cubes.push(rCube);
      scene.add(cubes[i]);
    }
    else if (i >= NUM_BARS-third){
      var yCube = new THREE.Mesh(geometry, cubeMaterial3);
      yCube.position.y = -4;
      yCube.position.x = -1 * NUM_BARS + 2*i;
      cubes.push(yCube);
      scene.add(cubes[i]);
    }
    else {
      var gCube = new THREE.Mesh(geometry, cubeMaterial1);
      gCube.position.y = -4;
      gCube.position.x = -1 * NUM_BARS + 2*i;
      cubes.push(gCube);
      scene.add(cubes[i]);
    }
  }

  function renderFrame() {
     requestAnimationFrame(renderFrame);
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);

     for (var i = 0; i < NUM_BARS; i++){
       cubes[i].scale.y = frequencyData[i] / 25;
       //cubes[i].rotation.y += 0.1;
     }

     renderer.render( scene, camera );
     // render frame based on values in frequencyData

  }

  audio.load();
  audio.play();
  renderFrame();


};

function setupFileUpload() {
  document.getElementById('file').onchange = function() {
    console.log("selected")

    let file = document.getElementById('file').files[0]
    let blob = window.URL || window.webkitURL
    let fileURL = blob.createObjectURL(file)
    console.log(fileURL)
    document.getElementById('myAudio').src = fileURL;

  }
}
