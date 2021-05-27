#!/bin/bash

TARGET=../../../.obsidian/plugins/git-publish-plugin/

for i in main.js styles.css manifest.json; do cp -av $i ${TARGET}; done


