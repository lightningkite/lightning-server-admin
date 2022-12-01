export AWS_PROFILE=lk
npm run build
aws s3 sync build s3://lightning-server-admin
