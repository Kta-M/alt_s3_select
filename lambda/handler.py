import os
import subprocess
import boto3

s3 = boto3.client('s3')

def generate_csv_file_path(key):
    return f"/tmp/{key}"

def generate_md5_file_path(key):
    return f"/tmp/{key}.md5"

def download_csv(bucket, key):
    # S3ファイルのMD5を取得
    response = s3.head_object(Bucket=bucket, Key=key)
    s3_md5 = response['ETag'].replace('"', '')

    # キャッシュしているファイルのMD5
    md5_file_path = generate_md5_file_path(key)

    if os.path.exists(md5_file_path):
        # キャッシュしているファイルのMD5を取得
        with open(md5_file_path, 'r') as f:
            cached_md5 = f.read()

        # 比較して合致すればキャッシュを利用するのでダウンロードせずに終了
        if cached_md5 == s3_md5:
            return

    # S3からファイルをダウンロード
    csv_file_path = generate_csv_file_path(key)
    s3.download_file(bucket, key, csv_file_path)

    # MD5を保存
    with open(md5_file_path, 'w') as f:
        f.write(s3_md5)

def handler(event, context):
    bucket = event['bucket']
    key = event['key']

    # CSVをダウンロード
    download_csv(bucket, key)

    # qを使ってSQLを実行
    sql_query = event['sql'].replace('#', generate_csv_file_path(key))
    result = subprocess.check_output(
        ['python', '/opt/bin/q.py', '-d', ',', '-H', '-O', sql_query],
        text=True
    )

    return result