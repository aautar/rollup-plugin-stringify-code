import test from 'ava';
import * as fs from 'fs';
import { CodeStringifier } from '../src/CodeStringifier.mjs';

const readCodeFromFixtureFile = function(_path) {
    const buf = fs.readFileSync(_path);
    const utf8decoder = new TextDecoder("UTF-8");
    return utf8decoder.decode(buf);
};

test('stringify() removes carriage returns', t => {
    const code = "const x=1;\n\rconst y=2;"
	const stringifiedCode = CodeStringifier.stringify(code);
    t.deepEqual(stringifiedCode, 'String.raw`const x=1;\nconst y=2;`');
});

test('stringify() handles template literal, puts backticks in quotes', t => {
    const code = readCodeFromFixtureFile("./test/fixtures/simple-template-literal.txt");
	const stringifiedCode = CodeStringifier.stringify(code);
    t.deepEqual(stringifiedCode, 'String.raw`const x = `+"`"+"${someVar}"+"`"+String.raw``');
});

test('stringify() handles template literal with newlines, puts each line in string literal', t => {
    const code = readCodeFromFixtureFile("./test/fixtures/template-literal-newlines.txt");
	const stringifiedCode = CodeStringifier.stringify(code);
    t.deepEqual(stringifiedCode, 'String.raw`const x = `+"`"+"${hello}"+"\\n"+"${world}"+"`"+String.raw``');
});

test('stringify() handles double quotes within template literals, quote is escaped with escape char itself escaped', t => {
    const code = readCodeFromFixtureFile("./test/fixtures/template-literal-containing-double-quotes.txt");
	const stringifiedCode = CodeStringifier.stringify(code);
    t.deepEqual(stringifiedCode, 'String.raw`const x = `+"`"+"${hello}\\"${world}"+"`"+String.raw``');
});
