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

        // animate the planes like confetti
        for (var i = 0; i < magPlanes.planes.length; i++) {
            var plane = magPlanes.planes[i];
            var delay = Math.random() * 2.5;
            if (delay > 2.45) {
                delay += 1.5 * Math.random();
            }
            TweenMax.from(plane.position, 4.5, {y: 200, z: 410, ease: "Power3.easeIn", delay: delay});
            TweenMax.from(plane.rotation, 4.5, {
                x: Math.random() * 100,
                y: Math.random() * 100,
                z: Math.random() * 100,
                ease: "Linear.easeNone",
                delay: delay,
                onCompleteParams: [plane],
                onComplete: function (p) {


                    if (Math.random() < 0.3) {
                        var rando = (Math.random() * 0.15) + 0.05;
                        TweenMax.to(p.position, rando, {
                            z: Math.random() * 15,
                            ease: "Sine.easeOut",
                            yoyo: true,
                            repeat: 1
                        });
                        TweenMax.to(p.rotation, rando * 2, {x: 180 * (Math.PI / 180)});
                    } else {
                        var addlRotation = p.rotation.z + ((Math.random() * 90 - 90) * (Math.PI / 180));
                        TweenMax.to(p.rotation, Math.random() * 0.5, {z: addlRotation});
                        TweenMax.to(p.position, Math.random() * 0.5, {
                            x: "+=" + String(Math.random * 5),
                            y: "-=" + String(Math.random() * 5)
                        })
                    }
                }
            });
        }

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