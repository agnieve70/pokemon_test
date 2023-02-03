const {PHASE_DEVELOPMENT_SERVER} = require('next/constants');

module.exports = (phase, {defaultConfig}) => {

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        env_type: "server",
        mongodb_username: "agnieve0513",
        mongodb_password: "Evien05131997",
        mongodb_clustername: "cluster0.h7lt8",
        mongodb_database: "pokemon-dev",
        NEXTAUTH_SECRET: 'pokemon-secret',
        base_url: 'http://localhost:3000',
      },
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'raw.githubusercontent.com',
          },
        ],
      },
    };
  }

  return {
    env: {
      env_type: "server",
      mongodb_username: "agnieve0513",
      mongodb_password: "Evien05131997",
      mongodb_clustername: "cluster0.h7lt8",
      mongodb_database: "pokemon-dev",
      NEXTAUTH_SECRET: 'pokemon-secret',
      base_url: 'https://poketest.agsys.online/',
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'raw.githubusercontent.com',
        },
      ],
    },
  };
};

