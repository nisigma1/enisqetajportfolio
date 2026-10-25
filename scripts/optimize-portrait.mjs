// Encoding-only derivatives of the approved, already-cropped portrait.
// Keep WebP fallbacks, dimensions, composition and original files unchanged.
import sharp from 'sharp';
import {stat} from 'node:fs/promises';
for(const name of ['enis-mobile','enis-tablet','enis-desktop']) {
 const source=`public/images/enis/${name}.webp`;
 const target=`public/images/enis/${name}.avif`;
 await sharp(source).avif({quality:60,effort:6,chromaSubsampling:'4:2:0'}).toFile(target);
 console.log(JSON.stringify({source,target,before:(await stat(source)).size,after:(await stat(target)).size}));
}
