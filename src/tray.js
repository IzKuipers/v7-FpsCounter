const html = await loadHtml("tray.html");

class FpsCounterTray extends TrayIconProcess {
	constructor(handler, pid, parentPid, data) {
		super(handler, pid, parentPid, data);
	}

	renderPopup(body, target) {
		body.innerHTML = html;

		this.output = body.querySelector("#output");
		const toggle = body.querySelector("#fpsToggle");

		toggle?.addEventListener("click", () => {
			const window = target.getWindow();
			window.classList.toggle("hide");

			toggle.classList.toggle("icon-eye", !window.classList.contains("hide"));
			toggle.classList.toggle("icon-eye-closed", window.classList.contains("hide"));
		})

		target.current.subscribe((v) => {
			this.output.innerText = v;
		})
	}
}

return { FpsCounterTray };