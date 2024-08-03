mkdir q
cd q
curl -LO https://github.com/harelba/q/archive/refs/tags/v3.1.6.tar.gz
tar -xzf v3.1.6.tar.gz
cd q-3.1.6
pip install -r requirements.txt -t .
cd ..
cp -r q-3.1.6/* .
rm -rf q-3.1.6 v3.1.6.tar.gz