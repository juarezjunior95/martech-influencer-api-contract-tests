#!/bin/bash

# Configurable number of concurrent requests
NUM_REQUESTS=${1:-5}

echo "🚀 Starting $NUM_REQUESTS concurrent requests to test Databricks connection..."
echo "================================================================"

# Function to make request and log result
make_request() {
    local request_num=$1
    local url="http://localhost:8080/v1/views/portfolio-brand_brand-power-book_power-book_overview?filter%5Bviewtype%5D=global&filter%5Bpage_filter%5D=All&filter%5Bzone%5D=ABI&filter%5Bcountry%5D=ABI&filter%5Bdt_end%5D=2025-06-01"
    
    # Make request and capture response code and time
    response=$(curl -s -w "HTTPSTATUS:%{http_code}|TIME:%{time_total}" "$url" 2>/dev/null)
    
    # Extract HTTP status code and time
    http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    time_total=$(echo "$response" | grep -o "TIME:[0-9.]*" | cut -d: -f2)
    
    # Handle empty values
    if [ -z "$http_code" ]; then
        http_code="000"
    fi
    if [ -z "$time_total" ]; then
        time_total="0.000"
    fi
    
    # Log result
    if [ "$http_code" = "200" ]; then
        echo "✅ Request $request_num: HTTP $http_code - ${time_total}s"
        echo "1" >> "/tmp/test_results_$$"
    else
        echo "❌ Request $request_num: HTTP $http_code - ${time_total}s"
        echo "0" >> "/tmp/test_results_$$"
    fi
}

# Launch all requests in parallel
for i in $(seq 1 $NUM_REQUESTS); do
    make_request $i &
done

# Wait for all background processes to complete
wait

# Count results
success_count=$(grep -c "1" "/tmp/test_results_$$" 2>/dev/null)
failed_count=$(grep -c "0" "/tmp/test_results_$$" 2>/dev/null)

# Clean up temp file
rm -f "/tmp/test_results_$$"

echo "================================================================"
echo "📊 Results Summary:"
echo "   Total requests: $NUM_REQUESTS"
echo "   Successful: $success_count"
echo "   Failed: $failed_count"
echo "   Success rate: $(( (success_count * 100) / NUM_REQUESTS ))%"
echo "================================================================"

if [ "$success_count" -eq "$NUM_REQUESTS" ]; then
    echo "🎉 All requests completed successfully!"
    exit 0
else
    echo "⚠️  Some requests failed. Check the logs above."
    exit 1
fi