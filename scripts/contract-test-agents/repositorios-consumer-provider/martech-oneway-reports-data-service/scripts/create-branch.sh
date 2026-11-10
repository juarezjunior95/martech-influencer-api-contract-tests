#!/bin/bash

# Define prefix options
prefixes=("feat" "ref" "fix" "test" "docs" "chore" "conflict")

# Ask user for branch prefix
echo "Choose the branch prefix:"
select prefix in "${prefixes[@]}"; do
  if [[ " ${prefixes[*]} " == *" $prefix "* ]]; then
    break
  else
    echo "Invalid option, try again."
  fi
done

# Ask user for branch description
echo "Enter the branch name:"
read description

# Replace spaces in description with hyphens
description=${description// /-}

# Create the branch name
branch_name="${prefix}/${description}"

# Create the new branch
git checkout -b $branch_name
