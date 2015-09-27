(function(){

function SceneSample2(scene, visualizer) {
    var sphere = new THREE.SphereGeometry(1);
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF
    });

    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF
    });

    var unit = {
        x: 100,
        y: 100,
        z: 100
    };
    var amount = {
        x: 1,
        y: 1,
        z: 10
    }

    var spheres = [];
    var lines = [];
    for (var x = 0; x < amount.x; x++) {
        for (var y = 0; y < amount.y; y++) {

            var zLine = new THREE.Geometry();

            for (var z = 0; z < amount.z; z++) {
                var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
                sphereMesh.position.set(x * unit.x, y * unit.y, z * unit.z);
                scene.add(sphereMesh);
                spheres.push(sphereMesh);

                zLine.vertices.push(sphereMesh.position.clone());
            }

            var zLineMesh = new THREE.Line(zLine, lineMaterial, THREE.LineStrip);
            scene.add(zLineMesh);
            lines.push(zLineMesh);
        }
    }

    console.log(scene)

    var testing = false;

    this.tick = function() {
        if (visualizer.isPlaying) {
            // var count = visualizer.analyser.frequencyBinCount;
            visualizer.analysis();
 
            var percent = visualizer.times[0] / 256;
            var line = lines[0];
            var geometry = line.geometry;
            var material = line.material;
            var vertices = [];

            var startVector = line.geometry.vertices[0];
            var endVector = line.geometry.vertices[1];

            var startZ = startVector.z;
            var endZ = endVector.z;
            var startX = startVector.x;
            var startY = startVector.y;
            var yOffset = unit.y * percent;

            var point = new THREE.Vector3();
            var count = 360;
            for (var i = 0; i < count; i++) {
                point.x = startX;
                point.z = startZ + (endZ - startZ) / count * i;
                point.y = Math.sin((point.z - startZ) * Math.PI / 180) * yOffset;
                
                vertices.push(point.clone());
            }

            if (!testing) {
                // testing = true;
                geometry.mergeVertices(vertices);
                material.needsUpdate = true;
                // console.log(percent, startVector, endVector, vertices);
            }
        }
    }
}   

window.SceneSample2 = SceneSample2;

})();