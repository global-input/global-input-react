


projectversion=`grep -A 1 -B 2 '"name": "global-input-react",' package.json | grep '"version":' | sed 's,"version": ",,g' | sed 's-",--g'`
lastdigit="${projectversion##*.}"
maninVersion="${projectversion%.*}"
nextDigit=$((lastdigit+1))
nextVersion="$maninVersion.$nextDigit"



git add .
git commit -m "update"
git push origin
npm version $nextVersion
npm publish



webversion=`grep -A 0 -B 0 '"global-input-react":' ../global-input-web/package.json |  sed 's/"global-input-react": "^//g'  | sed 's/",//g' `
#mobileversion=`grep -A 0 -B 0 '"global-input-react":' ../globalInputMobile/package.json |  sed 's/"global-input-react": "^//g'  | sed 's/",//g' `

echo $nextVersion
echo $webversion
#echo $mobileversion

nextVersion=$(echo "$nextVersion" | sed -e "s/ //g")
webversion=$(echo "$webversion" | sed -e "s/ //g")

oldstring='\"global-input-react\": \"^'$webversion'\"'
newstring='\"global-input-react\": \"^'$nextVersion'\"'


comandtoexecute='sed -i -e "s/'$oldstring'/'$newstring'/g" ../global-input-web/package.json'
eval $comandtoexecute

#comandtoexecute='sed -i -e "s/'$oldstring'/'$newstring'/g" ../globalInputMobile/package.json'
#eval $comandtoexecute

sleep 3

cd ../global-input-web/
yarn install

#cd ../globalInputMobile/
#yarn install
