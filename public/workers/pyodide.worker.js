var Pe=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var qe=Pe((Je,C)=>{var ke=Object.defineProperty,a=(e,t)=>ke(e,"name",{value:t,configurable:!0}),$=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),Re=(()=>{for(var e=new Uint8Array(128),t=0;t<64;t++)e[t<26?t+65:t<52?t+71:t<62?t-4:t*4-205]=t;return r=>{for(var o=r.length,n=new Uint8Array((o-(r[o-1]=="=")-(r[o-2]=="="))*3/4|0),i=0,s=0;i<o;){var l=e[r.charCodeAt(i++)],c=e[r.charCodeAt(i++)],u=e[r.charCodeAt(i++)],d=e[r.charCodeAt(i++)];n[s++]=l<<2|c>>4,n[s++]=c<<4|u>>2,n[s++]=u<<6|d}return n}})();function V(e){return!isNaN(parseFloat(e))&&isFinite(e)}a(V,"_isNumber");function g(e){return e.charAt(0).toUpperCase()+e.substring(1)}a(g,"_capitalize");function L(e){return function(){return this[e]}}a(L,"_getter");var N=["isConstructor","isEval","isNative","isToplevel"],S=["columnNumber","lineNumber"],A=["fileName","functionName","source"],Fe=["args"],Le=["evalOrigin"],F=N.concat(S,A,Fe,Le);function y(e){if(e)for(var t=0;t<F.length;t++)e[F[t]]!==void 0&&this["set"+g(F[t])](e[F[t]])}a(y,"StackFrame");y.prototype={getArgs:a(function(){return this.args},"getArgs"),setArgs:a(function(e){if(Object.prototype.toString.call(e)!=="[object Array]")throw new TypeError("Args must be an Array");this.args=e},"setArgs"),getEvalOrigin:a(function(){return this.evalOrigin},"getEvalOrigin"),setEvalOrigin:a(function(e){if(e instanceof y)this.evalOrigin=e;else if(e instanceof Object)this.evalOrigin=new y(e);else throw new TypeError("Eval Origin must be an Object or StackFrame")},"setEvalOrigin"),toString:a(function(){var e=this.getFileName()||"",t=this.getLineNumber()||"",r=this.getColumnNumber()||"",o=this.getFunctionName()||"";return this.getIsEval()?e?"[eval] ("+e+":"+t+":"+r+")":"[eval]:"+t+":"+r:o?o+" ("+e+":"+t+":"+r+")":e+":"+t+":"+r},"toString")};y.fromString=a(function(e){var t=e.indexOf("("),r=e.lastIndexOf(")"),o=e.substring(0,t),n=e.substring(t+1,r).split(","),i=e.substring(r+1);if(i.indexOf("@")===0)var s=/@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(i,""),l=s[1],c=s[2],u=s[3];return new y({functionName:o,args:n||void 0,fileName:l,lineNumber:c||void 0,columnNumber:u||void 0})},"StackFrame$$fromString");for(w=0;w<N.length;w++)y.prototype["get"+g(N[w])]=L(N[w]),y.prototype["set"+g(N[w])]=(function(e){return function(t){this[e]=!!t}})(N[w]);var w;for(v=0;v<S.length;v++)y.prototype["get"+g(S[v])]=L(S[v]),y.prototype["set"+g(S[v])]=(function(e){return function(t){if(!V(t))throw new TypeError(e+" must be a Number");this[e]=Number(t)}})(S[v]);var v;for(b=0;b<A.length;b++)y.prototype["get"+g(A[b])]=L(A[b]),y.prototype["set"+g(A[b])]=(function(e){return function(t){this[e]=String(t)}})(A[b]);var b,D=y;function z(){var e=/^\s*at .*(\S+:\d+|\(native\))/m,t=/^(eval@)?(\[native code])?$/;return{parse:a(function(r){if(r.stack&&r.stack.match(e))return this.parseV8OrIE(r);if(r.stack)return this.parseFFOrSafari(r);throw new Error("Cannot parse given Error object")},"ErrorStackParser$$parse"),extractLocation:a(function(r){if(r.indexOf(":")===-1)return[r];var o=/(.+?)(?::(\d+))?(?::(\d+))?$/,n=o.exec(r.replace(/[()]/g,""));return[n[1],n[2]||void 0,n[3]||void 0]},"ErrorStackParser$$extractLocation"),parseV8OrIE:a(function(r){var o=r.stack.split(`
`).filter(function(n){return!!n.match(e)},this);return o.map(function(n){n.indexOf("(eval ")>-1&&(n=n.replace(/eval code/g,"eval").replace(/(\(eval at [^()]*)|(,.*$)/g,""));var i=n.replace(/^\s+/,"").replace(/\(eval code/g,"(").replace(/^.*?\s+/,""),s=i.match(/ (\(.+\)$)/);i=s?i.replace(s[0],""):i;var l=this.extractLocation(s?s[1]:i),c=s&&i||void 0,u=["eval","<anonymous>"].indexOf(l[0])>-1?void 0:l[0];return new D({functionName:c,fileName:u,lineNumber:l[1],columnNumber:l[2],source:n})},this)},"ErrorStackParser$$parseV8OrIE"),parseFFOrSafari:a(function(r){var o=r.stack.split(`
`).filter(function(n){return!n.match(t)},this);return o.map(function(n){if(n.indexOf(" > eval")>-1&&(n=n.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,":$1")),n.indexOf("@")===-1&&n.indexOf(":")===-1)return new D({functionName:n});var i=/((.*".+"[^@]*)?[^@]*)(?:@)/,s=n.match(i),l=s&&s[1]?s[1]:void 0,c=this.extractLocation(n.replace(i,""));return new D({functionName:l,fileName:c[0],lineNumber:c[1],columnNumber:c[2],source:n})},this)},"ErrorStackParser$$parseFFOrSafari")}}a(z,"ErrorStackParser");var De=new z,Te=De;function q(){if(typeof API<"u"&&API!==globalThis.API)return API.runtimeEnv;let e=typeof Bun<"u",t=typeof Deno<"u",r=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string"&&!process.browser,o=typeof navigator=="object"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome")===-1&&navigator.userAgent.indexOf("Safari")>-1;return G({IN_BUN:e,IN_DENO:t,IN_NODE:r,IN_SAFARI:o,IN_SHELL:typeof read=="function"&&typeof load=="function"})}a(q,"getGlobalRuntimeEnv");var p=q();function G(e){let t=e.IN_NODE&&typeof C<"u"&&C.exports&&typeof $=="function"&&typeof __dirname=="string",r=e.IN_NODE&&!t,o=!e.IN_NODE&&!e.IN_DENO&&!e.IN_BUN,n=o&&typeof window<"u"&&typeof window.document<"u"&&typeof document.createElement=="function"&&"sessionStorage"in window&&typeof globalThis.importScripts!="function",i=o&&typeof globalThis.WorkerGlobalScope<"u"&&typeof globalThis.self<"u"&&globalThis.self instanceof globalThis.WorkerGlobalScope;return{...e,IN_BROWSER:o,IN_BROWSER_MAIN_THREAD:n,IN_BROWSER_WEB_WORKER:i,IN_NODE_COMMONJS:t,IN_NODE_ESM:r}}a(G,"calculateDerivedFlags");var J,T,K,W,U;async function M(){if(!p.IN_NODE||(J=(await import("./chunks/9wXp6ZBx.js")).default,W=await import("./chunks/9wXp6ZBx.js"),U=await import("./chunks/9wXp6ZBx.js"),K=(await import("./chunks/9wXp6ZBx.js")).default,T=await import("./chunks/9wXp6ZBx.js"),B=T.sep,typeof $<"u"))return;let e=W,t=await import("./chunks/9wXp6ZBx.js"),r=await import("./chunks/9wXp6ZBx.js"),o=await import("./chunks/9wXp6ZBx.js"),n={fs:e,crypto:t,ws:r,child_process:o};globalThis.require=function(i){return n[i]}}a(M,"initNodeModules");function Y(e,t){return T.resolve(t||".",e)}a(Y,"node_resolvePath");function Z(e,t){return t===void 0&&(t=location),new URL(e,t).toString()}a(Z,"browser_resolvePath");var k;p.IN_NODE?k=Y:p.IN_SHELL?k=a(e=>e,"resolvePath"):k=Z;var B;p.IN_NODE||(B="/");function Q(e,t){return e.startsWith("file://")&&(e=e.slice(7)),e.includes("://")?{response:fetch(e)}:{binary:U.readFile(e).then(r=>new Uint8Array(r.buffer,r.byteOffset,r.byteLength))}}a(Q,"node_getBinaryResponse");function X(e,t){if(e.startsWith("file://")&&(e=e.slice(7)),e.includes("://"))throw new Error("Shell cannot fetch urls");return{binary:Promise.resolve(new Uint8Array(readbuffer(e)))}}a(X,"shell_getBinaryResponse");function ee(e,t){let r=new URL(e,location);return{response:fetch(r,t?{integrity:t}:{})}}a(ee,"browser_getBinaryResponse");var R;p.IN_NODE?R=Q:p.IN_SHELL?R=X:R=ee;async function te(e,t){let{response:r,binary:o}=R(e,t);if(o)return o;let n=await r;if(!n.ok)throw new Error(`Failed to load '${e}': request failed.`);return new Uint8Array(await n.arrayBuffer())}a(te,"loadBinaryFile");var O;if(p.IN_BROWSER_MAIN_THREAD)O=a(async e=>await import(e),"loadScript");else if(p.IN_BROWSER_WEB_WORKER)O=a(async e=>{try{globalThis.importScripts(e)}catch(t){if(t instanceof TypeError)await import(e);else throw t}},"loadScript");else if(p.IN_NODE)O=re;else if(p.IN_SHELL)O=load;else throw new Error("Cannot determine runtime environment");async function re(e){e.startsWith("file://")&&(e=e.slice(7)),e.includes("://")?K.runInThisContext(await(await fetch(e)).text()):await import(J.pathToFileURL(e).href)}a(re,"nodeLoadScript");async function ne(e){if(p.IN_NODE){await M();let t=await U.readFile(e,{encoding:"utf8"});return JSON.parse(t)}else if(p.IN_SHELL){let t=read(e);return JSON.parse(t)}else return await(await fetch(e)).json()}a(ne,"loadLockFile");async function oe(){if(p.IN_NODE_COMMONJS)return __dirname;let e;try{throw new Error}catch(o){e=o}let t=Te.parse(e)[0].fileName;if(p.IN_NODE&&!t.startsWith("file://")&&(t=`file://${t}`),p.IN_NODE_ESM){let o=await import("./chunks/9wXp6ZBx.js");return(await import("./chunks/9wXp6ZBx.js")).fileURLToPath(o.dirname(t))}let r=t.lastIndexOf(B);if(r===-1)throw new Error("Could not extract indexURL path from pyodide module location. Please pass the indexURL explicitly to loadPyodide.");return t.slice(0,r)}a(oe,"calculateDirname");function ie(e){return e.substring(0,e.lastIndexOf("/")+1)||globalThis.location?.toString()||"."}a(ie,"calculateInstallBaseUrl");function ae(e){let t=e.FS,r=e.FS.filesystems.MEMFS,o=e.PATH,n={DIR_MODE:16895,FILE_MODE:33279,mount:a(function(i){if(!i.opts.fileSystemHandle)throw new Error("opts.fileSystemHandle is required");return r.mount.apply(null,arguments)},"mount"),syncfs:a(async(i,s,l)=>{try{let c=n.getLocalSet(i),u=await n.getRemoteSet(i),d=s?u:c,h=s?c:u;await n.reconcile(i,d,h),l(null)}catch(c){l(c)}},"syncfs"),getLocalSet:a(i=>{let s=Object.create(null);function l(d){return d!=="."&&d!==".."}a(l,"isRealDir");function c(d){return h=>o.join2(d,h)}a(c,"toAbsolute");let u=t.readdir(i.mountpoint).filter(l).map(c(i.mountpoint));for(;u.length;){let d=u.pop(),h=t.stat(d);t.isDir(h.mode)&&u.push.apply(u,t.readdir(d).filter(l).map(c(d))),s[d]={timestamp:h.mtime,mode:h.mode}}return{type:"local",entries:s}},"getLocalSet"),getRemoteSet:a(async i=>{let s=Object.create(null),l=await xe(i.opts.fileSystemHandle);for(let[c,u]of l)c!=="."&&(s[o.join2(i.mountpoint,c)]={timestamp:u.kind==="file"?new Date((await u.getFile()).lastModified):new Date,mode:u.kind==="file"?n.FILE_MODE:n.DIR_MODE});return{type:"remote",entries:s,handles:l}},"getRemoteSet"),loadLocalEntry:a(i=>{let s=t.lookupPath(i,{}).node,l=t.stat(i);if(t.isDir(l.mode))return{timestamp:l.mtime,mode:l.mode};if(t.isFile(l.mode))return s.contents=r.getFileDataAsTypedArray(s),{timestamp:l.mtime,mode:l.mode,contents:s.contents};throw new Error("node type not supported")},"loadLocalEntry"),storeLocalEntry:a((i,s)=>{if(t.isDir(s.mode))t.mkdirTree(i,s.mode);else if(t.isFile(s.mode))t.writeFile(i,s.contents,{canOwn:!0});else throw new Error("node type not supported");t.chmod(i,s.mode),t.utime(i,s.timestamp,s.timestamp)},"storeLocalEntry"),removeLocalEntry:a(i=>{var s=t.stat(i);t.isDir(s.mode)?t.rmdir(i):t.isFile(s.mode)&&t.unlink(i)},"removeLocalEntry"),loadRemoteEntry:a(async i=>{if(i.kind==="file"){let s=await i.getFile();return{contents:new Uint8Array(await s.arrayBuffer()),mode:n.FILE_MODE,timestamp:new Date(s.lastModified)}}else{if(i.kind==="directory")return{mode:n.DIR_MODE,timestamp:new Date};throw new Error("unknown kind: "+i.kind)}},"loadRemoteEntry"),storeRemoteEntry:a(async(i,s,l)=>{let c=i.get(o.dirname(s)),u=t.isFile(l.mode)?await c.getFileHandle(o.basename(s),{create:!0}):await c.getDirectoryHandle(o.basename(s),{create:!0});if(u.kind==="file"){let d=await u.createWritable();await d.write(l.contents),await d.close()}i.set(s,u)},"storeRemoteEntry"),removeRemoteEntry:a(async(i,s)=>{await i.get(o.dirname(s)).removeEntry(o.basename(s)),i.delete(s)},"removeRemoteEntry"),reconcile:a(async(i,s,l)=>{let c=0,u=[];Object.keys(s.entries).forEach(function(f){let _=s.entries[f],E=l.entries[f];(!E||t.isFile(_.mode)&&_.timestamp.getTime()>E.timestamp.getTime())&&(u.push(f),c++)}),u.sort();let d=[];if(Object.keys(l.entries).forEach(function(f){s.entries[f]||(d.push(f),c++)}),d.sort().reverse(),!c)return;let h=s.type==="remote"?s.handles:l.handles;for(let f of u){let _=o.normalize(f.replace(i.mountpoint,"/")).substring(1);if(l.type==="local"){let E=h.get(_),Oe=await n.loadRemoteEntry(E);n.storeLocalEntry(f,Oe)}else{let E=n.loadLocalEntry(f);await n.storeRemoteEntry(h,_,E)}}for(let f of d)if(l.type==="local")n.removeLocalEntry(f);else{let _=o.normalize(f.replace(i.mountpoint,"/")).substring(1);await n.removeRemoteEntry(h,_)}},"reconcile")};e.FS.filesystems.NATIVEFS_ASYNC=n}a(ae,"initializeNativeFS");var xe=a(async e=>{let t=[];async function r(n){for await(let i of n.values())t.push(i),i.kind==="directory"&&await r(i)}a(r,"collect"),await r(e);let o=new Map;o.set(".",e);for(let n of t){let i=(await e.resolve(n)).join("/");o.set(i,n)}return o},"getFsHandles"),Ce=Re("AGFzbQEAAAABDANfAGAAAW9gAW8BfwMDAgECByECD2NyZWF0ZV9zZW50aW5lbAAAC2lzX3NlbnRpbmVsAAEKEwIHAPsBAPsbCwkAIAD7GvsUAAs="),Ue=(async function(){if(!(globalThis.navigator&&(/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&typeof navigator.maxTouchPoints<"u"&&navigator.maxTouchPoints>1)))try{let e=await WebAssembly.compile(Ce);return await WebAssembly.instantiate(e)}catch(e){if(e instanceof WebAssembly.CompileError)return;throw e}})();async function se(){let e=await Ue;if(e)return e.exports;let t=Symbol("error marker");return{create_sentinel:a(()=>t,"create_sentinel"),is_sentinel:a(r=>r===t,"is_sentinel")}}a(se,"getSentinelImport");function le(e){let t={config:e,runtimeEnv:p},r={noImageDecoding:!0,noAudioDecoding:!0,noWasmDecoding:!1,preRun:me(e),print:e.stdout,printErr:e.stderr,onExit(o){r.exitCode=o},thisProgram:e._sysExecutable,arguments:e.args,API:t,locateFile:a(o=>e.indexURL+o,"locateFile"),instantiateWasm:ye(e.indexURL)};return r}a(le,"createSettings");function ce(e){return function(t){let r="/";try{t.FS.mkdirTree(e)}catch(o){console.error(`Error occurred while making a home directory '${e}':`),console.error(o),console.error(`Using '${r}' for a home directory instead`),e=r}t.FS.chdir(e)}}a(ce,"createHomeDirectory");function ue(e){return function(t){Object.assign(t.ENV,e)}}a(ue,"setEnvironment");function de(e){return e?[async t=>{t.addRunDependency("fsInitHook");try{await e(t.FS,{sitePackages:t.API.sitePackages})}finally{t.removeRunDependency("fsInitHook")}}]:[]}a(de,"callFsInitHook");function pe(e){let t=e.HEAPU32[e._Py_Version>>>2],r=t>>>24&255,o=t>>>16&255,n=t>>>8&255;return[r,o,n]}a(pe,"computeVersionTuple");function fe(e){let t=te(e);return async r=>{r.API.pyVersionTuple=pe(r);let[o,n]=r.API.pyVersionTuple;r.FS.mkdirTree("/lib"),r.API.sitePackages=`/lib/python${o}.${n}/site-packages`,r.FS.mkdirTree(r.API.sitePackages),r.addRunDependency("install-stdlib");try{let i=await t;r.FS.writeFile(`/lib/python${o}${n}.zip`,i)}catch(i){console.error("Error occurred while installing the standard library:"),console.error(i)}finally{r.removeRunDependency("install-stdlib")}}}a(fe,"installStdlib");function me(e){let t;return e.stdLibURL!=null?t=e.stdLibURL:t=e.indexURL+"python_stdlib.zip",[fe(t),ce(e.env.HOME),ue(e.env),ae,...de(e.fsInit)]}a(me,"getFileSystemInitializationFuncs");function ye(e){if(typeof WasmOffsetConverter<"u")return;let{binary:t,response:r}=R(e+"pyodide.asm.wasm"),o=se();return function(n,i){return(async function(){n.sentinel=await o;try{let s;r?s=await WebAssembly.instantiateStreaming(r,n):s=await WebAssembly.instantiate(await t,n);let{instance:l,module:c}=s;i(l,c)}catch(s){console.warn("wasm instantiation failed!"),console.warn(s)}})(),{}}}a(ye,"getInstantiateWasmFunc");var Me="0.29.3";function P(e){return e===void 0||e.endsWith("/")?e:e+"/"}a(P,"withTrailingSlash");var x=Me;async function he(e={}){if(await M(),e.lockFileContents&&e.lockFileURL)throw new Error("Can't pass both lockFileContents and lockFileURL");let t=e.indexURL||await oe();if(t=P(k(t)),e.packageBaseUrl=P(e.packageBaseUrl),e.cdnUrl=P(e.packageBaseUrl??`https://cdn.jsdelivr.net/pyodide/v${x}/full/`),!e.lockFileContents){let n=e.lockFileURL??t+"pyodide-lock.json";e.lockFileContents=ne(n),e.packageBaseUrl??=ie(n)}e.indexURL=t,e.packageCacheDir&&(e.packageCacheDir=P(k(e.packageCacheDir)));let r={fullStdLib:!1,jsglobals:globalThis,stdin:globalThis.prompt?()=>globalThis.prompt():void 0,args:[],env:{},packages:[],packageCacheDir:e.packageBaseUrl,enableRunUntilComplete:!0,checkAPIVersion:!0,BUILD_ID:"b7b7b0f46eb68e65c029c0dc739270e8a5d35251e9aab6014ee1c2f630e5d1d0"},o=Object.assign(r,e);return o.env.HOME??="/home/pyodide",o.env.PYTHONINSPECT??="1",o}a(he,"initializeConfiguration");function ge(e){let t=le(e),r=t.API;return r.lockFilePromise=Promise.resolve(e.lockFileContents),t}a(ge,"createEmscriptenSettings");async function _e(e){if(typeof _createPyodideModule!="function"){let t=`${e.indexURL}pyodide.asm.js`;await O(t)}}a(_e,"loadWasmScript");async function we(e,t){if(!e._loadSnapshot)return;let r=await e._loadSnapshot,o=ArrayBuffer.isView(r)?r:new Uint8Array(r);return t.noInitialRun=!0,t.INITIAL_MEMORY=o.length,o}a(we,"prepareSnapshot");async function ve(e){let t=await _createPyodideModule(e);if(e.exitCode!==void 0)throw new t.ExitStatus(e.exitCode);return t}a(ve,"createPyodideModule");function be(e,t){let r=e.API;if(t.pyproxyToStringRepr&&r.setPyProxyToStringMethod(!0),t.convertNullToNone&&r.setCompatNullToNone(!0),t.toJsLiteralMap&&r.setCompatToJsLiteralMap(!0),r.version!==x&&t.checkAPIVersion)throw new Error(`Pyodide version does not match: '${x}' <==> '${r.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);e.locateFile=o=>{throw o.endsWith(".so")?new Error(`Failed to find dynamic library "${o}"`):new Error(`Unexpected call to locateFile("${o}")`)}}a(be,"configureAPI");function Ee(e,t,r){let o=e.API,n;return t&&(n=o.restoreSnapshot(t)),o.finalizeBootstrap(n,r._snapshotDeserializer)}a(Ee,"bootstrapPyodide");async function Ne(e,t){let r=e._api;return r.sys.path.insert(0,""),r._pyodide.set_excepthook(),await r.packageIndexReady,r.initializeStreams(t.stdin,t.stdout,t.stderr),e}a(Ne,"finalizeSetup");async function Se(e={}){let t=await he(e),r=ge(t);await _e(t);let o=await we(t,r),n=await ve(r);be(n,t);let i=Ee(n,o,t);return await Ne(i,t)}a(Se,"loadPyodide");var Be=`# ruff: noqa: F821

import pathlib

from rendercv.schema.rendercv_model_builder import (
    build_rendercv_dictionary_and_model,
    BuildRendercvModelArguments,
)
from rendercv.schema.pydantic_error_handling import (
    get_coordinates_of_a_key_in_a_yaml_object,
)
from rendercv.renderer.templater.templater import render_full_template
from rendercv.exception import RenderCVUserValidationError
from dataclasses import asdict

yaml_input_cv: str  # Set by Pyodide via pyodide.globals.set()
yaml_input_design: str
yaml_input_locale: str
yaml_input_settings: str
unavailable_photo_urls: list[str]  # Photo URLs the browser recently failed to load

# Pyodide can't make HTTPS requests, so rendercv must not download \`cv.photo\`
# itself. The browser fetches the image and gives it to the Typst compiler
# under this file name (TYPST_PHOTO_FILE_NAME in photo.ts).
PHOTO_FILE_NAME = "rendercv-photo"
LOCAL_PHOTO_MESSAGE = (
    "Use a link to an image (https://...). Files from your computer can't be used here."
)
INVALID_PHOTO_LINK_MESSAGE = (
    "This isn't a valid link. Use a full https:// link to an image."
)

kwargs: BuildRendercvModelArguments = {}
kwargs["design_yaml_file"] = yaml_input_design
kwargs["locale_yaml_file"] = yaml_input_locale
kwargs["settings_yaml_file"] = yaml_input_settings


def photo_location(dictionary) -> list | None:
    try:
        return get_coordinates_of_a_key_in_a_yaml_object(dictionary, ("cv", "photo"))
    except Exception:
        return None


try:
    dictionary, model = build_rendercv_dictionary_and_model(
        yaml_input_cv,
        **kwargs,
    )
except RenderCVUserValidationError as e:
    formatted_errors = []
    for error in e.validation_errors:
        formatted_error = asdict(error)
        if error.schema_location == ("cv", "photo"):
            # rendercv explains photos in terms of files next to the YAML file,
            # which don't exist in the browser.
            formatted_error["message"] = (
                INVALID_PHOTO_LINK_MESSAGE
                if error.input.lower().startswith(("http://", "https://"))
                else LOCAL_PHOTO_MESSAGE
            )
        formatted_errors.append(formatted_error)
    result = {"content": None, "errors": formatted_errors}
except Exception as e:
    result = {
        "content": None,
        "errors": [
            {
                "message": str(e),
                "schema_location": [],
                "input": "",
                "yaml_source": "main_yaml_file",
                "yaml_location": None,
            }
        ],
    }
else:
    photo = None
    if isinstance(model.cv.photo, pathlib.Path):
        # Only reachable with a path into Pyodide's own file system.
        result = {
            "content": None,
            "errors": [
                {
                    "message": LOCAL_PHOTO_MESSAGE,
                    "schema_location": ["cv", "photo"],
                    "input": str(model.cv.photo),
                    "yaml_source": "main_yaml_file",
                    "yaml_location": photo_location(dictionary),
                }
            ],
        }
    else:
        if model.cv.photo is not None:
            photo_url = str(model.cv.photo)
            omitted = photo_url in unavailable_photo_urls
            photo = {
                "url": photo_url,
                "yaml_location": photo_location(dictionary),
                "omitted": omitted,
            }
            # A photo that can't be loaded is left out so the rest of the CV renders.
            model.cv.photo = None if omitted else pathlib.Path(PHOTO_FILE_NAME)
        result = {
            "content": render_full_template(model, "typst"),
            "errors": None,
            "photo": photo,
        }

result
`;let m;const We=`
from rendercv.schema.rendercv_model_builder import build_rendercv_dictionary_and_model, BuildRendercvModelArguments
from rendercv.renderer.templater.templater import render_full_template
from rendercv.exception import RenderCVUserValidationError
from dataclasses import asdict
`,Ae="rendercv-2.8-pyodide-0.29.3-v1",He="pyodide-pkg-cache",I="packages";function Ie(){return new Promise((e,t)=>{const r=indexedDB.open(He,1);r.onupgradeneeded=o=>{const n=o.target.result;n.objectStoreNames.contains(I)||n.createObjectStore(I)},r.onsuccess=o=>e(o.target.result),r.onerror=o=>t(o.target.error)})}function H(e,t){return new Promise((r,o)=>{const n=e.transaction(I,"readonly").objectStore(I).get(t);n.onsuccess=()=>r(n.result),n.onerror=()=>o(n.error)})}function j(e,t,r){return new Promise((o,n)=>{const i=e.transaction(I,"readwrite").objectStore(I).put(r,t);i.onsuccess=()=>o(),i.onerror=()=>n(i.error)})}async function je(e){try{const t=await Ie();if(await H(t,"version")!==Ae)return t.close(),!1;const o=await H(t,"tarball");return t.close(),o?(e.globals.set("_cache_bytes",o),await e.runPythonAsync(`
import tarfile, io, sysconfig
sp = sysconfig.get_path('purelib')
with tarfile.open(fileobj=io.BytesIO(bytes(_cache_bytes.to_py())), mode='r') as tar:
    tar.extractall(sp)
del _cache_bytes
`),!0):!1}catch(t){return console.warn("[pyodide] package cache restore failed:",t),!1}}async function $e(e,t){e.globals.set("_new_entries",e.toPy(t)),await e.runPythonAsync(`
import tarfile, io, os, sysconfig
sp = sysconfig.get_path('purelib')
buf = io.BytesIO()
with tarfile.open(fileobj=buf, mode='w') as tar:  # uncompressed: fast write/read
    for name in _new_entries:
        path = f'{sp}/{name}'
        if os.path.exists(path):
            tar.add(path, arcname=name)
del _new_entries
_tarball_bytes = buf.getvalue()
`);const r=e.globals.get("_tarball_bytes").toJs();return e.globals.delete("_tarball_bytes"),r}async function Ve(e){try{const t=await Ie();await j(t,"tarball",e),await j(t,"version",Ae),t.close()}catch(t){console.warn("[pyodide] package cache save failed:",t)}}async function ze(){if(m=await Se({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.29.3/full/"}),!await je(m)){await m.loadPackage("micropip");const t=m.pyimport("micropip"),r=new Set(m.runPython("import os, sysconfig; list(os.listdir(sysconfig.get_path('purelib')))").toJs());await t.install(["email-validator",`${self.location.origin}/rendercv-2.8-py3-none-any.whl`,"phonenumbers","markdown","pydantic-extra-types","ruamel-yaml"]);const n=[...new Set(m.runPython("import os, sysconfig; list(os.listdir(sysconfig.get_path('purelib')))").toJs())].filter(s=>!r.has(s)),i=await $e(m,n);Ve(i)}await m.runPythonAsync(We)}self.onmessage=async e=>{const{id:t,type:r,payload:o}=e.data;try{switch(r){case"INIT":await ze(),self.postMessage({id:t,type:"INIT_SUCCESS"});break;case"RENDER":{if(!m)throw new Error("Pyodide not initialized — RENDER received before INIT completed");const n=o;for(const i of["cv","design","locale","settings"])m.globals.set(`yaml_input_${i}`,n[i]);m.globals.set("unavailable_photo_urls",m.toPy(n.unavailablePhotoUrls??[])),self.postMessage({id:t,type:"RENDER_SUCCESS",payload:(await m.runPythonAsync(Be)).toJs()});break}}}catch(n){self.postMessage({id:t,type:"ERROR",payload:n instanceof Error?{message:n.message,name:n.name,stack:n.stack}:{message:String(n),name:"Error",stack:void 0}})}}});export default qe();
