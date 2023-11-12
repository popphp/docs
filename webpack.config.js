const path = require('path');

module.exports = {
    mode: 'production',
    entry: ['./app/resources/js/app.js'],
    output: {
        path: path.resolve(__dirname, './public/assets/js'),
        filename: 'app.min.js'
    },
    optimization: { minimize: true },
    watch: true
};