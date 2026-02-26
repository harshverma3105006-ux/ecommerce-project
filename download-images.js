const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'frontend', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const banners = [
    { path: "banner1.jpg", url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&h=400&fit=crop" },
    { path: "banner2.jpg", url: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1200&h=400&fit=crop" },
    { path: "banner3.jpg", url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1200&h=400&fit=crop" },
    { path: "banner4.jpg", url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200&h=400&fit=crop" }
];

async function downloadBanners() {
    for (const b of banners) {
        try {
            const res = await fetch(b.url);
            const buffer = await res.arrayBuffer();
            fs.writeFileSync(path.join(imagesDir, b.path), Buffer.from(buffer));
            console.log(`Downloaded ${b.path}`);
        } catch (e) {
            console.log(`Failed ${b.path}: ${e.message}`);
        }
    }
}
downloadBanners();
