#!/bin/bash

DESTINATION_FILE_NAME="../dist/Selex.js"
DESTINATION_MINIFIED_FILE_NAME="../dist/Selex.min.js"
DESTINATION_MINIFIED_COMPRESSED_FILE_NAME="../dist/Selex.min.js.gz"
WRAPPER_FILE_NAME="Selex.js"
TEMP_FILE="temp"
BUILD_DIR="src/selex"

merge() {
	cd "src/selex"
	cwd=$(pwd)
	> "$DESTINATION_FILE_NAME"
	find ${cwd} -name '*.js' | while read F; do
	    if [ "${F##*/}" == "$WRAPPER_FILE_NAME" ];
	    then
	    	sed '$ d' $F > $TEMP_FILE
	    	cat $TEMP_FILE >> $DESTINATION_FILE_NAME
	    	rm $TEMP_FILE
	    else
	    	cat "$F" >> $DESTINATION_FILE_NAME
	    fi
	done
	lastLine=$(tac $WRAPPER_FILE_NAME |egrep -m 1 .)
	echo "$lastLine" >> "$DESTINATION_FILE_NAME"
}

merge;