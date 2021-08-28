/*
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

    LXL_Player.prototype.sendModalFormPromise = async function(...args) {
        let {returnValue, promise} = 
            promiseify(LXL_Player.prototype.sendModalForm, undefined)
            .call(this, ...args);
        let callbackArgs = await promise;
        return {
            formId: returnValue,
            player: callbackArgs[0],
            id: callbackArgs[1]
        }
    }

    LXL_Player.prototype.sendSimpleFormPromise = async function(...args) {
        let {returnValue, promise} = 
            promiseify(LXL_Player.prototype.sendSimpleForm, undefined)
            .call(this, ...args);
        let callbackArgs = await promise;
        return {
            formId: returnValue,
            player: callbackArgs[0],
            id: callbackArgs[1]
        }
    }

    LXL_Player.prototype.sendCustomFormPromise = async function(...args) {
        let {returnValue, promise} = 
            promiseify(LXL_Player.prototype.sendCustomForm, undefined)
            .call(this, ...args);
        let callbackArgs = await promise;
        return {
            formId: returnValue,
            player: callbackArgs[0],
            data: callbackArgs[1]
        }
    }

    network.httpGetPromise = async function(...args) {
        let {returnValue, promise} = 
            promiseify(network.httpGet, false)
            .call(this, ...args);
        let callbackArgs = await promise;
        return {
            status: callbackArgs[0],
            result: callbackArgs[1]
        }
    }

    network.httpPostPromise = async function(...args) {
        let {returnValue, promise} = 
            promiseify(network.httpPost, false)
            .call(this, ...args);
        let callbackArgs = await promise;
        return {
            status: callbackArgs[0],
            result : callbackArgs[1]
        }
    }

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


    system.cmdPromise = async function(...args) {
        let {returnValue, promise} = 
            systemPromiseify(system.cmd, false)
            .call(this, ...args);
        let callbackArgs = await promise;
        return {
            exitcode: callbackArgs[0],
            output: callbackArgs[1]
        }
    }

    system.newProcessPromise = async function(...args) {
        let {returnValue, promise} = 
            systemPromiseify(system.newProcess, false)
            .call(this, ...args);
        let callbackArgs = await promise;
        return {
            exitcode: callbackArgs[0],
            output: callbackArgs[1]
        }
    }
})();
