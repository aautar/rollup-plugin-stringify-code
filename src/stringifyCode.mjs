import * as fs from 'fs';
import { CodeStringifier } from './CodeStringifier.mjs';

const stringifyCode = function(_options) {
    return {
        name: 'stringifyCode',
        writeBundle(bundleOpts, bundle) {
            console.log(`Creating stringified worker...`);

            if(typeof _options.exportVarName === 'undefined') {
                throw new TypeError("exportVarName option is undefined");
            }

            const code = (bundle[_options.srcBundleName].code);
            const stringifiedCode = CodeStringifier.stringify(code);
            const varEncapStringifiedCode = `const ${_options.exportVarName} = ${stringifiedCode}; export { ${_options.exportVarName} }`;

            fs.writeFileSync(_options.dest, varEncapStringifiedCode, function(err) {
                if(err) {
                    throw err;
                }

                console.log(`Stringified code created: ${_options.srcBundleName} -> ${_options.dest}`);
            });
        }
    };
};

export default stringifyCode;
