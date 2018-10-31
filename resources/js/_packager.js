// 命名空间处理工具
// ref: https://gist.github.com/shrekuu/eaaa089758c4eac02192a37a1db37a86
window.packager = function(namespace) {
    for (var part, parts = namespace.split("."), parent = window, i = 0; i < parts.length; i++) part = parts[i], parent[part] = parent[part] || {}, parent = parent[part]
};
