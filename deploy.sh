#! /bin/sh
######################################
# Description
######################################
# Program:
#   Pulls latest state from git repository
#   and deploys them to the webserver.
#
# Arguments:
#   -b - Branch name for git
#   -r - Remote name for git
#   -d - Path to destination where code is
#	  deployed into
#   
######################################

# default arguments
remoteName=origin
branchName=master
deployPath=/var/www/html/

# read arguments
usage() {
  echo "Usage: $0 [-b <branch_name>] [-r <remote_name>] [-p /path/to/destination]" 1>&2
  exit 1
}

while getopts ":b:r:d:" o
do
  case "${o}" in
    b)
      branchName=${OPTARG}
      ;;
    r)
      remoteName=${OPTARG}
      ;;
    d)
      deployPath=${OPTARG}
      ;;
    *)
      usage
      ;;
  esac
done

# pull changes from git
git pull $remoteName $branchName

# build webapp
ember build -prod

# deploy website
cp -ar dist/* /var/www/html/mashup

