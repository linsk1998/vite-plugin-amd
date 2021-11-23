# vite-plugin-amd

vite app build into AMD moudle

## config

```javascript
import amd from 'vite-plugin-amd';

amd({
    freeze: false,
    interop: false,
    strict: false,
    requirejs: './js/require.js',
    config: {
        paths: {
            jquery: 'https://code.jquery.com/jquery-1.12.4.js'
        }
    }
})
```
