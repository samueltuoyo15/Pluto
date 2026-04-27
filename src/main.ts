import plugin from "../plugin.json";

const sideBarApps = acode.require("sidebarApps");
const Url = acode.require("url");

class AcodePlugin {
    private static readonly SIDEBAR_ICON = "pluto";
    private static readonly SIDEBAR_ICON_PATH = "assets/pluto.svg";

    public baseUrl: string | undefined;

    async init(): Promise<void> {
        if (!sideBarApps || !this.baseUrl) return;

        acode.addIcon(
            AcodePlugin.SIDEBAR_ICON,
            await acode.toInternalUrl(
                Url.join(this.baseUrl, AcodePlugin.SIDEBAR_ICON_PATH),
            ),
        );

        sideBarApps.add(
            AcodePlugin.SIDEBAR_ICON,
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
