# [std_string.test.w](../../../../../examples/tests/valid/std_string.test.w) | compile | tf-aws

## inflight.$Closure1-1.js
```js
"use strict";
module.exports = function({ $__arr__index_______if__index___0____index____arr_length__throw_new_Error__Index_out_of_bounds____return_arr_index_______s1_split________1_, $_s1_concat_s2__, $s1_indexOf__s__ }) {
  class $Closure1 {
    constructor({  }) {
      const $obj = (...args) => this.handle(...args);
      Object.setPrototypeOf($obj, this);
      return $obj;
    }
    async handle() {
      {console.log(String.raw({ raw: ["index of \"s\" in s1 is ", ""] }, $s1_indexOf__s__))};
      {console.log($__arr__index_______if__index___0____index____arr_length__throw_new_Error__Index_out_of_bounds____return_arr_index_______s1_split________1_)};
      {console.log($_s1_concat_s2__)};
    }
  }
  return $Closure1;
}
//# sourceMappingURL=inflight.$Closure1-1.js.map
```

## main.tf.json
```json
{
  "//": {
    "metadata": {
      "backend": "local",
      "stackName": "root",
      "version": "0.17.0"
    },
    "outputs": {}
  },
  "provider": {
    "aws": [
      {}
    ]
  }
}
```

## preflight.js
```js
"use strict";
const $stdlib = require('@winglang/sdk');
const $platforms = ((s) => !s ? [] : s.split(';'))(process.env.WING_PLATFORMS);
const $outdir = process.env.WING_SYNTH_DIR ?? ".";
const $wing_is_test = process.env.WING_IS_TEST === "true";
const std = $stdlib.std;
class $Root extends $stdlib.std.Resource {
  constructor($scope, $id) {
    super($scope, $id);
    class $Closure1 extends $stdlib.std.Resource {
      _hash = require('crypto').createHash('md5').update(this._toInflight()).digest('hex');
      constructor($scope, $id, ) {
        super($scope, $id);
        (std.Node.of(this)).hidden = true;
      }
      static _toInflightType() {
        return `
          require("./inflight.$Closure1-1.js")({
            $__arr__index_______if__index___0____index____arr_length__throw_new_Error__Index_out_of_bounds____return_arr_index_______s1_split________1_: ${$stdlib.core.liftObject(((arr, index) => { if (index < 0 || index >= arr.length) throw new Error("Index out of bounds"); return arr[index]; })((s1.split(" ")), 1))},
            $_s1_concat_s2__: ${$stdlib.core.liftObject((s1.concat(s2)))},
            $s1_indexOf__s__: ${$stdlib.core.liftObject(s1.indexOf("s"))},
          })
        `;
      }
      _toInflight() {
        return `
          (await (async () => {
            const $Closure1Client = ${$Closure1._toInflightType(this)};
            const client = new $Closure1Client({
            });
            if (client.$inflight_init) { await client.$inflight_init(); }
            return client;
          })())
        `;
      }
      _supportedOps() {
        return [...super._supportedOps(), "handle", "$inflight_init"];
      }
      _registerOnLift(host, ops) {
        if (ops.includes("handle")) {
          $Closure1._registerOnLiftObject(((arr, index) => { if (index < 0 || index >= arr.length) throw new Error("Index out of bounds"); return arr[index]; })((s1.split(" ")), 1), host, []);
          $Closure1._registerOnLiftObject((s1.concat(s2)), host, []);
          $Closure1._registerOnLiftObject(s1.indexOf("s"), host, []);
        }
        super._registerOnLift(host, ops);
      }
    }
    const s1 = "some string";
    const s2 = "s are immutable";
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.length == 11")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(s1.length,11)))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.at(7) == \"r\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(((args) => { if (7 >= s1.length || 7 + s1.length < 0) {throw new Error("index out of bounds")}; return s1.at(7) })(7),"r")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.concat(s2) == \"some strings are immutable\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })((s1.concat(s2)),"some strings are immutable")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.contains(\"some\")")})(s1.includes("some"))};
    {((cond) => {if (!cond) throw new Error("assertion failed: !\"some\".contains(s1)")})((!"some".includes(s1)))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.endsWith(\"string\")")})(s1.endsWith("string"))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.indexOf(\"s\") == 0")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(s1.indexOf("s"),0)))};
    {((cond) => {if (!cond) throw new Error("assertion failed: \"Some String\".lowercase() == \"some string\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })("Some String".toLocaleLowerCase(),"some string")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.split(\" \").at(0) == \"some\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(((arr, index) => { if (index < 0 || index >= arr.length) throw new Error("Index out of bounds"); return arr[index]; })((s1.split(" ")), 0),"some")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.startsWith(\"some\")")})(s1.startsWith("some"))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.substring(5) == \"string\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })((s1.substring(5)),"string")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: s1.substring(5, 7) == \"st\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })((s1.substring(5, 7)),"st")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: \"   some string   \".trim() == \"some string\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(("   some string   ".trim()),"some string")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: \"Some String\".uppercase() == \"SOME STRING\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })("Some String".toLocaleUpperCase(),"SOME STRING")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: \"hello\" + \" world\" == \"hello world\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(("hello" + " world"),"hello world")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: \n\"hello {\"funky\"}\n world\" == \"hello funky\\n world\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(String.raw({ raw: ["hello ", "\n world"] }, "funky"),"hello funky\n world")))};
    this.node.root.new("@winglang/sdk.std.Test", std.Test, this, "test:string", new $Closure1(this, "$Closure1"));
  }
}
const $PlatformManager = new $stdlib.platform.PlatformManager({platformPaths: $platforms});
const $APP = $PlatformManager.createApp({ outdir: $outdir, name: "std_string.test", rootConstruct: $Root, isTestEnvironment: $wing_is_test, entrypointDir: process.env['WING_SOURCE_DIR'], rootId: process.env['WING_ROOT_ID'] });
$APP.synth();
//# sourceMappingURL=preflight.js.map
```

