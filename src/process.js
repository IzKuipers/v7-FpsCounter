const html = await loadHtml("body.html");
const { formatBytes } = util;
const { FpsCounterTray } = await load("tray.js");

class proc extends ThirdPartyAppProcess {
  output;
  fps;
  canvas;
  current = Store("-- FPS");

  constructor(handler, pid, parentPid, app, workingDirectory) {
    super(handler, pid, parentPid, app, workingDirectory);
  }

  async render() {
    const body = this.getBody();
    body.innerHTML = html;

    this.output = body.querySelector("#output");
    this.canvas = body.querySelector("#fpsCanvas");

    this.loop((fps) => {
      this.output.innerText = `${fps} FPS`;
      this.current.set(this.output.innerText);
    });

    this.shell?.trayHost.createTrayIcon(
      this.pid,
      this.app.id,
      {
        icon: this.windowIcon(),
        popup: {
          width: 150,
          height: 50,
        },
      },
      FpsCounterTray
    );
  }

  loop() {
    this.callback = callback;
    let lastCallbackTime = performance.now();

    const loop = (now) => {
      const delta = now - this.lastTime;
      this.lastTime = now;

      // Frame time buffer (last ~30 frames)
      this.frameTimes.push(delta);
      if (this.frameTimes.length > 30) {
        this.frameTimes.shift();
      }

      const avgDelta =
        this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.fps = 1000 / avgDelta;

      if (now - lastCallbackTime >= 1000) {
        lastCallbackTime = now;
        if (this.callback) this.callback(this.fps.toFixed(1));
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

return { proc };
