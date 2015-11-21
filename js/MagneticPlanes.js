define(function (require) {

    "use strict"

    require("ThreeJS");

    function MagneticPlanes() {

        // public
        var planes = [];
        var planeColors = [0xDBDBD2, 0xFCE7DD, 0xF0E4C9, 0xF0E4C9, 0xFCBD8D, 0xE3C47C];
        var planeWidth = 5;
        var planeHeight = 5;
        var numPlanes = 10000;
        var areaWidth = window.innerWidth;
        var areaHeight = window.innerHeight;
        var scene;
        var camera;

        // internal
        var lastPosX = 0;
        var lastPosY = -window.innerHeight / 2;
        var mousePos;

        var reveal = {
            planes:planes,
            planeColors:planeColors,
            planeWidth:planeWidth,
            planeHeight:planeHeight,
            numPlanes:numPlanes,
            areaWidth:areaWidth,
            areaHeight:areaHeight,
            scene:scene,
            camera:camera,
            init:init,
            render:render
        };

        function init() {

            for (var i = 0; i < numPlanes; i++) {

                // create a geometry
                var geometry = new THREE.BoxGeometry(planeWidth, planeHeight, 0.1);

                // add a material to the mesh
                var randomColor = planeColors[Math.floor(Math.random() * planeColors.length)];

                var material;
                //if (randomColor == 0x98782c) {
                //    material = new THREE.MeshPhongMaterial({
                //        color: randomColor,
                //        emissive: 0x111102,
                //        specular: randomColor,
                //        shininess: 100
                //    });
                //} else {
                material = new THREE.MeshBasicMaterial({color: randomColor});
                //}

                // create a mesh by combining the geometry and material
                var plane = new THREE.Mesh(geometry, material);
                if (lastPosX >= areaWidth) {
                    lastPosX = -areaWidth / 2;
                    lastPosY += 20;
                }
                plane.position.x = lastPosX + 10 + Math.random() * 10;
                plane.position.y = lastPosY + Math.random() * 20 - 10;
                plane.rotation.z = (Math.random() * 360) * (Math.PI / 180);

                lastPosX = plane.position.x;

                // exit the loop if we're creating triangles outside the window size
                if (lastPosY > areaHeight / 2) {
                    break;
                }
                planes.push(plane);

                // add the mesh to the scene
                if (reveal.scene) {
                    reveal.scene.add(plane);
                }



                //var delay = Math.random() * 2.5;
                //if (delay > 2.45) {
                //    delay += 1.5 * Math.random();
                //}
                //TweenMax.from(plane.position, 4.5, {y: 200, z: 410, ease: "Power3.easeIn", delay: delay});
                //TweenMax.from(plane.rotation, 4.5, {
                //    x: Math.random() * 100,
                //    y: Math.random() * 100,
                //    z: Math.random() * 100,
                //    ease: "Linear.easeNone",
                //    delay: delay,
                //    onCompleteParams: [plane],
                //    onComplete: function (p) {
                //
                //
                //        if (Math.random() < 0.3) {
                //            var rando = (Math.random() * 0.15) + 0.05;
                //            TweenMax.to(p.position, rando, {
                //                z: Math.random() * 15,
                //                ease: "Sine.easeOut",
                //                yoyo: true,
                //                repeat: 1
                //            });
                //            TweenMax.to(p.rotation, rando * 2, {x: 180 * (Math.PI / 180)});
                //        } else {
                //            var addlRotation = p.rotation.z + ((Math.random() * 90 - 90) * (Math.PI / 180));
                //            TweenMax.to(p.rotation, Math.random() * 0.5, {z: addlRotation});
                //            TweenMax.to(p.position, Math.random() * 0.5, {
                //                x: "+=" + String(Math.random * 5),
                //                y: "-=" + String(Math.random() * 5)
                //            })
                //        }
                //    }
                //});
            }

            if (!reveal.scene) {
                console.warn("no stage to add confetti");
            }

            if (!reveal.camera) {
                console.warn("mouse interaction for magetic planes is disabled because no camera was provided")
            }

            document.addEventListener("mousemove", onMouseMove);
        }

        function onMouseMove(e) {

            if (reveal.camera) {

                var vector = new THREE.Vector3();

                vector.set(
                    ( e.clientX / window.innerWidth ) * 2 - 1,
                    -( e.clientY / window.innerHeight ) * 2 + 1,
                    0.5);

                vector.unproject(reveal.camera);

                var dir = vector.sub(reveal.camera.position).normalize();

                var distance = -reveal.camera.position.z / dir.z;

                mousePos = reveal.camera.position.clone().add(dir.multiplyScalar(distance));
            }
        }

        function calculateMouseProximity(obj) {

            var proximity = {x:0, y:0};

            proximity.x = mousePos.x - obj.position.x;
            proximity.y = mousePos.y - obj.position.y;

            return proximity;
        }

        function render() {
            if (mousePos) {
                var affinity = 10;
                for (var i = 0; i < planes.length; i++) {
                    var planeProx = calculateMouseProximity(planes[i]);
                    var amt = 1;
                    if ((planeProx.x > 0 && planeProx.x < affinity) && (planeProx.y > -affinity && planeProx.y < affinity)) {
                        amt = (Math.abs(planeProx.x) < 1) ? (1 / affinity) : Math.abs(planeProx.x) / affinity;
                        planes[i].position.x -= amt;
                    } else if ((planeProx.x > -affinity && planeProx.x < 0) && (planeProx.y > -affinity && planeProx.y < affinity)) {
                        amt = (Math.abs(planeProx.x) < 1) ? (1 / affinity) : Math.abs(planeProx.x) / affinity;
                        planes[i].position.x += amt;
                    }
                    if ((planeProx.x > -affinity && planeProx.x < affinity) && (planeProx.y > -affinity && planeProx.y < 0)) {
                        amt = (Math.abs(planeProx.y) < 1) ? (1 / affinity) : Math.abs(planeProx.y) / affinity;
                        planes[i].position.y += amt;
                    } else if ((planeProx.x > -affinity && planeProx.x < affinity) && (planeProx.y > 0 && planeProx.y < affinity)) {
                        amt = (Math.abs(planeProx.y) < 1) ? (1 / affinity) : Math.abs(planeProx.y) / affinity;
                        planes[i].position.y -= amt;
                    }
                }
            }
        }

        return reveal;
    }

    return MagneticPlanes;

});