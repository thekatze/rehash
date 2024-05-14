import saveAs from "file-saver";

interface Platform {
  copyToClipboard(text: Promise<string>): Promise<void>;
  saveTextAsFile(text: string, filename: string): Promise<void>;
}

const web: Platform = {
  copyToClipboard: async (text: Promise<string>): Promise<void> => {
    // firefox does not support ClipboardItem api, but allows awaited content to be copied to clipboard
    if (typeof ClipboardItem === "undefined") {
      return await navigator.clipboard.writeText(await text);
    }

    // safari does not allow awaited content to be copied to clipboard, pass promise into clipboard
    const item = new ClipboardItem({
      "text/plain": text.then((t) => new Blob([t], { type: "text/plain" })),
    });

    return await navigator.clipboard
      .write([item])
      .catch((e) => console.error(e));
  },
  saveTextAsFile: async (text: string, filename: string): Promise<void> => {
    const blob = new Blob([text], {
      type: "text/plain",
    });

    saveAs(blob, filename);
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: add tauri d.ts
const tauri = (window as any).__TAURI__;
const tauriPlatform: Platform = {
  copyToClipboard: web.copyToClipboard,
  saveTextAsFile: async (text: string, filename: string): Promise<void> => {
    const path = await tauri.dialog.save({
      defaultPath: `./${filename}`,
    });

    return tauri.fs.writeTextFile(path, text);
  },
};

export const platform: Platform = tauri ? tauriPlatform : web;
