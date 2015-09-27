(function() {
    var scene = new window.Scene();
    window.addEventListener('resize', function() {
        scene.resize();
    });
    document.body.appendChild(scene.renderer.domElement);
    scene.render();

    window.scene = scene.scene;
    window.camera = scene.camera;
    window.renderer = scene.renderer;
    window.controls = scene.controls;

    var visualizer = new window.Visualizer();
    visualizer.load('./sugar.mp3');
    window.visualizer = visualizer;

    // var sample1 = new SceneSample1(scene.scene, visualizer);
    var sample2 = new SceneSample2(scene.scene, visualizer);


    (function tick() {
        requestAnimationFrame(tick);

        // sample1.tick();
        sample2.tick();
        scene.render();
        scene.updateControls();
    })();
})();