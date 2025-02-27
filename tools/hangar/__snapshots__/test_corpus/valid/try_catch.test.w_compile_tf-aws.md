# [try_catch.test.w](../../../../../examples/tests/valid/try_catch.test.w) | compile | tf-aws

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
    let x = "";
    try {
      throw new Error("hello");
      x = "no way I got here";
    }
    catch ($error_e) {
      const e = $error_e.message;
      {((cond) => {if (!cond) throw new Error("assertion failed: e == \"hello\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(e,"hello")))};
      x = "caught";
    }
    finally {
      {((cond) => {if (!cond) throw new Error("assertion failed: x == \"caught\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(x,"caught")))};
      x = "finally";
    }
    {((cond) => {if (!cond) throw new Error("assertion failed: x == \"finally\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(x,"finally")))};
    try {
      x = "I got here";
    }
    catch ($error_e) {
      const e = $error_e.message;
      x = "caught";
    }
    finally {
      {((cond) => {if (!cond) throw new Error("assertion failed: x == \"I got here\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(x,"I got here")))};
      x = "finally";
    }
    {((cond) => {if (!cond) throw new Error("assertion failed: x == \"finally\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(x,"finally")))};
    try {
      try {
        throw new Error("hello");
      }
      finally {
        x = "finally with no catch";
      }
      {((cond) => {if (!cond) throw new Error("assertion failed: x == \"finally with no catch\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(x,"finally with no catch")))};
    }
    catch {
    }
    try {
    }
    finally {
      x = "finally with no catch and no exception";
    }
    {((cond) => {if (!cond) throw new Error("assertion failed: x == \"finally with no catch and no exception\"")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(x,"finally with no catch and no exception")))};
    {((cond) => {if (!cond) throw new Error("assertion failed: (():num => { try {} finally {return 1;}})() == 1")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(((() => {
      try {
      }
      finally {
        return 1;
      }
    })()),1)))};
    {((cond) => {if (!cond) throw new Error("assertion failed: (():num => { try {throw \"\";} catch {return 2;}})() == 2")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(((() => {
      try {
        throw new Error("");
      }
      catch {
        return 2;
      }
    })()),2)))};
    {((cond) => {if (!cond) throw new Error("assertion failed: (():num => { try {return 3;} finally {}})() == 3")})((((a,b) => { try { return require('assert').deepStrictEqual(a,b) === undefined; } catch { return false; } })(((() => {
      try {
        return 3;
      }
      finally {
      }
    })()),3)))};
  }
}
const $PlatformManager = new $stdlib.platform.PlatformManager({platformPaths: $platforms});
const $APP = $PlatformManager.createApp({ outdir: $outdir, name: "try_catch.test", rootConstruct: $Root, isTestEnvironment: $wing_is_test, entrypointDir: process.env['WING_SOURCE_DIR'], rootId: process.env['WING_ROOT_ID'] });
$APP.synth();
//# sourceMappingURL=preflight.js.map
```

