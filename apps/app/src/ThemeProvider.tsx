import {
  Accessor,
  createContext,
  createEffect,
  createSignal,
  FlowComponent,
  Setter,
  useContext,
} from "solid-js";

type ThemeContext = [Accessor<boolean>, Setter<boolean>];

const ThemeContext = createContext<ThemeContext>();

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error("Missing ThemeProvider");
  return theme;
};

const THEME_PREFERENCE_KEY = "rehash_dark_mode";

export const ThemeProvider: FlowComponent = (props) => {
  const darkModeSetting =
    localStorage.getItem(THEME_PREFERENCE_KEY) ??
    "" + window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setDark] = createSignal<boolean>(JSON.parse(darkModeSetting));

  createEffect(() => {
    localStorage.setItem(THEME_PREFERENCE_KEY, JSON.stringify(isDark()));

    const body = window.document.body.classList;
    if (isDark()) {
      body.add("dark");
    } else {
      body.remove("dark");
    }
  });

  return (
    <ThemeContext.Provider value={[isDark, setDark]}>
      {props.children}
    </ThemeContext.Provider>
  );
};
