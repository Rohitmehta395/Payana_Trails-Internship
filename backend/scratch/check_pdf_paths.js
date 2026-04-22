require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Trail = require(path.join(__dirname, '..', 'models', 'Trail'));

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const trails = await Trail.find({}).select('trailName itineraryPdf');
  const withPdf = trails.filter(t => t.itineraryPdf && t.itineraryPdf.length > 0);
  console.log('Trails with PDF:', withPdf.length);
  withPdf.forEach(t => console.log(' -', t.trailName, '\n   DB path:', t.itineraryPdf));
  await mongoose.disconnect();
}
check().catch(e => console.error(e.message));
