# @balena/es-version

This module allows specifying a target es version for other modules to require, currently supported target versions:
* es3 (default)
* es5
* es2015
* es2016
* es2017
* es2018
* es2019
* es2020
* esnext

To use it first require it before anything else and set the desired version:
```js
// Must be set before the first require of an @balena/es-version module
require('@balena/es-version').set('es5')
```
and then the closest matching version will be used by any module that supports choosing the target version, with the priority being:
1. exact match
2. closest match under the desired version
3. closest match over the desired version
4. error
