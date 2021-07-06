const path = require("path");

// Load .env files
const { loadEnv } = require("vue-cli-plugin-apollo/utils/load-env");
const env = loadEnv([
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, ".env.local")
]);

module.exports = {
  lintGQL: true,
  client: {
    name: env.VUE_APP_APOLLO_ENGINE_CLIENT,
    includes: ["src/graphql/**/*.{js,jsx,ts,tsx,vue,gql}"],
    service: {
      url: "http://localhost:3000/graphql",
      name: env.VUE_APP_APOLLO_ENGINE_SERVICE,
      localSchemaFile: path.resolve(__dirname, "./src/graphql/schema.json")
    }
  }
};
