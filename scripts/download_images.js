const fs = require('fs');
const path = require('path');
const https = require('https');

// Define the properties and their images
const properties = {
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
};

// Directory to save images
const saveDir = path.join(__dirname, '../public/images/properties/real');
if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
}

const sqlStatements = [];

console.log(`Downloading images to ${saveDir}...`);

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        const request = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.appolonia.com.gh/'
            }
        }, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
};

const processImages = async () => {
    for (const [propName, urls] of Object.entries(properties)) {
        const localPaths = [];
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            try {
                const filename = `${propName.toLowerCase().replace(/ /g, '-').replace(/---/g, '-')}-${i + 1}.jpg`;
                const filepath = path.join(saveDir, filename);

                console.log(`Downloading ${url}...`);
                await downloadImage(url, filepath);
                
                const localPath = `/images/properties/real/${filename}`;
                localPaths.push(localPath);
                console.log(`Saved to ${filepath}`);
            } catch (error) {
                console.error(`Error downloading ${url}: ${error.message}`);
            }
        }

        if (localPaths.length > 0) {
            const pgArray = `ARRAY['${localPaths.join("', '")}']`;
            const sql = `UPDATE properties SET images = ${pgArray} WHERE title LIKE '%${propName}%';`;
            sqlStatements.push(sql);
        }
    }

    const sqlContent = sqlStatements.join('\n');
    fs.writeFileSync(path.join(__dirname, '024_update_local_real_images.sql'), sqlContent);
    console.log('\nDone! SQL script generated at scripts/024_update_local_real_images.sql');
};

processImages();
