export AWS_PROFILE=lk
npm run build
aws s3 sync dist s3://lightning-server-admin
