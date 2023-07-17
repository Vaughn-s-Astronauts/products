# products

# Setup
1. npm install
2. npm install jest --global

# Install Docker (Windows)
1. Install gui application here: https://www.docker.com/get-started/
2. When prompted, make sure WSL option is selected (this should be the default)
3. Open Docker Desktop App
4. Select settings (top of window, gear icon)
5. In Resources > WSL Integration, activate the appropriate Linux Distribution (e.g. "Ubuntu 22.04")

# DB Installation
1. sudo apt install default-jre
2. sudo docker pull cassandra:latest
3. sudo docker run -p 8080:9042 --name cass_cluster cassandra:latest

- NOTE: Exiting the term which is running the cluster will stop the VM
- NOTE: Even though the VM has stopped, it still blocks from using docker run

Fix:

- GUI: Docker Desktop > Images tab > Actions column > Play button
- CLI: ???

# Enter DB Shell Interface
- docker exec -it cass_cluster cqlsh
OR
1. Docker Desktop > Containers tab > > click "cass_cluster" > Terminal tab
2. In container terminal, run cqlsh

# ETL Process
ETL-related files can be found in the data directory. To repeat the process:
1. Copy the necessary legacy data files into the data directory:
- features.csv
- photos.csv
- product.csv
- related.csv
- skus.csv
- styles.csv
2. Run node ./data/etl.js
Note: the ETL script assumes that the database is available at localhost:8080. If the process is repeated in a different env, this value may need to be changed.