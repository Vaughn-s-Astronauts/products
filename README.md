# Atelier Products API

# Setup
1. `npm install`
2. `npm install jest --global`

# Install Docker (Windows)
1. Install gui application here: https://www.docker.com/get-started/
2. When prompted, make sure WSL option is selected (this should be the default)
3. Open Docker Desktop App
4. Select settings (top of window, gear icon)
5. In Resources > WSL Integration, activate the appropriate Linux Distribution (e.g. "Ubuntu 22.04")

# DB Installation
1. `sudo apt install default-jre`
2. `sudo docker pull cassandra:latest`
3. `sudo docker run -p 8080:9042 --name cass_cluster cassandra:latest`

# Enter DB Shell Interface
- `docker exec -it cass_cluster cqlsh`
OR
1. Docker Desktop > Containers tab > > click "cass_cluster" > Terminal tab
2. In container terminal, run `cqlsh`

# ETL Process
ETL-related files can be found in the data directory. To repeat the process:
1. Copy the necessary legacy data files into the data directory:
- features.csv
- photos.csv
- product.csv
- related.csv
- skus.csv
- styles.csv
2. cd into `/data` directory
3. Run `./etl-parallel.sh`
4. This may take awhile. Log files following the naming pattern `etl-[table_name].log` will be created in the `/data` directory. Reference these files for status updates, error messages, and process results.

- Note: the ETL script assumes that the database is available at localhost:8080. If the process is repeated in a different env, this value may need to be changed.