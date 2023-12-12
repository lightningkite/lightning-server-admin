export AWS_PROFILE=lk
npm run build
rm -rf dist/static
mkdir dist/static
cp -r dist/ dist2/
cp -r dist2/ dist/static/
aws s3 sync dist s3://lightning-server-admin
