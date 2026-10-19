import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", eslintConfigPrettier]),
]);

export default eslintConfig;

// import { defineConfig, globalIgnores } from "eslint/config";
// import nextVitals from "eslint-config-next/core-web-vitals";
// import eslintConfigPrettier from "eslint-config-prettier";

// const eslintConfig = defineConfig([
//   ...nextVitals,

//   globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "src/components/toggler.jsx"]),
//   eslintConfigPrettier,
// ]);

// export default eslintConfig;
