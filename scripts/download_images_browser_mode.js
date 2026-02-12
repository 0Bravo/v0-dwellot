const fs = require('fs');
const path = require('path');
const https = require('https');

// Real browser headers to bypass protection
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Referer': 'https://www.appolonia.com.gh/',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Fetch-Dest': 'image',
  'Sec-Fetch-Mode': 'no-cors',
  'Sec-Fetch-Site': 'cross-site'
};

const IMAGES = [
  {
    filename: 'nova-ridge-plot.jpg',
    url: 'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-1.jpg'
  },
  {
    filename: 'nova-ridge-aerial.jpg',
    url: 'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Nova-Ridge-2.jpg'
  },
  {
    filename: 'oxford-walton.jpg',
    url: 'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Walton-1.jpg'
  },
  {
    filename: 'oxford-eaton.jpg',
    url: 'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Eaton-1.jpg'
  },
  {
    filename: 'oxford-barton.jpg',
    url: 'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Barton-1.jpg'
  },
  {
    filename: 'oxford-pool.jpg',
    url: 'https://www.appolonia.com.gh/wp-content/uploads/2019/06/Oxford-Pool.jpg'
  }
];

const DOWNLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'properties');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOAD_DIR, filename);
    const file = fs.createWriteStream(filePath);

    const options = {
      headers: HEADERS,
      timeout: 10000
    };

    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
};

async function main() {
  console.log('Starting download with browser headers...');
  
  for (const img of IMAGES) {
    try {
      await downloadImage(img.url, img.filename);
      // Wait 1 second between downloads to be polite
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.error(`❌ Error downloading ${img.filename}:`, error.message);
    }
  }

  console.log('\nCreating SQL update script...');
  
  const sqlContent = `
-- Update properties to use the locally downloaded images
UPDATE properties 
SET images = ARRAY['/images/properties/nova-ridge-plot.jpg', '/images/properties/nova-ridge-aerial.jpg'] 
WHERE title LIKE '%Nova Ridge%';

UPDATE properties 
SET images = ARRAY['/images/properties/oxford-walton.jpg', '/images/properties/oxford-pool.jpg'] 
WHERE title LIKE '%Walton%';

UPDATE properties 
SET images = ARRAY['/images/properties/oxford-eaton.jpg', '/images/properties/oxford-pool.jpg'] 
WHERE title LIKE '%Eaton%';

UPDATE properties 
SET images = ARRAY['/images/properties/oxford-barton.jpg', '/images/properties/oxford-pool.jpg'] 
WHERE title LIKE '%Barton%';
`;

  fs.writeFileSync(path.join(process.cwd(), 'scripts', '025_update_browser_downloaded_images.sql'), sqlContent);
  console.log('✅ Created SQL script: scripts/025_update_browser_downloaded_images.sql');
}

main();
