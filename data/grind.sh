#!/usr/bin/bash

# Note: This script is not part of the ETL or setup process.
# I just wanted to brush up on Bash, and I wanted to be able
# to open up some of the csv sheets to see what they looked
# like.

source="$1"
dirout="$2"
chunksize=37500
linecount=0
filecount=0
timestart=`date +%s`
ext=$([[ "$source" = *.* ]] && echo ".${source##*.}" || echo '')


if test -f "$source"; then
  echo "Grinding $source"
else
  echo "$source does not exist or is ungrindable"
  exit
fi

if test -e "$dirout"; then
  echo "Not can do, $dirout already exists"
  exit
else
  mkdir $dirout
fi

while IFS= read -r line
do
  if test $((${linecount}%${chunksize})) -eq 0; then
    fileout="chunk-${filecount}$ext"
    filecount=$((${filecount}+1))
    touch "${dirout}/${fileout}"
    echo "Writing to $fileout"
  fi

  linecount=$((${linecount}+1))

  echo "$line" >> "./${dirout}/${fileout}"
done < "$source"

timestop=`date +%s`
elapsed=$((${timestop}-${timestart}))
echo "Grinding completed in ${elapsed} seconds"