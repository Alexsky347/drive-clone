#!/bin/bash

source_dir="../"
target_dir="../package"


rm -rf "$target_dir"


# Create the target directory
mkdir "$target_dir"

# Copy docker-compose.yml and .env to the target directory
cp "$source_dir/docker-compose.yml" "$target_dir/docker-compose.yml"
cp "$source_dir/.env" "$target_dir/.env"
cp -r "$source_dir/etc/" "$target_dir/etc/"