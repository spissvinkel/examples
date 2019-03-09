#!/bin/bash

# Typescript compilation
TSC_EXE="./node_modules/.bin/tsc"

# Google Closure Compiler (bundling)
BUNDLE_JAVA_EXE="java -jar node_modules/google-closure-compiler-java/compiler.jar"
BUNDLE_NODE_EXE="./node_modules/.bin/google-closure-compiler"
BUNDLE_EXE=$BUNDLE_JAVA_EXE

# Remove previous build
rm -rf ./*.d.ts ./*.js ./*.map ./build/*

# Compile typescript to javascript (configured by tsconfig.json)
$TSC_EXE

# Bundle compiled javascript and libraries
$BUNDLE_EXE                                                         \
  --compilation_level ADVANCED                                      \
  --formatting PRETTY_PRINT                                         \
  --charset UTF-8                                                   \
  --isolation_mode IIFE                                             \
  --assume_function_wrapper true                                    \
  --dependency_mode PRUNE                                           \
  --process_common_js_modules true                                  \
  --module_resolution NODE                                          \
  --language_in ECMASCRIPT_2015                                     \
  --language_out ECMASCRIPT5_STRICT                                 \
  --rewrite_polyfills true                                          \
  --env BROWSER                                                     \
  --js_output_file ./index.js                                       \
  --entry_point build/main                                          \
  --js ./build/*.js                                                 \
  --js ./node_modules/@spissvinkel/maths/*.js

#  --formatting PRETTY_PRINT                                         \
