#!/bin/sh
# Builds dist/turbobolton.html (artifact body) and dist/index.html (standalone page you can open locally)
cd "$(dirname "$0")"
python3 - <<'PY'
src = open('src/shell.html').read()
css = open('src/styles.css').read()
js = '\n'.join(open('src/' + f).read() for f in ['data.js', 'graphics.js', 'app.js', 'store.js', 'admin.js', 'docs.js', 'actions.js'])
import base64
js = js.replace('__HERO_IMG__', 'data:image/jpeg;base64,' + base64.b64encode(open('src/hero-m4.jpg', 'rb').read()).decode())
body = src.replace('/*__CSS__*/', css).replace('/*__JS__*/', js)
open('dist/turbobolton.html', 'w').write(body)
head = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
i = body.index('<div id="demobar">')
open('dist/index.html', 'w').write(head + body[:i] + '</head>\n<body>\n' + body[i:] + '\n</body>\n</html>\n')
print('built', len(body), 'bytes')
PY
