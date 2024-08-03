# alt_s3_select
bare-bones alternative S3 Select by Lambda

## Deploy
```sh
# install q (https://harelba.github.io/q/)
$ cd layers
$ sh install_q.sh
$ cd ../

# deploy
$ cdk bootstrap
$ cdk deploy
```

## Usage
### Lambda Input
```json
{
  "bucket": <bucket name>,
  "key": <csv object key>,
  "sql": <SQL>
}
```

### SQL
- When using the SQL query, you must always specify `#` in the FROM clause. The `#` will automatically be replaced with the path to the specified CSV file.
  - example: `SELECT * FROM # WHERE age > 20 LIMIT 5;`
- The function is designed to work with a single CSV file only. Therefore, operations involving multiple tables are not supported.