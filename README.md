# llse-promisify

llse-promisify promisify the [LiteLoader](https://www.litebds.com/) API.

[中文文档在这。](./README-zh.md)

## Tutorial

### What is promisify?

`Promise` objects are built-in objects in the JavaScript language that packs asynchronous processing.

"promisify" means to convert APIs that don't use `Promise` to `Promise` style.

### Why do you need promisify?

`Promise` can avoid callback hell and can simplify asynchronous processing by using `async`/`await` syntax.

Suppose there is a requirement where we need to send a custom form, and send another custom form after the player answers. And process the returned data.
However, if the player cancels any of these forms, we stop asking the player.

The sample code to implement this requirement will looks like this.

````JS
function askPlayer(player){
    // some codes build customForm1 and customForm2...
    player.sendForm(customForm1, function (player, formId1, data1) {
        if(data1 === undefined) {
            log(`${player.name} refuse the form1`);
            return;
        }
        player.sendForm(customForm2, function (player, formId2, data2) {
            if(data2 === undefined) {
                log(`${player.name} refuse the form2`);
                return;
            }
            // do something else
        });
    });
}
````

Notice that the indentation of the entire function increases gradually, which is called callback hell.
While the callbacks for the sample code are acceptable, if the requirement is more complex, such as adding error handling or adding logic, the depth will eventually become unacceptable.

We rewrite this function using the `Promise` style, noting the use of the [ECMAScript 2016](https://262.ecma-international.org/7.0/index.html) syntax `async`/`await` .

````JS
async function askPlayer(player){
    // some codes build customForm1 and customForm2...
    let resultObj1 = await player.sendFormPromise(customForm1);
    if(resultObj1.data === undefined) {
        log(`${player.name} refuse the form`);
        return;
    }
    let resultObj2 = await player.sendFormPromise(customForm2);
    if(resultObj2.data === undefined) {
        log(`${player.name} refuse the form2`);
        return;
    }
    // do something else
}
````
The `Promise` style avoids callback hell and makes code more sequential. `async`/`await` makes the code more concise.

## API Reference

> The following document is adapted and translated from the official document of LiteXLoader

## LiteXLoader-GUI form interface document

> This API allows you to create, modify or influence the **GUI interface** in the game

### 📊 Form related API

For a specific player object `pl`, the following form interfaces are available

#### Send a modal form to the player

The modal form contains a title, a text display box, and two buttons

`pl.sendModalFormPromise(title,content,button1,button2)`

- Parameters:
  - title: `String`
    Form title
  - content: `String`
    Form content
  - button1: `String`
    String of button 1 text
  - button2: `String`
    String of button 2 text
- Return value: Promise
- Return value type: `Promise<{formId, player, id}>`
  - If the return value is rejected, it means sending failed
  - formId: `Integer`
    Form ID sent
  - player: `Player`
    The player object that interacts with the form
  - id: `Integer`
    The number of the form button that the player clicked
    If the id is `Null`, it means the player canceled the form

<br>

#### Send a normal form to the player

The normal form contains a title, a text display box and several buttons, and the icons displayed on the buttons can be set
Because the content of the button is relatively complex, it is recommended to use the form builder API to better accomplish this task.

`pl.sendSimpleFormPromise(title,content,buttons,images)`

- Parameters:
  - title: `String`
    Form title
  - content: `String`
    Form content
  - buttons: `Array<String,String,...>`
    String array of each button text
  - images: `Array<String,String,...>`
    Image path corresponding to each button
- Return value: Promise
- Return value type: `Promise<{formId, player, id}>`
  - If the return value is rejected, it means the sending failed
  - formId: `Integer`
    Form ID sent
  - player: `Player`
    The player object that interacts with the form
  - id: `Integer`
    The number of the form button that the player clicked
    If the id is `Null`, it means the player canceled the form

<br>

The image path parameter `images` uses the texture pack path or URL to identify the icon corresponding to the button.
For each button on the form, set the corresponding icon as follows

1. If you use the texture package path, the image path should be like `textures/items/apple`
2. If you use the URL path, then put the complete URL here, like `https://www.baidu.com/img/flexible/logo/pc/result.png`
3. If you don’t need to display a picture for this button, set the corresponding picture path to an empty string.

<br>

#### Send custom forms to players (Json format)

The custom form can contain a wealth of custom controls.
As the related Json definition format is relatively complicated, it is recommended to use the form builder API to better accomplish this task.

`pl.sendCustomFormPromise(json)`

- Parameters:
  - json: `String`
    Custom form json string
- Return value: Promise
- Return value type: `Promise<{formId, player, data}>`
  - If the return value is rejected, it means the sending failed
  - formId: `Integer`
    Form ID sent
  - player: `Player`
    The player object that interacts with the form
  - id: `Integer`
    The number of the form button that the player clicked
    If the id is `Null`, it means the player canceled the form
  - data: `Array<...>`
    The returned form content array
    In the array, the first item must be `Null`, starting from the second item, the contents of each control are stored in the order of the controls on the form
    If data is `Null`, it means the player canceled the form

<br>

#### Send the normal form built by the form builder

After building a normal form with the form builder, you can send the configured form object to the player and listen for player interaction messages
The form object can be sent repeatedly, and each time it is sent, a different form ID will be returned, and the callback function will be called when the player interacts, without conflict.

For a player object `pl`, use the function:

`pl.sendForm(fm)`

- Parameters:
  - fm : `SimpleForm`
    The configured form object
- Return value: Promise
- Return value type: `Promise<{formId, player, id}>`
  - If the return value is rejected, it means the sending failed
  - formId : `Integer`
    Form ID sent
  - player : `Player`
    The player object that interacts with the form
  - id : `Integer`
    The serial number of the form button that the player clicked, starting from 0
    If the id is `Null`, the player cancels the form

<br>

#### Sending custom forms built by the form builder

After you are ready to build a custom form with the form builder, you can send the configured form object to the player and listen for player interaction messages
The form object can be sent repeatedly, and each time it is sent, a different form ID will be returned, and the callback function will be called when the player interacts, without conflict.

For a player object `pl`, use the function:

`pl.sendForm(fm)`

- Parameters:
  - fm : `CustomForm`
    Configured custom form object
- Return value: Promise
- Return value type: `Promise<{formId, player, data}>`
  - If the return value is rejected, it means the sending failed
  - formId : `Integer`
    Form ID sent
  - player : `Player`
    The player object that interacts with the form
  - data : `Array<...>`
    The returned form content array
    The content of each control is stored in the array in the order of the controls on the form
    If data is `Null`, the player cancels the form


<br>

### 🌏 Web interface API

The following APIs provide a basic network interface for scripts.
If you have more complex requirements, you can use the network library of the respective language platform to complete the task

#### Send an asynchronous HTTP(s) Get request

`network.httpGetPromise(url)`

- Parameters:
  - url: `String`
    The target address of the request (including the parameters attached to the Get request)
- Return value: Promise
- Return value type: `Promise<{status, result}>`
  - If the return value is rejected, it means the sending failed
  - status: `Integer`
    The returned HTTP(s) response code, such as 200 means the request is successful
  - result: `String`
    Specific data returned

If the request fails, the status value will be -1

<br>

#### Send an asynchronous HTTP(s) Post request

`network.httpPostPromise(url,data,type)`

- Parameters:
  - url: `String`
    Target address of the request
  - data: `String`
    Data sent
  - type: `String`
    Post data type sent, like `text/plain` `application/x-www-form-urlencoded` etc.
- Return value: Promise
- Return value type: `Promise<{status, result}>`
  - If the return value is rejected, it means the sending failed
  - status: `Integer`
    The returned HTTP(s) response code, such as 200 means the request is successful
  - result: `String`
    Specific data returned

If the request fails, the status value will be -1

<br>

### 📋 File Object API

In LLSE, "file objects" are used to manipulate and read and write to a specific file.

> The asynchronous interfaces of the file object API have not been promiseified yet, and llse-promisify will include these interfaces in the future.

### 📡 System call API

The following APIs provide interfaces for executing some system calls

#### Invoke the shell to execute the specified system command

`system.cmdPromise(cmd[,timeLimit])`

- Parameters:
  - cmd: `String`
    System commands executed
  - timeLimit: `Integer`
    (Optional parameter) The maximum time limit for the command to run, in milliseconds
    The default is `-1`, which means there is no limit to the running time
- Return value: Promise
- Return value type: `Promise<{exitcode, output}>`
  - If the return value is rejected, it means the sending failed
  - exitcode: `Integer`
    shell exit code
  - output: `String`
    Contents of standard output and standard error output

NOTICE! The command executed here is not the command of the MC command system
This function works asynchronously. It does not wait for the system to execute the command before returning. Instead, the engine automatically calls the given callback function to return the result.

<br>

#### Run the program at the specified location

`system.newProcessPromise(process[,timeLimit])`

- Parameters:
  - process: `String`
    The path of the running program (with command line parameters)
  - timeLimit: `Integer`
    (Optional parameter) The longest time limit for the program process to run, in milliseconds
    The default is `-1`, which means there is no limit to the running time
- Return value: Promise
- Return value type: `Promise<{exitcode, output}>`
  - If the return value is rejected, it means the sending failed
  - exitcode: `Integer`
    Program process exit code
  - output: `String`
    The contents of the standard output and standard error output of the program

This function works asynchronously. It does not wait for the system to execute the command before returning. Instead, the engine automatically calls the given callback function to return the result.

<br>

## About anthor of llse-promisify

The author of llse-promisify is [callstackexceed](https://github.com/callstackexceed), who is also a developer of the MC addon [**NormaConstructor**](https://docs.norma.observer/en/).

**NormaConstructor** is a open source fast building addon currently runs on both scripting API and llse.

**NormaConstructor** just has released its beta release, and it really needs developers as well as users.

If you like this llse plugin, please also have a look on **NormaConstructor**.
