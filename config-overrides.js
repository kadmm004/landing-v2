/* config-overrides.js */
const { override } = require('customize-cra');
const addLessLoader = require('customize-cra-less-loader');
module.exports = override(addLessLoader());
