import os
import requests
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Create session with retry strategy
session = requests.Session()
retry = Retry(
    total=5,
    backoff_factor=1,
    status_forcelist=[500, 502, 503, 504]
)
adapter = HTTPAdapter(max_retries=retry)
session.mount('http://', adapter)
session.mount('https://', adapter)

# Define the properties and their images
properties = {
    "Nova Ridge": [
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-1.jpg",
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-2.jpg",
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-3.jpg"
    ],
    "The Oxford - Walton": [
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-1.jpg",
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-2.jpg",
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Street-View.jpg"
    ],
    "The Oxford - Eaton": [
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Eaton-1.jpg",
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Eaton-2.jpg",
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Clubhouse.jpg"
    ],
    "The Oxford - Barton": [
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Barton-1.jpg",
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Barton-2.jpg",
        "https://www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Pool.jpg"
    ]
}

# Directory to save images
save_dir = "public/images/properties/real"
os.makedirs(save_dir, exist_ok=True)

sql_statements = []

print(f"Downloading images to {save_dir}...")

for prop_name, urls in properties.items():
    local_paths = []
    for i, url in enumerate(urls):
        max_attempts = 3
        attempt = 0
        success = False
        
        while attempt < max_attempts and not success:
            try:
                attempt += 1
                # Generate filename
                filename = f"{prop_name.lower().replace(' ', '-').replace('---', '-')}-{i+1}.jpg"
                filepath = os.path.join(save_dir, filename)
                
                # Download image
                print(f"Downloading {url} (attempt {attempt}/{max_attempts})...")
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://www.appolonia.com.gh/',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                    'Connection': 'keep-alive'
                }
                
                response = session.get(url, headers=headers, timeout=30, stream=True)
                
                if response.status_code == 200:
                    with open(filepath, 'wb') as f:
                        for chunk in response.iter_content(chunk_size=8192):
                            if chunk:
                                f.write(chunk)
                    
                    # Add to local paths (relative to public)
                    local_path = f"/images/properties/real/{filename}"
                    local_paths.append(local_path)
                    print(f"✓ Saved to {filepath}")
                    success = True
                else:
                    print(f"✗ Failed: Status {response.status_code}")
                    
            except Exception as e:
                print(f"✗ Error (attempt {attempt}): {str(e)}")
                if attempt < max_attempts:
                    print(f"  Retrying in 3 seconds...")
                    time.sleep(3)
        
        # Wait between downloads to avoid overwhelming the server
        time.sleep(2)
            
    # Generate SQL update if we have images
    if local_paths:
        pg_array = "ARRAY['" + "', '".join(local_paths) + "']"
        sql = f"UPDATE properties SET images = {pg_array} WHERE title LIKE '%{prop_name}%';"
        sql_statements.append(sql)

# Write SQL script
if sql_statements:
    sql_content = "-- Update properties with locally downloaded real images\n\n"
    sql_content += "\n".join(sql_statements)
    sql_content += "\n\n-- Verify the update\nSELECT id, title, images FROM properties ORDER BY id;"
    
    with open("scripts/024_update_local_real_images.sql", "w") as f:
        f.write(sql_content)
    
    print(f"\n✓ Done! SQL script generated at scripts/024_update_local_real_images.sql")
    print(f"  Successfully downloaded {sum(len(p) for p in properties.values())} images")
else:
    print("\n✗ No images were downloaded successfully")
