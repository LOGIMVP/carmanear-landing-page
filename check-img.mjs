import sharp from 'sharp';

async function checkMetadata() {
  const metadata = await sharp('public/vintage-room.jpg').metadata();
  console.log(metadata);
}

checkMetadata();
