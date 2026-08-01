import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This rule flags any setState call written directly in an effect
      // body — including the standard SSR-hydration-safe "mounted" flag
      // pattern, hydrating state from localStorage on mount, and setting a
      // loading flag at the start of a debounced fetch. Those are
      // intentional here (see ThemeToggle, useBookmarks, SearchOverlay),
      // so this is kept visible as a warning rather than a build-blocking
      // error rather than rewriting idiomatic, SSR-safe effects around it.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
