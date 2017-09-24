npm run prepublish
browserify  -r ./dist/index.js:global-input-react > dist/global-input-react.js
ssh root@globalinput.co.uk 'mkdir global-input-node/nginx/data/websites/globalinput/lib'
scp dist/global-input-react.js root@globalinput.co.uk:global-input-node/nginx/data/websites/globalinput/lib
