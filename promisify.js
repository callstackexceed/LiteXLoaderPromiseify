/*
llse-promisify begin, see <https://github.com/callstackexceed/llse-promisify>.

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

    function promisify(func, failReturnValue) {
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

    let promisifySendModalForm =
        promisify(LXL_Player.prototype.sendModalForm, undefined);
    addMethod(LXL_Player.prototype, 'sendModalFormPromise',
        async function sendModalFormPromise(...args) {
            let {returnValue, promise} = promisifySendModalForm.call(this, ...args);
            let callbackArgs = await promise;
            return {
                formId: returnValue,
                player: callbackArgs[0],
                id: callbackArgs[1]
            };
        }
    );

    let promisifySendSimpleForm =
        promisify(LXL_Player.prototype.sendSimpleForm, undefined);
    addMethod(LXL_Player.prototype, 'sendSimpleFormPromise',
        async function sendSimpleFormPromise(...args) {
            let {returnValue, promise} = promisifySendSimpleForm.call(this, ...args);
            let callbackArgs = await promise;
            return {
                formId: returnValue,
                player: callbackArgs[0],
                id: callbackArgs[1]
            };
        }
    );

    let promisifySendCustomForm =
        promisify(LXL_Player.prototype.sendCustomForm, undefined);
    addMethod(LXL_Player.prototype, 'sendCustomFormPromise',
        async function sendCustomFormPromise(...args) {
            let {returnValue, promise} = promisifySendCustomForm.call(this, ...args);
            let callbackArgs = await promise;
            return {
                formId: returnValue,
                player: callbackArgs[0],
                data: callbackArgs[1]
            };
        }
    );

    let promisifySendForm =
        promisify(LXL_Player.prototype.sendForm, undefined);
    addMethod(LXL_Player.prototype, 'sendFormPromise',
            async function sendFormPromise(...args) {
            let {returnValue, promise} = promisifySendForm.call(this, ...args);
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

    let promisifyHttpGet = promisify(network.httpGet, false);
    addMethod(network, 'httpGetPromise', async function httpGetPromise(...args) {
        let {returnValue, promise} = promisifyHttpGet.call(this, ...args);
        let callbackArgs = await promise;
        return {
            status: callbackArgs[0],
            result: callbackArgs[1]
        };
    });

    let promisifyHttpPost = promisify(network.httpPost, false);
    addMethod(network, 'httpPostPromise', async function httpPostPromise(...args) {
        let {returnValue, promise} = promisifyHttpPost.call(this, ...args);
        let callbackArgs = await promise;
        return {
            status: callbackArgs[0],
            result : callbackArgs[1]
        };
    });

    function systemPromisify(func, failReturnValue) {
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


    let promisifyCmd = systemPromisify(system.cmd, false);
    addMethod(system, 'cmdPromise', async function cmdPromise(...args) {
        let {returnValue, promise} = promisifyCmd.call(this, ...args);
        let callbackArgs = await promise;
        return {
            exitcode: callbackArgs[0],
            output: callbackArgs[1]
        };
    });

    let promisifyNewProcess = systemPromisify(system.newProcess, false);
    addMethod(system, 'newProcessPromise', async function newProcessPromise(...args) {
        let {returnValue, promise} = promisifyNewProcess.call(this, ...args);
        let callbackArgs = await promise;
        return {
            exitcode: callbackArgs[0],
            output: callbackArgs[1]
        };
    });
})();
/*
llse-promisify end.
*/
