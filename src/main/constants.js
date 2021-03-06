/**
 * constants
 */

const env = require('./env');
const path = require('path');
const { homedir } = require('os');

// gui配置目录名称
const JFET_GUI_SETTING_DIR_NAME = '.jfet';

// gui配置目录命令配置
const JFET_GUI_COMMAND_SETTING_FILE = 'command.json';

// 项目存储名称
const PROJECT_STORAGE_NAME = 'projectList';

const SETTING = 'setting';

// 模板仓库
const TEMPLATE_REPOSITORY = 'http://git.jtjr.com/groups/h5_webtools_grp';

// npm源
const NPM_REGISTRY = {
  NPM: 'http://registry.npmjs.org', // 官方npm源
  CNPM: 'http://registry.npm.taobao.org', // 淘宝npm源
  JNPM: 'http://npm.jyblife.com', // 加油宝npm源
};

// 编辑器
const SUBLIME_TEXT_3_NAME = 'Sublime Text3';
const VS_CODE_NAME = 'VS Code';
const WEBSTORM_NAME = 'WebStorm';

const VSCODE_BASE_PATH = env.isWin
  ? 'C:/Program Files (x86)/Microsoft VS Code'
  : '/Applications/Visual Studio Code.app';

const SUBLIME_TEXT_3_BASE_PATH = env.isWin
  ? 'C:/Program Files/Sublime Text 3'
  : '/Applications/Sublime Text.app';

const WEBSTORM_BASE_PATH = env.isWin
  ? 'C:/Program Files (x86)/JetBrains/WebStorm 2017.1/bin/webstorm.exe'
  : '/Applications/WebStorm.app';

// 默认项目路径
const DEFAULT_PROJECT_PATH = path.join(homedir(), 'jfet-workspace');

// jfet网站
const JFET_WEBSITE_URL = 'http://doc.fe.jyb.com/book/jfet-website/';

// jfet API文档
const JFET_API_DOC_URL = 'http://doc.fe.jyb.com/book/workflow/index.html';

const APP_PATH = env.isDev ? path.join(process.cwd(), 'src') : path.join(process.resourcesPath, 'app');

// node
const NODE_PATH = path.join(APP_PATH, 'node');

// npm
const NPM_BIN_PATH = env.isDev ?
  path.join(process.cwd(), 'node_modules', '.bin') :
  path.join(process.resourcesPath, 'app', 'node_modules', '.bin');

// jfet
const JFET_BIN_PATH = env.isDev ?
  path.join(process.cwd(), 'node_modules', '.bin') :
  path.join(process.resourcesPath, 'app', 'node_modules', '@jyb', 'jfet', 'bin');

module.exports = {
  JFET_GUI_SETTING_DIR_NAME,
  JFET_GUI_COMMAND_SETTING_FILE,
  PROJECT_STORAGE_NAME,
  TEMPLATE_REPOSITORY,
  NPM_REGISTRY,
  SUBLIME_TEXT_3_NAME,
  VS_CODE_NAME,
  WEBSTORM_NAME,
  VSCODE_BASE_PATH,
  SUBLIME_TEXT_3_BASE_PATH,
  WEBSTORM_BASE_PATH,
  JFET_WEBSITE_URL,
  JFET_API_DOC_URL,
  DEFAULT_PROJECT_PATH,
  SETTING,
  APP_PATH,
  NPM_BIN_PATH,
  JFET_BIN_PATH,
  NODE_PATH
};
