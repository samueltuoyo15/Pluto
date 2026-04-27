import plugin from "../plugin.json";

const sideBarApps = acode.require("sidebarApps");

class AcodePlugin {
    public baseUrl: string | undefined;

    async init(): Promise<void> {
        if (!sideBarApps) return;

        sideBarApps.add(
            "smart_toy",
            plugin.id,
            plugin.name,
            (container: HTMLElement) => {
                container.innerHTML = `<div class="scroll" style="padding:12px;height:100%;overflow:auto;">Hello from ${plugin.name}</div>`;
            },
            false,
            (_container: HTMLElement) => {},
        );
    }

    async destroy() {
        sideBarApps.remove(plugin.id);
    }
}

if (window.acode) {
    const acodePlugin = new AcodePlugin();
    acode.setPluginInit(
        plugin.id,
        async (baseUrl: string) => {
            if (!baseUrl.endsWith("/")) {
                baseUrl += "/";
            }
            acodePlugin.baseUrl = baseUrl;
            await acodePlugin.init();
        },
    );
    acode.setPluginUnmount(plugin.id, () => {
        acodePlugin.destroy();
    });
}
