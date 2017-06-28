#!/bin/sh

DIR=$(basename $(pwd))

ACTION=${1:-import}
CONTAINER=${2:-${DIR}_database_1}
NETWORK=${4:-${DIR}_villas}
DATABASE=${3:-VILLAS}

DOCKEROPTS="--interactive --tty --rm --network ${NETWORK} --volume $(pwd):/tmp"

case ${ACTION} in
  import)
    docker run ${DOCKEROPTS} mongo:latest bash -c 'mongorestore --verbose --host '${CONTAINER}' --gzip --archive=/tmp/'${DATABASE}'.archive'
  ;;
  
  save)
    docker run ${DOCKEROPTS} mongo:latest bash -c 'mongodump --verbose --host '${CONTAINER}' --db '${DATABASE}' --gzip --archive=/tmp/'${DATABASE}'.archive'
  ;;
  
  *)
    echo "Usage: $0 (import|save) [MONGODB_CONTAINER [DATABASE [NETWORK]]]"
    ;;
esac

