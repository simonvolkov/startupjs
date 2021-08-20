/*eslint-disable*/

export default "ace.define(\"ace/mode/doc_comment_highlight_rules\",[\"require\",\"exports\",\"module\",\"ace/lib/oop\",\"ace/mode/text_highlight_rules\"], function(require, exports, module) {\n  \"use strict\";\n  \n  var oop = require(\"../lib/oop\");\n  var TextHighlightRules = require(\"./text_highlight_rules\").TextHighlightRules;\n  \n  var DocCommentHighlightRules = function() {\n      this.$rules = {\n          \"start\" : [ {\n              token : \"comment.doc.tag\",\n              regex : \"@[\\\\w\\\\d_]+\" // TODO: fix email addresses\n          }, \n          DocCommentHighlightRules.getTagRule(),\n          {\n              defaultToken : \"comment.doc\",\n              caseInsensitive: true\n          }]\n      };\n  };\n  \n  oop.inherits(DocCommentHighlightRules, TextHighlightRules);\n  \n  DocCommentHighlightRules.getTagRule = function(start) {\n      return {\n          token : \"comment.doc.tag.storage.type\",\n          regex : \"\\\\b(?:TODO|FIXME|XXX|HACK)\\\\b\"\n      };\n  };\n  \n  DocCommentHighlightRules.getStartRule = function(start) {\n      return {\n          token : \"comment.doc\", // doc comment\n          regex : \"\\\\/\\\\*(?=\\\\*)\",\n          next  : start\n      };\n  };\n  \n  DocCommentHighlightRules.getEndRule = function (start) {\n      return {\n          token : \"comment.doc\", // closing comment\n          regex : \"\\\\*\\\\/\",\n          next  : start\n      };\n  };\n  \n  \n  exports.DocCommentHighlightRules = DocCommentHighlightRules;\n  \n  });\n  \n  ace.define(\"ace/mode/javascript_highlight_rules\",[\"require\",\"exports\",\"module\",\"ace/lib/oop\",\"ace/mode/doc_comment_highlight_rules\",\"ace/mode/text_highlight_rules\"], function(require, exports, module) {\n  \"use strict\";\n  \n  var oop = require(\"../lib/oop\");\n  var DocCommentHighlightRules = require(\"./doc_comment_highlight_rules\").DocCommentHighlightRules;\n  var TextHighlightRules = require(\"./text_highlight_rules\").TextHighlightRules;\n  var identifierRe = \"[a-zA-Z\\\\$_\\u00a1-\\uffff][a-zA-Z\\\\d\\\\$_\\u00a1-\\uffff]*\";\n  \n  var JavaScriptHighlightRules = function(options) {\n      var keywordMapper = this.createKeywordMapper({\n          \"variable.language\":\n              \"Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|\"  + // Constructors\n              \"Namespace|QName|XML|XMLList|\"                                             + // E4X\n              \"ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|\"   +\n              \"Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|\"                    +\n              \"Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|\"   + // Errors\n              \"SyntaxError|TypeError|URIError|\"                                          +\n              \"decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|\" + // Non-constructor functions\n              \"isNaN|parseFloat|parseInt|\"                                               +\n              \"JSON|Math|\"                                                               + // Other\n              \"this|arguments|prototype|window|document\"                                 , // Pseudo\n          \"keyword\":\n              \"const|yield|import|get|set|async|await|\" +\n              \"break|case|catch|continue|default|delete|do|else|finally|for|function|\" +\n              \"if|in|of|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|\" +\n              \"__parent__|__count__|escape|unescape|with|__proto__|\" +\n              \"class|enum|extends|super|export|implements|private|public|interface|package|protected|static\",\n          \"storage.type\":\n              \"const|let|var|function\",\n          \"constant.language\":\n              \"null|Infinity|NaN|undefined\",\n          \"support.function\":\n              \"alert\",\n          \"constant.language.boolean\": \"true|false\"\n      }, \"identifier\");\n      var kwBeforeRe = \"case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void\";\n  \n      var escapedRe = \"\\\\\\\\(?:x[0-9a-fA-F]{2}|\" + // hex\n          \"u[0-9a-fA-F]{4}|\" + // unicode\n          \"u{[0-9a-fA-F]{1,6}}|\" + // es6 unicode\n          \"[0-2][0-7]{0,2}|\" + // oct\n          \"3[0-7][0-7]?|\" + // oct\n          \"[4-7][0-7]?|\" + //oct\n          \".)\";\n  \n      this.$rules = {\n          \"no_regex\" : [\n              DocCommentHighlightRules.getStartRule(\"doc-start\"),\n              comments(\"no_regex\"),\n              {\n                  token : \"string\",\n                  regex : \"'(?=.)\",\n                  next  : \"qstring\"\n              }, {\n                  token : \"string\",\n                  regex : '\"(?=.)',\n                  next  : \"qqstring\"\n              }, {\n                  token : \"constant.numeric\", // hexadecimal, octal and binary\n                  regex : /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\\b/\n              }, {\n                  token : \"constant.numeric\", // decimal integers and floats\n                  regex : /(?:\\d\\d*(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+\\b)?/\n              }, {\n                  token : [\n                      \"storage.type\", \"punctuation.operator\", \"support.function\",\n                      \"punctuation.operator\", \"entity.name.function\", \"text\",\"keyword.operator\"\n                  ],\n                  regex : \"(\" + identifierRe + \")(\\\\.)(prototype)(\\\\.)(\" + identifierRe +\")(\\\\s*)(=)\",\n                  next: \"function_arguments\"\n              }, {\n                  token : [\n                      \"storage.type\", \"punctuation.operator\", \"entity.name.function\", \"text\",\n                      \"keyword.operator\", \"text\", \"storage.type\", \"text\", \"paren.lparen\"\n                  ],\n                  regex : \"(\" + identifierRe + \")(\\\\.)(\" + identifierRe +\")(\\\\s*)(=)(\\\\s*)(function)(\\\\s*)(\\\\()\",\n                  next: \"function_arguments\"\n              }, {\n                  token : [\n                      \"entity.name.function\", \"text\", \"keyword.operator\", \"text\", \"storage.type\",\n                      \"text\", \"paren.lparen\"\n                  ],\n                  regex : \"(\" + identifierRe +\")(\\\\s*)(=)(\\\\s*)(function)(\\\\s*)(\\\\()\",\n                  next: \"function_arguments\"\n              }, {\n                  token : [\n                      \"storage.type\", \"punctuation.operator\", \"entity.name.function\", \"text\",\n                      \"keyword.operator\", \"text\",\n                      \"storage.type\", \"text\", \"entity.name.function\", \"text\", \"paren.lparen\"\n                  ],\n                  regex : \"(\" + identifierRe + \")(\\\\.)(\" + identifierRe +\")(\\\\s*)(=)(\\\\s*)(function)(\\\\s+)(\\\\w+)(\\\\s*)(\\\\()\",\n                  next: \"function_arguments\"\n              }, {\n                  token : [\n                      \"storage.type\", \"text\", \"entity.name.function\", \"text\", \"paren.lparen\"\n                  ],\n                  regex : \"(function)(\\\\s+)(\" + identifierRe + \")(\\\\s*)(\\\\()\",\n                  next: \"function_arguments\"\n              }, {\n                  token : [\n                      \"entity.name.function\", \"text\", \"punctuation.operator\",\n                      \"text\", \"storage.type\", \"text\", \"paren.lparen\"\n                  ],\n                  regex : \"(\" + identifierRe + \")(\\\\s*)(:)(\\\\s*)(function)(\\\\s*)(\\\\()\",\n                  next: \"function_arguments\"\n              }, {\n                  token : [\n                      \"text\", \"text\", \"storage.type\", \"text\", \"paren.lparen\"\n                  ],\n                  regex : \"(:)(\\\\s*)(function)(\\\\s*)(\\\\()\",\n                  next: \"function_arguments\"\n              }, {\n                  token : \"keyword\",\n                  regex : \"from(?=\\\\s*('|\\\"))\"\n              }, {\n                  token : \"keyword\",\n                  regex : \"(?:\" + kwBeforeRe + \")\\\\b\",\n                  next : \"start\"\n              }, {\n                  token : [\"support.constant\"],\n                  regex : /that\\b/\n              }, {\n                  token : [\"storage.type\", \"punctuation.operator\", \"support.function.firebug\"],\n                  regex : /(console)(\\.)(warn|info|log|error|time|trace|timeEnd|assert)\\b/\n              }, {\n                  token : keywordMapper,\n                  regex : identifierRe\n              }, {\n                  token : \"punctuation.operator\",\n                  regex : /[.](?![.])/,\n                  next  : \"property\"\n              }, {\n                  token : \"storage.type\",\n                  regex : /=>/,\n                  next  : \"start\"\n              }, {\n                  token : \"keyword.operator\",\n                  regex : /--|\\+\\+|\\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\\|\\||\\?:|[!$%&*+\\-~\\/^]=?/,\n                  next  : \"start\"\n              }, {\n                  token : \"punctuation.operator\",\n                  regex : /[?:,;.]/,\n                  next  : \"start\"\n              }, {\n                  token : \"paren.lparen\",\n                  regex : /[\\[({]/,\n                  next  : \"start\"\n              }, {\n                  token : \"paren.rparen\",\n                  regex : /[\\])}]/\n              }, {\n                  token: \"comment\",\n                  regex: /^#!.*$/\n              }\n          ],\n          property: [{\n                  token : \"text\",\n                  regex : \"\\\\s+\"\n              }, {\n                  token : [\n                      \"storage.type\", \"punctuation.operator\", \"entity.name.function\", \"text\",\n                      \"keyword.operator\", \"text\",\n                      \"storage.type\", \"text\", \"entity.name.function\", \"text\", \"paren.lparen\"\n                  ],\n                  regex : \"(\" + identifierRe + \")(\\\\.)(\" + identifierRe +\")(\\\\s*)(=)(\\\\s*)(function)(?:(\\\\s+)(\\\\w+))?(\\\\s*)(\\\\()\",\n                  next: \"function_arguments\"\n              }, {\n                  token : \"punctuation.operator\",\n                  regex : /[.](?![.])/\n              }, {\n                  token : \"support.function\",\n                  regex : /(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\\b(?=\\()/\n              }, {\n                  token : \"support.function.dom\",\n                  regex : /(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\\b(?=\\()/\n              }, {\n                  token :  \"support.constant\",\n                  regex : /(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\\b/\n              }, {\n                  token : \"identifier\",\n                  regex : identifierRe\n              }, {\n                  regex: \"\",\n                  token: \"empty\",\n                  next: \"no_regex\"\n              }\n          ],\n          \"start\": [\n              DocCommentHighlightRules.getStartRule(\"doc-start\"),\n              comments(\"start\"),\n              {\n                  token: \"string.regexp\",\n                  regex: \"\\\\/\",\n                  next: \"regex\"\n              }, {\n                  token : \"text\",\n                  regex : \"\\\\s+|^$\",\n                  next : \"start\"\n              }, {\n                  token: \"empty\",\n                  regex: \"\",\n                  next: \"no_regex\"\n              }\n          ],\n          \"regex\": [\n              {\n                  token: \"regexp.keyword.operator\",\n                  regex: \"\\\\\\\\(?:u[\\\\da-fA-F]{4}|x[\\\\da-fA-F]{2}|.)\"\n              }, {\n                  token: \"string.regexp\",\n                  regex: \"/[sxngimy]*\",\n                  next: \"no_regex\"\n              }, {\n                  token : \"invalid\",\n                  regex: /\\{\\d+\\b,?\\d*\\}[+*]|[+*$^?][+*]|[$^][?]|\\?{3,}/\n              }, {\n                  token : \"constant.language.escape\",\n                  regex: /\\(\\?[:=!]|\\)|\\{\\d+\\b,?\\d*\\}|[+*]\\?|[()$^+*?.]/\n              }, {\n                  token : \"constant.language.delimiter\",\n                  regex: /\\|/\n              }, {\n                  token: \"constant.language.escape\",\n                  regex: /\\[\\^?/,\n                  next: \"regex_character_class\"\n              }, {\n                  token: \"empty\",\n                  regex: \"$\",\n                  next: \"no_regex\"\n              }, {\n                  defaultToken: \"string.regexp\"\n              }\n          ],\n          \"regex_character_class\": [\n              {\n                  token: \"regexp.charclass.keyword.operator\",\n                  regex: \"\\\\\\\\(?:u[\\\\da-fA-F]{4}|x[\\\\da-fA-F]{2}|.)\"\n              }, {\n                  token: \"constant.language.escape\",\n                  regex: \"]\",\n                  next: \"regex\"\n              }, {\n                  token: \"constant.language.escape\",\n                  regex: \"-\"\n              }, {\n                  token: \"empty\",\n                  regex: \"$\",\n                  next: \"no_regex\"\n              }, {\n                  defaultToken: \"string.regexp.charachterclass\"\n              }\n          ],\n          \"function_arguments\": [\n              {\n                  token: \"variable.parameter\",\n                  regex: identifierRe\n              }, {\n                  token: \"punctuation.operator\",\n                  regex: \"[, ]+\"\n              }, {\n                  token: \"punctuation.operator\",\n                  regex: \"$\"\n              }, {\n                  token: \"empty\",\n                  regex: \"\",\n                  next: \"no_regex\"\n              }\n          ],\n          \"qqstring\" : [\n              {\n                  token : \"constant.language.escape\",\n                  regex : escapedRe\n              }, {\n                  token : \"string\",\n                  regex : \"\\\\\\\\$\",\n                  consumeLineEnd  : true\n              }, {\n                  token : \"string\",\n                  regex : '\"|$',\n                  next  : \"no_regex\"\n              }, {\n                  defaultToken: \"string\"\n              }\n          ],\n          \"qstring\" : [\n              {\n                  token : \"constant.language.escape\",\n                  regex : escapedRe\n              }, {\n                  token : \"string\",\n                  regex : \"\\\\\\\\$\",\n                  consumeLineEnd  : true\n              }, {\n                  token : \"string\",\n                  regex : \"'|$\",\n                  next  : \"no_regex\"\n              }, {\n                  defaultToken: \"string\"\n              }\n          ]\n      };\n  \n  \n      if (!options || !options.noES6) {\n          this.$rules.no_regex.unshift({\n              regex: \"[{}]\", onMatch: function(val, state, stack) {\n                  this.next = val == \"{\" ? this.nextState : \"\";\n                  if (val == \"{\" && stack.length) {\n                      stack.unshift(\"start\", state);\n                  }\n                  else if (val == \"}\" && stack.length) {\n                      stack.shift();\n                      this.next = stack.shift();\n                      if (this.next.indexOf(\"string\") != -1 || this.next.indexOf(\"jsx\") != -1)\n                          return \"paren.quasi.end\";\n                  }\n                  return val == \"{\" ? \"paren.lparen\" : \"paren.rparen\";\n              },\n              nextState: \"start\"\n          }, {\n              token : \"string.quasi.start\",\n              regex : /`/,\n              push  : [{\n                  token : \"constant.language.escape\",\n                  regex : escapedRe\n              }, {\n                  token : \"paren.quasi.start\",\n                  regex : /\\${/,\n                  push  : \"start\"\n              }, {\n                  token : \"string.quasi.end\",\n                  regex : /`/,\n                  next  : \"pop\"\n              }, {\n                  defaultToken: \"string.quasi\"\n              }]\n          });\n  \n          if (!options || options.jsx != false)\n              JSX.call(this);\n      }\n  \n      this.embedRules(DocCommentHighlightRules, \"doc-\",\n          [ DocCommentHighlightRules.getEndRule(\"no_regex\") ]);\n  \n      this.normalizeRules();\n  };\n  \n  oop.inherits(JavaScriptHighlightRules, TextHighlightRules);\n  \n  function JSX() {\n      var tagRegex = identifierRe.replace(\"\\\\d\", \"\\\\d\\\\-\");\n      var jsxTag = {\n          onMatch : function(val, state, stack) {\n              var offset = val.charAt(1) == \"/\" ? 2 : 1;\n              if (offset == 1) {\n                  if (state != this.nextState)\n                      stack.unshift(this.next, this.nextState, 0);\n                  else\n                      stack.unshift(this.next);\n                  stack[2]++;\n              } else if (offset == 2) {\n                  if (state == this.nextState) {\n                      stack[1]--;\n                      if (!stack[1] || stack[1] < 0) {\n                          stack.shift();\n                          stack.shift();\n                      }\n                  }\n              }\n              return [{\n                  type: \"meta.tag.punctuation.\" + (offset == 1 ? \"\" : \"end-\") + \"tag-open.xml\",\n                  value: val.slice(0, offset)\n              }, {\n                  type: \"meta.tag.tag-name.xml\",\n                  value: val.substr(offset)\n              }];\n          },\n          regex : \"</?\" + tagRegex + \"\",\n          next: \"jsxAttributes\",\n          nextState: \"jsx\"\n      };\n      this.$rules.start.unshift(jsxTag);\n      var jsxJsRule = {\n          regex: \"{\",\n          token: \"paren.quasi.start\",\n          push: \"start\"\n      };\n      this.$rules.jsx = [\n          jsxJsRule,\n          jsxTag,\n          {include : \"reference\"},\n          {defaultToken: \"string\"}\n      ];\n      this.$rules.jsxAttributes = [{\n          token : \"meta.tag.punctuation.tag-close.xml\",\n          regex : \"/?>\",\n          onMatch : function(value, currentState, stack) {\n              if (currentState == stack[0])\n                  stack.shift();\n              if (value.length == 2) {\n                  if (stack[0] == this.nextState)\n                      stack[1]--;\n                  if (!stack[1] || stack[1] < 0) {\n                      stack.splice(0, 2);\n                  }\n              }\n              this.next = stack[0] || \"start\";\n              return [{type: this.token, value: value}];\n          },\n          nextState: \"jsx\"\n      },\n      jsxJsRule,\n      comments(\"jsxAttributes\"),\n      {\n          token : \"entity.other.attribute-name.xml\",\n          regex : tagRegex\n      }, {\n          token : \"keyword.operator.attribute-equals.xml\",\n          regex : \"=\"\n      }, {\n          token : \"text.tag-whitespace.xml\",\n          regex : \"\\\\s+\"\n      }, {\n          token : \"string.attribute-value.xml\",\n          regex : \"'\",\n          stateName : \"jsx_attr_q\",\n          push : [\n              {token : \"string.attribute-value.xml\", regex: \"'\", next: \"pop\"},\n              {include : \"reference\"},\n              {defaultToken : \"string.attribute-value.xml\"}\n          ]\n      }, {\n          token : \"string.attribute-value.xml\",\n          regex : '\"',\n          stateName : \"jsx_attr_qq\",\n          push : [\n              {token : \"string.attribute-value.xml\", regex: '\"', next: \"pop\"},\n              {include : \"reference\"},\n              {defaultToken : \"string.attribute-value.xml\"}\n          ]\n      },\n      jsxTag\n      ];\n      this.$rules.reference = [{\n          token : \"constant.language.escape.reference.xml\",\n          regex : \"(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\\\.-]+;)\"\n      }];\n  }\n  \n  function comments(next) {\n      return [\n          {\n              token : \"comment\", // multi line comment\n              regex : /\\/\\*/,\n              next: [\n                  DocCommentHighlightRules.getTagRule(),\n                  {token : \"comment\", regex : \"\\\\*\\\\/\", next : next || \"pop\"},\n                  {defaultToken : \"comment\", caseInsensitive: true}\n              ]\n          }, {\n              token : \"comment\",\n              regex : \"\\\\/\\\\/\",\n              next: [\n                  DocCommentHighlightRules.getTagRule(),\n                  {token : \"comment\", regex : \"$|^\", next : next || \"pop\"},\n                  {defaultToken : \"comment\", caseInsensitive: true}\n              ]\n          }\n      ];\n  }\n  exports.JavaScriptHighlightRules = JavaScriptHighlightRules;\n  });\n  \n  ace.define(\"ace/mode/matching_brace_outdent\",[\"require\",\"exports\",\"module\",\"ace/range\"], function(require, exports, module) {\n  \"use strict\";\n  \n  var Range = require(\"../range\").Range;\n  \n  var MatchingBraceOutdent = function() {};\n  \n  (function() {\n  \n      this.checkOutdent = function(line, input) {\n          if (! /^\\s+$/.test(line))\n              return false;\n  \n          return /^\\s*\\}/.test(input);\n      };\n  \n      this.autoOutdent = function(doc, row) {\n          var line = doc.getLine(row);\n          var match = line.match(/^(\\s*\\})/);\n  \n          if (!match) return 0;\n  \n          var column = match[1].length;\n          var openBracePos = doc.findMatchingBracket({row: row, column: column});\n  \n          if (!openBracePos || openBracePos.row == row) return 0;\n  \n          var indent = this.$getIndent(doc.getLine(openBracePos.row));\n          doc.replace(new Range(row, 0, row, column-1), indent);\n      };\n  \n      this.$getIndent = function(line) {\n          return line.match(/^\\s*/)[0];\n      };\n  \n  }).call(MatchingBraceOutdent.prototype);\n  \n  exports.MatchingBraceOutdent = MatchingBraceOutdent;\n  });\n  \n  ace.define(\"ace/mode/folding/cstyle\",[\"require\",\"exports\",\"module\",\"ace/lib/oop\",\"ace/range\",\"ace/mode/folding/fold_mode\"], function(require, exports, module) {\n  \"use strict\";\n  \n  var oop = require(\"../../lib/oop\");\n  var Range = require(\"../../range\").Range;\n  var BaseFoldMode = require(\"./fold_mode\").FoldMode;\n  \n  var FoldMode = exports.FoldMode = function(commentRegex) {\n      if (commentRegex) {\n          this.foldingStartMarker = new RegExp(\n              this.foldingStartMarker.source.replace(/\\|[^|]*?$/, \"|\" + commentRegex.start)\n          );\n          this.foldingStopMarker = new RegExp(\n              this.foldingStopMarker.source.replace(/\\|[^|]*?$/, \"|\" + commentRegex.end)\n          );\n      }\n  };\n  oop.inherits(FoldMode, BaseFoldMode);\n  \n  (function() {\n      \n      this.foldingStartMarker = /([\\{\\[\\(])[^\\}\\]\\)]*$|^\\s*(\\/\\*)/;\n      this.foldingStopMarker = /^[^\\[\\{\\(]*([\\}\\]\\)])|^[\\s\\*]*(\\*\\/)/;\n      this.singleLineBlockCommentRe= /^\\s*(\\/\\*).*\\*\\/\\s*$/;\n      this.tripleStarBlockCommentRe = /^\\s*(\\/\\*\\*\\*).*\\*\\/\\s*$/;\n      this.startRegionRe = /^\\s*(\\/\\*|\\/\\/)#?region\\b/;\n      this._getFoldWidgetBase = this.getFoldWidget;\n      this.getFoldWidget = function(session, foldStyle, row) {\n          var line = session.getLine(row);\n      \n          if (this.singleLineBlockCommentRe.test(line)) {\n              if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))\n                  return \"\";\n          }\n      \n          var fw = this._getFoldWidgetBase(session, foldStyle, row);\n      \n          if (!fw && this.startRegionRe.test(line))\n              return \"start\"; // lineCommentRegionStart\n      \n          return fw;\n      };\n  \n      this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {\n          var line = session.getLine(row);\n          \n          if (this.startRegionRe.test(line))\n              return this.getCommentRegionBlock(session, line, row);\n          \n          var match = line.match(this.foldingStartMarker);\n          if (match) {\n              var i = match.index;\n  \n              if (match[1])\n                  return this.openingBracketBlock(session, match[1], row, i);\n                  \n              var range = session.getCommentFoldRange(row, i + match[0].length, 1);\n              \n              if (range && !range.isMultiLine()) {\n                  if (forceMultiline) {\n                      range = this.getSectionRange(session, row);\n                  } else if (foldStyle != \"all\")\n                      range = null;\n              }\n              \n              return range;\n          }\n  \n          if (foldStyle === \"markbegin\")\n              return;\n  \n          var match = line.match(this.foldingStopMarker);\n          if (match) {\n              var i = match.index + match[0].length;\n  \n              if (match[1])\n                  return this.closingBracketBlock(session, match[1], row, i);\n  \n              return session.getCommentFoldRange(row, i, -1);\n          }\n      };\n      \n      this.getSectionRange = function(session, row) {\n          var line = session.getLine(row);\n          var startIndent = line.search(/\\S/);\n          var startRow = row;\n          var startColumn = line.length;\n          row = row + 1;\n          var endRow = row;\n          var maxRow = session.getLength();\n          while (++row < maxRow) {\n              line = session.getLine(row);\n              var indent = line.search(/\\S/);\n              if (indent === -1)\n                  continue;\n              if  (startIndent > indent)\n                  break;\n              var subRange = this.getFoldWidgetRange(session, \"all\", row);\n              \n              if (subRange) {\n                  if (subRange.start.row <= startRow) {\n                      break;\n                  } else if (subRange.isMultiLine()) {\n                      row = subRange.end.row;\n                  } else if (startIndent == indent) {\n                      break;\n                  }\n              }\n              endRow = row;\n          }\n          \n          return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);\n      };\n      this.getCommentRegionBlock = function(session, line, row) {\n          var startColumn = line.search(/\\s*$/);\n          var maxRow = session.getLength();\n          var startRow = row;\n          \n          var re = /^\\s*(?:\\/\\*|\\/\\/|--)#?(end)?region\\b/;\n          var depth = 1;\n          while (++row < maxRow) {\n              line = session.getLine(row);\n              var m = re.exec(line);\n              if (!m) continue;\n              if (m[1]) depth--;\n              else depth++;\n  \n              if (!depth) break;\n          }\n  \n          var endRow = row;\n          if (endRow > startRow) {\n              return new Range(startRow, startColumn, endRow, line.length);\n          }\n      };\n  \n  }).call(FoldMode.prototype);\n  \n  });\n  \n  ace.define(\"ace/mode/javascript\",[\"require\",\"exports\",\"module\",\"ace/lib/oop\",\"ace/mode/text\",\"ace/mode/javascript_highlight_rules\",\"ace/mode/matching_brace_outdent\",\"ace/worker/worker_client\",\"ace/mode/behaviour/cstyle\",\"ace/mode/folding/cstyle\"], function(require, exports, module) {\n  \"use strict\";\n  \n  var oop = require(\"../lib/oop\");\n  var TextMode = require(\"./text\").Mode;\n  var JavaScriptHighlightRules = require(\"./javascript_highlight_rules\").JavaScriptHighlightRules;\n  var MatchingBraceOutdent = require(\"./matching_brace_outdent\").MatchingBraceOutdent;\n  var WorkerClient = require(\"../worker/worker_client\").WorkerClient;\n  var CstyleBehaviour = require(\"./behaviour/cstyle\").CstyleBehaviour;\n  var CStyleFoldMode = require(\"./folding/cstyle\").FoldMode;\n  \n  var Mode = function() {\n      this.HighlightRules = JavaScriptHighlightRules;\n      \n      this.$outdent = new MatchingBraceOutdent();\n      this.$behaviour = new CstyleBehaviour();\n      this.foldingRules = new CStyleFoldMode();\n  };\n  oop.inherits(Mode, TextMode);\n  \n  (function() {\n  \n      this.lineCommentStart = \"//\";\n      this.blockComment = {start: \"/*\", end: \"*/\"};\n      this.$quotes = {'\"': '\"', \"'\": \"'\", \"`\": \"`\"};\n  \n      this.getNextLineIndent = function(state, line, tab) {\n          var indent = this.$getIndent(line);\n  \n          var tokenizedLine = this.getTokenizer().getLineTokens(line, state);\n          var tokens = tokenizedLine.tokens;\n          var endState = tokenizedLine.state;\n  \n          if (tokens.length && tokens[tokens.length-1].type == \"comment\") {\n              return indent;\n          }\n  \n          if (state == \"start\" || state == \"no_regex\") {\n              var match = line.match(/^.*(?:\\bcase\\b.*:|[\\{\\(\\[])\\s*$/);\n              if (match) {\n                  indent += tab;\n              }\n          } else if (state == \"doc-start\") {\n              if (endState == \"start\" || endState == \"no_regex\") {\n                  return \"\";\n              }\n              var match = line.match(/^\\s*(\\/?)\\*/);\n              if (match) {\n                  if (match[1]) {\n                      indent += \" \";\n                  }\n                  indent += \"* \";\n              }\n          }\n  \n          return indent;\n      };\n  \n      this.checkOutdent = function(state, line, input) {\n          return this.$outdent.checkOutdent(line, input);\n      };\n  \n      this.autoOutdent = function(state, doc, row) {\n          this.$outdent.autoOutdent(doc, row);\n      };\n  \n      this.createWorker = function(session) {\n          var worker = new WorkerClient([\"ace\"], \"ace/mode/javascript_worker\", \"JavaScriptWorker\");\n          worker.attachToDocument(session.getDocument());\n  \n          worker.on(\"annotate\", function(results) {\n              session.setAnnotations(results.data);\n          });\n  \n          worker.on(\"terminate\", function() {\n              session.clearAnnotations();\n          });\n  \n          return worker;\n      };\n  \n      this.$id = \"ace/mode/javascript\";\n      this.snippetFileId = \"ace/snippets/javascript\";\n  }).call(Mode.prototype);\n  \n  exports.Mode = Mode;\n  });                (function() {\n                      ace.require([\"ace/mode/javascript\"], function(m) {\n                          if (typeof module == \"object\" && typeof exports == \"object\" && module) {\n                              module.exports = m;\n                          }\n                      });\n                  })();\n              "
