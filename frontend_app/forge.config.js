const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'src', 'assets', 'icons', 'icons', 'win', 'icon'),
    extraResource: [
      path.join(__dirname, 'src', 'assets'),
      path.join(__dirname, '../backend_dist'), // Include built backend
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'file://' + path.join(__dirname, 'src', 'assets', 'icons', 'icons', 'win', 'icon.ico'),
        setupIcon: path.join(__dirname, 'src', 'assets', 'icons', 'icons', 'win', 'icon.ico'),
      },
    },
    { name: '@electron-forge/maker-zip', platforms: ['darwin'] },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        build: [
          { entry: 'src/main.js', config: 'vite.main.config.mjs', target: 'main' },
          { entry: 'src/preload.js', config: 'vite.preload.config.mjs', target: 'preload' },
        ],
        renderer: [
          { name: 'main_window', config: 'vite.renderer.config.mjs' },
        ],
      },
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
