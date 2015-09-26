(function() {
    var scene = new window.Scene();
    document.body.appendChild(scene.renderer.domElement);
    scene.render();

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

            scene.updateTexture();
            scene.render();
        }
    })();
})();