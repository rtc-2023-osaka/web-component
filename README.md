# Demo
![demo](./docs/demo/demo.gif)

# Development
```sh
nvm use
npm install
npm run dev
```
Then see section 'Accessing application'

# Building bundle
```sh
nvm use
npm install

# This will create / overwrite the dist folder
npm run build

# You can then serve the root folder
npm install -g http-server

# Serve on HTTP
http-server -p 9000

# Serve on HTTPS
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
http-server -p 9000 -S -C cert.pem

# Reset, reinstall, rebuild and serve on HTTPS
rm -rf node_modules && npm install && npm run build && http-server -p 9000 -S -C cert.pem docs
```


# Accessing application
You can access the application at:
- http://localhost:9000/examples/demo-camera-pose-capture-element.html