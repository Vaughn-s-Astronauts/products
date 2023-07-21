#!/usr/bin/bash

nohup node ./etl.js photos > ./etl-photos.log &
nohup node ./etl.js product > ./etl-product.log &
nohup node ./etl.js related > ./etl-related.log &
nohup node ./etl.js skus > ./etl-skus.log &
nohup node ./etl.js styles > ./etl-styles.log &