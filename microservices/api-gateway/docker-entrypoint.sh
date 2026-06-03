#!/bin/bash

# The JAR_NAME should be passed as the first argument to the script
JAR_NAME="$1"

echo "Attempting to run JAR: ${JAR_NAME}"

java -jar "$JAR_NAME"