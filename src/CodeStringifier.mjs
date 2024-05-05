const CodeStringifier = {
    _stripInvalidChars: function(_code) {
        return _code.replaceAll("\r", "");
    },

    /**
     * 
     * @param {String} _sub 
     * @param {String[]} _stringifiedParts 
     */
    _processTemplateLiteralSubString: function(_sub, _stringifiedParts) {
        const subLines = _sub.split("\n");
        for(let i=0; i<subLines.length; i++) {
            subLines[i] = subLines[i].replaceAll('\\', '\\\\');
            subLines[i] = subLines[i].replaceAll('"', '\\"');
            _stringifiedParts.push('"' + subLines[i] + '"');

            if(i < subLines.length - 1) {
                _stringifiedParts.push('"\\n"');
            }
        }
    },

    /**
     * 
     * @param {String} _str 
     * @returns {String}
     */
    _buildStringRawLiteral: function(_str) {
        return "String.raw`" + _str + "`";
    },

    /**
     * 
     * @param {String} _code
     * @returns {String}
     */
    stringify: function(_code) {
        const codeNoInvalidChars = this._stripInvalidChars(_code);

        const stringifiedParts = [];
        let curTemplateLiteralSeqStart = -1;
        let prevTemplateLiteralSeqEnd = 0;

        for(let i=0; i<codeNoInvalidChars.length; i++) {
            if(codeNoInvalidChars.charAt(i) === "`") {
                if(curTemplateLiteralSeqStart === -1) {
                    curTemplateLiteralSeqStart = i;
                } else {
                    stringifiedParts.push(
                        this._buildStringRawLiteral(codeNoInvalidChars.substring(prevTemplateLiteralSeqEnd, curTemplateLiteralSeqStart))
                    );
                    
                    stringifiedParts.push('"`"');

                    this._processTemplateLiteralSubString(
                        codeNoInvalidChars.substring(curTemplateLiteralSeqStart+1, i),
                        stringifiedParts
                    );

                    stringifiedParts.push('"`"');

                    prevTemplateLiteralSeqEnd = i + 1;
                    curTemplateLiteralSeqStart = -1;
                }
            }
        }

        if(curTemplateLiteralSeqStart === -1) {
            stringifiedParts.push(
                this._buildStringRawLiteral(codeNoInvalidChars.substring(prevTemplateLiteralSeqEnd))
            );
        }

        return stringifiedParts.join("+");
    },
};

export { CodeStringifier }
