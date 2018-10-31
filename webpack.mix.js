// laravel 5.6 里的 mix
const mix = require('laravel-mix');

// 默认不支持 glob 风格路径, 用 node glob 处理一下
const glob = require('glob');

// 带下划线前缀的是别的文件引用的, 不要单独编译
const scripts = glob.sync('resources/js/**/[^_]*.js');
const styles = glob.sync('resources/scss/**/[^_]*.scss');

// 管理员端
// 要保持住文件目录结构, 所以一个文件一个文件处理
scripts.forEach(filename => {

  // 根据原文件所在位置决定编译后的文件的位置
  const filenameAry = filename.substr('resources/js/'.length).split('/');
  const dist = 'public/js/' + filenameAry.splice(0, filenameAry.length - 1).join('/');

  // 生成 public/mix_manifest.json 文件, 处理掉缓存的问题
  mix.js(filename, dist).version();
});

styles.forEach(filename => {

  const filenameAry = filename.substr('resources/scss/'.length).split('/');
  const dist = 'public/css/' + filenameAry.splice(0, filenameAry.length - 1).join('/');

  // 注意字体也放进了 目录
  mix.sass(filename, dist).version();
});