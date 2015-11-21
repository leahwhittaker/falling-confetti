define(function (require) {

    "use strict"

    require("ThreeJS");
    var MagneticPlanes = require("MagneticPlanes");
    var TweenMax = require("TweenMax");

    function FallingConfetti() {

        // renderer
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xFFFFFF);
        document.body.appendChild(renderer.domElement);

        // scene
        var scene = new THREE.Scene();

        // camera
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 400;

        // in order to see what's in our scene, we need a light source
        var pointerOne = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.1);
        pointerOne.position.set(-100,-90,130);

        // add the light to the scene
        scene.add(pointerOne);

        // add magnetic planes
        var magPlanes = new MagneticPlanes();
        magPlanes.scene = scene;
        magPlanes.camera = camera;
        magPlanes.init();

        function render() {

            requestAnimationFrame(render);

            magPlanes.render();

            renderer.render(scene, camera);
        }

        render();

//            var axisHelper = new THREE.AxisHelper( 5 );
//            scene.add( axisHelper );

    }

    return FallingConfetti();

});