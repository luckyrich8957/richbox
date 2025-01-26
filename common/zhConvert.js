import OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

export const toTraditional = (text) => {
    if (!text) return '';
    return converter(text);
};

export const zhMixin = {
    filters: {
        zh(text) {
            return toTraditional(text);
        }
    }
};

export default {
    install(Vue) {
        Vue.mixin(zhMixin);
        Vue.prototype.$toTraditional = toTraditional;
    }
};
