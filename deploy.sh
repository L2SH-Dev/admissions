#!/usr/bin/env sh

set -e

yarn build

cd dist

cp index.html 404.html

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:L2SH-Dev/admissions.git main:deploy

cd -

rm -rf dist
