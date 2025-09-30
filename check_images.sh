#!/bin/bash

cd /Users/catie/Desktop/AuroraCDC

echo "=== CHECKING FOR MISSING IMAGES ==="
echo

# Function to check if image exists (case insensitive on macOS)
check_image() {
    local img="$1"
    if [ ! -f "images/$img" ]; then
        # Try case insensitive match
        local found=$(find images/ -iname "$img" 2>/dev/null | head -1)
        if [ -z "$found" ]; then
            echo "MISSING: images/$img"
            return 1
        else
            echo "CASE MISMATCH: images/$img (found as $found)"
            return 2
        fi
    fi
    return 0
}

echo "--- Checking images referenced in HTML files ---"
# Check HTML files
find . -name "*.html" -exec grep -o 'src="images/[^"]*"' {} \; | \
sed 's/src="images\///' | sed 's/"//' | sort -u | \
while read img; do
    check_image "$img"
done

echo
echo "--- Checking images referenced in CSS files ---"
# Check CSS files for background-image URLs
find . -name "*.css" -exec grep -o "url(['\"]images/[^'\"]*['\"])" {} \; | \
sed "s/url(['\"]images\///" | sed "s/['\"])//" | sort -u | \
while read img; do
    check_image "$img"
done

# Also check for url() without quotes
find . -name "*.css" -exec grep -o "url(images/[^)]*)" {} \; | \
sed 's/url(images\///' | sed 's/)//' | sort -u | \
while read img; do
    check_image "$img"
done

echo
echo "--- Checking meta tag images ---"
# Check meta tags
grep -o 'content="images/[^"]*"' index.html | \
sed 's/content="images\///' | sed 's/"//' | sort -u | \
while read img; do
    check_image "$img"
done

echo
echo "=== SUMMARY ==="
total_images=$(ls images/ | wc -l)
echo "Total images in folder: $total_images"
echo "Check complete!"