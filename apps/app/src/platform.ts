import saveAs from "file-saver";

interface Platform {
  copyToClipboard(text: Promise<string>): Promise<void>;
  saveTextAsFile(text: string, filename: string): Promise<void>;
}

const web: Platform = {
  copyToClipboard: async (text: Promise<string>): Promise<void> => {
    if (typeof ClipboardItem === "undefined") {
      return await navigator.clipboard.writeText(await text);
    }

    const item = new ClipboardItem({
      "text/plain": text,
    });

    return await navigator.clipboard.write([item]);
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
      filters: [
        {
          name: filename.split(".")[0],
          extensions: [filename.split(".")[1]],
        },
      ],
    });

    return tauri.fs.writeTextFile(path, text);
  },
};

export const platform: Platform = tauri ? tauriPlatform : web;
