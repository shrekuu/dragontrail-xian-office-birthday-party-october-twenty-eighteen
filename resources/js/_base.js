window._ = require('lodash');
require('./_packager');

window.app = packager('app');

app = new class {

    init() {
        this.initLodashConfig();
        this.initAjaxConfig()
    };

    // 更换 lodash 模版语法
    initLodashConfig() {
        _.templateSettings.evaluate = /\[\[(.+?)\]\]/g;
        _.templateSettings.interpolate = /\[\[=(.+?)\]\]/g;
        _.templateSettings.escape = /\[\[-(.+?)\]\]/g;
    }

    initAjaxConfig() {
        if (typeof $ === 'function' && $('meta[name="csrf-token"]').attr('content')) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
        }
    }
};
