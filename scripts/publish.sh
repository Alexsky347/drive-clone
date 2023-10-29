#!/bin/bash

echo 'Starting publish_docker_image script'

# Check if all required parameters are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <image_name> <tag> <repository_address>"
    exit 1
fi

image_name="$1"
tag="$2"
repository_address="$3"

# Tag the Docker image
docker tag "$image_name:$tag" "$repository_address/$image_name:$tag"

# Log in to the container registry
docker login "$repository_address"

# Push the Docker image to the registry
docker push "$repository_address/$image_name:$tag"

# Check the result
if [ $? -eq 0 ]; then
    echo "Image successfully pushed to $repository_address/$image_name:$tag"
else
    echo "Failed to push the image to $repository_address/$image_name:$tag"
fi

echo 'Publish_docker_image script finished'
