(function() {
    var scene = new window.Scene();
    document.body.appendChild(scene.renderer.domElement);
    scene.render();

    window.scene = scene.scene;
    window.camera = scene.camera;
    window.renderer = scene.renderer;

    window.addEventListener('resize', function() {
        scene.resize();
    });

    var visualizer = new window.Visualizer();
    visualizer.load('./sugar.mp3', function() {
        visualizer.togglePlayback();

        scene.setTexture(visualizer.freqCanvas, 0);
        scene.setTexture(visualizer.cosCanvas[0], 1);
        scene.setTexture(visualizer.cosCanvas[2], 2);
        scene.setTexture(visualizer.cosCanvas[3], 3);
        scene.setTexture(visualizer.cosCanvas[5], 4);
        scene.setTexture(visualizer.cosCanvas[8], 5);
        scene.setTexture(visualizer.cosCanvas[11], 6);
        scene.setTexture(visualizer.cosCanvas[14], 7);
        scene.setTexture(visualizer.freqCanvas, 8);
    });

    (function tick() {
        requestAnimationFrame(tick);

        scene.updateControls();

        if (visualizer.isPlaying) {
            visualizer.draw(window.innerWidth, window.innerWidth / 3);
            visualizer.drawFreq();
            visualizer.drawCos(0);
            visualizer.drawCos(2);
            visualizer.drawCos(3);
            visualizer.drawCos(5);
            visualizer.drawCos(8);
            visualizer.drawCos(11);
            visualizer.drawCos(14);

            scene.updateTexture();
            scene.render();
        }
    })();
})();