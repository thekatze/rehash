export interface Platform {
  copyToClipboard(text: Promise<string>): Promise<void>;
}

const web: Platform = {
  copyToClipboard: async (text: Promise<string>): Promise<void> => {
    if (typeof ClipboardItem === "undefined") {
      return await navigator.clipboard.writeText(await text);
    }

    const item = new ClipboardItem({
      "text/plain": text
    });

    return await navigator.clipboard.write([item]);
  },
};

export const platform = web;

