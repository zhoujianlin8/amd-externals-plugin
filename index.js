'use strict';

const ConcatSource = require('webpack/lib/ConcatSource');
const ExternalModuleFactoryPlugin = require('webpack/lib/ExternalModuleFactoryPlugin');
module.exports = class LibraryTemplatePlugin {
    constructor(options) {
        options = options || {};
        this.name = options.name || '[name]';
        if (typeof options === 'function') {
            this.wrap = options;
        } else if (options.wrap && typeof options.wrap === 'function') {
            this.wrap = options.wrap;
        }
        this.externals = options.externals;
    }

    apply(compiler) {
        compiler.plugin("this-compilation", (compilation)=> {
            let mainTemplate = compilation.mainTemplate;
            compilation.templatesPlugin('render-with-entry', (source, chunk, hash) => {
                let externals = chunk.modules.filter(m => {
                        return m.external;
                    }),
                    externalsDepsArray = externals.map(m => {
                        return typeof m.request === 'object' ? m.request.amd : m.request;
                    }),
                    name;

                /* externalsDepsArray.map((mod, index) => {
                 requires += 'var ' + externalsArguments[index] + '=require("' + mod + '");';
                 });
                 */
                externalsDepsArray = JSON.stringify(externalsDepsArray);
                name = mainTemplate.applyPluginsWaterfall("asset-path", this.name, {
                    hash: hash,
                    chunk: chunk
                });
                name = JSON.stringify(name);
                name = name.replace(/\\\\/g, '\/');
                let arrOutput = ["define(" + name + ", " + externalsDepsArray + ", function(require,exports,module) { module.exports = ",
                    source,
                    "})"]
                //
                if (this.wrap) {
                    let out = this.wrap({
                        name: name,
                        compilation: compilation,
                        externalsDepsArray: externalsDepsArray,
                        arrOutput: arrOutput,
                        chunk: chunk,
                        hash: hash
                    })
                    if(Array.isArray(out)){
                        arrOutput = out;
                    }
                }

                arrOutput.unshift(null);
                return new (Function.prototype.bind.apply(ConcatSource, arrOutput));
            });

            mainTemplate.plugin('global-hash-paths', (paths) => {
                if (this.name) paths.push(this.name);
                return paths;
            });

            mainTemplate.plugin("hash", (hash) => {
                hash.update("exports amd");
                hash.update(this.name + "");

            });
        })

        compiler.plugin('compile', (params) => {
            params.normalModuleFactory.apply(new ExternalModuleFactoryPlugin('commonjs', this.externals));
        })
    }

}