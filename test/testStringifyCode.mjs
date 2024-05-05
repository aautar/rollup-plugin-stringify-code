import * as fs from 'fs';
import os from 'os';
import test from 'ava';
import stringifyCode from '../src/stringifyCode.mjs';

const stringifiedFileDest = `${os.tmpdir()}/test-bundle-stringified.txt`;

const readStringifiedOutput = function() {
    const buf = fs.readFileSync(stringifiedFileDest);
    const utf8decoder = new TextDecoder("UTF-8");
    return utf8decoder.decode(buf);
};

test.after.always(t => {
    try {
        fs.unlinkSync(stringifiedFileDest);
    } catch(_err) { }
});

test('writeBundle() writes', t => {
    const options = {
        "srcBundleName": "test-bundle.mjs",
        "dest": stringifiedFileDest,
        "exportVarName": "testVar",
    };

    const bundle = {
        "test-bundle.mjs": {
            "code": "let source=42;"
        }
    };

    const stringifyCodePlugin = new stringifyCode(options);
    stringifyCodePlugin.writeBundle({}, bundle)
    t.deepEqual(readStringifiedOutput(), 'const testVar = String.raw`let source=42;`; export { testVar }');
});


test('writeBundle() throws TypeError if exportVarName is not defined', t => {
    const options = {
        "srcBundleName": "test-bundle.mjs",
        "dest": stringifiedFileDest,
    };

    const bundle = {
        "test-bundle.mjs": {
            "code": "const sourceCode = `xyz`;"
        }
    };

    const stringifyCodePlugin = new stringifyCode(options);
    t.throws(
        () => {
            stringifyCodePlugin.writeBundle({}, bundle)
        },
        {
            instanceOf: TypeError
        }
    );

});
