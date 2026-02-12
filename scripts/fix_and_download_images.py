import os
import requests
import time

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
        try:
            # Generate filename
            filename = f"{prop_name.lower().replace(' ', '-').replace('---', '-')}-{i+1}.jpg"
            filepath = os.path.join(save_dir, filename)
            
            # Download image
            print(f"Downloading {url}...")
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.appolonia.com.gh/'
            }
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                # Add to local paths (relative to public)
                local_path = f"/images/properties/real/{filename}"
                local_paths.append(local_path)
                print(f"Saved to {filepath}")
            else:
                print(f"Failed to download {url}: Status {response.status_code}")
                
        except Exception as e:
            print(f"Error downloading {url}: {str(e)}")
            
    # Generate SQL update if we have images
    if local_paths:
        pg_array = "ARRAY['" + "', '".join(local_paths) + "']"
        sql = f"UPDATE properties SET images = {pg_array} WHERE title LIKE '%{prop_name}%';"
        sql_statements.append(sql)

# Write SQL script
sql_content = "\n".join(sql_statements)
with open("scripts/024_update_local_real_images.sql", "w") as f:
    f.write(sql_content)

print("\nDone! SQL script generated at scripts/024_update_local_real_images.sql")
