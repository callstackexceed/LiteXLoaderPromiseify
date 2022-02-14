/*
LiteXLoaderPromiseify begin, see <https://github.com/callstackexceed/LiteXLoaderPromiseify>.

Copyright 2021 callstackexceed

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {    
    "use strict";
    function addMethod(obj, methodName, method) {
        Object.defineProperty(obj, methodName, {
            value: method,
            writable: true,
            enumerable: false,
            configurable: true
        });
    }

    function promiseify(func, failReturnValue) {
        return function(...args) {
            let returnValue;
            let promise = new Promise((reslove, reject) => {
                returnValue = func.call(this, ...args, (...callbackArgs) => {
                    reslove(callbackArgs);
                });
                if(returnValue === failReturnValue) {
                    reject(new Error(`Failed when call ${func.name}`));
                }
            });
            return {returnValue, promise};
        }
    }

    let promiseifySendModalForm =
        promiseify(LXL_Player.prototype.sendModalForm, undefined);
    addMethod(LXL_Player.prototype, 'sendModalFormPromise',
        async function sendModalFormPromise(...args) {
            let {returnValue, promise} = promiseifySendModalForm.call(this, ...args);
            let callbackArgs = await promise;
            return {
                formId: returnValue,
                player: callbackArgs[0],
                id: callbackArgs[1]
            };
        }
    );

    let promiseifySendSimpleForm =
        promiseify(LXL_Player.prototype.sendSimpleForm, undefined);
    addMethod(LXL_Player.prototype, 'sendSimpleFormPromise',
        async function sendSimpleFormPromise(...args) {
            let {returnValue, promise} = promiseifySendSimpleForm.call(this, ...args);
            let callbackArgs = await promise;
            return {
                formId: returnValue,
                player: callbackArgs[0],
                id: callbackArgs[1]
            };
        }
    );

    let promiseifySendCustomForm =
        promiseify(LXL_Player.prototype.sendCustomForm, undefined);
    addMethod(LXL_Player.prototype, 'sendCustomFormPromise',
        async function sendCustomFormPromise(...args) {
            let {returnValue, promise} = promiseifySendCustomForm.call(this, ...args);
            let callbackArgs = await promise;
            return {
                formId: returnValue,
                player: callbackArgs[0],
                data: callbackArgs[1]
            };
        }
    );

    let promiseifySendForm =
        promiseify(LXL_Player.prototype.sendForm, undefined);
    addMethod(LXL_Player.prototype, 'sendFormPromise',
            async function sendFormPromise(...args) {
            let {returnValue, promise} = promiseifySendForm.call(this, ...args);
            let callbackArgs = await promise;
            if(typeof callbackArgs[1] === "number") {
                return {
                    formId: returnValue,
                    player: callbackArgs[0],
                    id: callbackArgs[1]
                };
            } else {
                return {
                    formId: returnValue,
                    player: callbackArgs[0],
                    data: callbackArgs[1]
                };
            }
        }
    );

    let promiseifyHttpGet = promiseify(network.httpGet, false);
    addMethod(network, 'httpGetPromise', async function httpGetPromise(...args) {
        let {returnValue, promise} = promiseifyHttpGet.call(this, ...args);
        let callbackArgs = await promise;
        return {
            status: callbackArgs[0],
            result: callbackArgs[1]
        };
    });

    let promiseifyHttpPost = promiseify(network.httpPost, false);
    addMethod(network, 'httpPostPromise', async function httpPostPromise(...args) {
        let {returnValue, promise} = promiseifyHttpPost.call(this, ...args);
        let callbackArgs = await promise;
        return {
            status: callbackArgs[0],
            result : callbackArgs[1]
        };
    });

    function systemPromiseify(func, failReturnValue) {
        return function(arg1, ...rest) {
            let returnValue;
            let promise = new Promise((reslove, reject) => {
                returnValue = func.call(this, arg1, (...callbackArgs) => {
                    reslove(callbackArgs);
                }, ...rest);
                if(returnValue === failReturnValue) {
                    reject(new Error(`Failed when call ${func.name}`));
                }
            });
            return {returnValue, promise};
        }
    }


    let promiseifyCmd = systemPromiseify(system.cmd, false);
    addMethod(system, 'cmdPromise', async function cmdPromise(...args) {
        let {returnValue, promise} = promiseifyCmd.call(this, ...args);
        let callbackArgs = await promise;
        return {
            exitcode: callbackArgs[0],
            output: callbackArgs[1]
        };
    });

    let promiseifyNewProcess = systemPromiseify(system.newProcess, false);
    addMethod(system, 'newProcessPromise', async function newProcessPromise(...args) {
        let {returnValue, promise} = promiseifyNewProcess.call(this, ...args);
        let callbackArgs = await promise;
        return {
            exitcode: callbackArgs[0],
            output: callbackArgs[1]
        };
    });
})();
/*
LiteXLoaderPromiseify end.
*/
