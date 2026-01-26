import * as prettier from "prettier/standalone";
import estree from "prettier/plugins/estree";
import babel from "prettier/plugins/babel";
import html from "prettier/plugins/html";
import postcss from "prettier/plugins/postcss";
import typescript from "prettier/plugins/typescript";
import markdown from "prettier/plugins/markdown";
import yaml from "prettier/plugins/yaml";

// Ensure this is a NAMED EXPORT
export const performFormat = async (input: string, lang: string) => {
  const pluginArray: any[] = [
    babel,
    estree,
    html,
    postcss,
    typescript,
    markdown,
    yaml,
  ];

  try {
    if (lang === "sql") {
      const sql = await import("prettier-plugin-sql");
      pluginArray.push(sql.default || sql);
    } else if (lang === "java") {
      const java = await import("prettier-plugin-java");
      pluginArray.push(java.default || java);
    } else if (lang === "xml") {
      const xml = await import("@prettier/plugin-xml");
      pluginArray.push(xml.default || xml);
    }

    return await prettier.format(input, {
      parser: lang === "babel" ? "babel-ts" : lang,
      plugins: pluginArray,
      printWidth: 80,
      tabWidth: ["java", "sql"].includes(lang) ? 4 : 2,
      semi: true,
      singleQuote: true,
      keywordCase: "upper",
    });
  } catch (error) {
    throw error;
  }
};
