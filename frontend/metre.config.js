// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Expo Router-ийн 4.x багцтай Babel-ийн зөрчлийг шийдэх
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_disableHierarchicalLookup = true;

// 🚨 Заавал шалгах: Хэрэв та 'nativewind' болон 'react-native-reanimated' ашиглаж байгаа бол,
// тэдгээрийг хөрвүүлэхээс хасахгүй байх нь чухал.
config.transformer.get
TransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;