# vite-plugin-amd

vite app build into AMD moudle

## config

```javascript
import amd from 'vite-plugin-amd';

amd({
    requirejs: './js/require.js',
    freeze: false,
    interop: false,
    strict: false
})
```