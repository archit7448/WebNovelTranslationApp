import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended, // JavaScript recommended rules
    ...tseslint.configs.recommended, // TypeScript recommended rules
    {
        plugins: { prettier },
        rules: {
            "prettier/prettier": ["error", { tabWidth: 4 }], // Enforce Prettier formatting with tab width 4
            "@typescript-eslint/no-explicit-any": "warn", // Warn on `any`
        },
    },
];
