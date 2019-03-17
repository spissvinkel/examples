#!/bin/bash

# Remove previous build
rm -rf ./*.d.ts ./*.js ./*.map ./build/*

# Compile typescript to javascript (configured by tsconfig.json)
tsc

# Bundle compiled javascript and libraries
google-closure-compiler                                             \
  --compilation_level ADVANCED                                      \
  --charset UTF-8                                                   \
  --isolation_mode IIFE                                             \
  --assume_function_wrapper true                                    \
  --dependency_mode PRUNE                                           \
  --process_common_js_modules true                                  \
  --module_resolution NODE                                          \
  --language_in ECMASCRIPT_2015                                     \
  --language_out ECMASCRIPT5_STRICT                                 \
  --env BROWSER                                                     \
  --rewrite_polyfills false                                         \
  --js_output_file ./example-01.js                                  \
  --entry_point build/engine                                        \
  --js ./build/*.js                                                 \
  --js ./node_modules/@spissvinkel/maths/*.js
