module.exports = {
    webpack: (config) => {
        config.resolve.fallback = {
            net: false,
            tls: false,
            dns: false,
        };
        return config;
    },
};
