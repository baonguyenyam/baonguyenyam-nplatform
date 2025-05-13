import invariant from "./invariant";

export default function getThemeSelector(getTheme: () => Record<string, string> | undefined, name: string) {
  const className = getTheme()?.[name];
  invariant(typeof className === "string", "getThemeClass: required theme property %s not defined");
  return className
    .split(/\s+/g)
    .map((cls) => `.${cls}`)
    .join();
}
