serverless deploy --function push --region us-east-1
serverless deploy --function push --region eu-central-1
serverless deploy --function push --region us-west-2

If adding a new region for the first time:
serverless deploy --region NEW_REGION
serverless deploy --function push --region NEW_REGION