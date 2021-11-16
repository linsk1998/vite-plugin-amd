# vite-plugin-amd

vite app build into AMD moudle

## config

```javascript
import amd from 'vite-plugin-amd';

amd({
    freeze: false,
    interop: false,
    strict: false
})
```

## index.html Example

```html
<!DOCTYPE html>
<html lang="zh">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Title</title>
	<script type="text/javascript" src="/cdn/js/require.js"></script>
	<script type="text/javascript">
		require.config({
			// your config
		});
	</script>
</head>

<body>
	<div id="root"></div>
	<script type="module" src="/src/main.tsx"></script>
</body>

</html>
```