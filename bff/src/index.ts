import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const port = 3000;


const templateBuilder = (param:string = '') => {
  const VIDEO_URL = process.env.VIDEO_URL || '';
  const DRAWER_URL = process.env.DRAWER_URL || '';
  const VIDEO_URL_WITH_PARAM = `${VIDEO_URL}${param}`;
  const template = fs.readFileSync(path.join(__dirname, '/templates/index.html'), 'utf8');
  
  const finalTemplate = template.replace(/{{VIDEO_URL}}/g, VIDEO_URL_WITH_PARAM).replace(/{{DRAWER_URL}}/g, DRAWER_URL);
  return finalTemplate;
}


app.get('/', (req, res) => {
  res.send(templateBuilder());
});

app.get('/busca', (req, res) => {
  res.send(templateBuilder('?mode=search'));
});

app.get('/favoritos', (req, res) => {
  res.send(templateBuilder('?mode=favorites'));
});

app.get('/api/videos', async (req, res) => {
  const q = String(req.query.q || '').replace(/\-/g, '_');
  const id = req.query.id;
  const API_KEY = process.env.YOUTUBE_API_KEY || '';
  const BASE_URL = process.env.YOUTUBE_API_URL || '';
  const part = 'snippet';
  const type = 'video';
  const maxResults = 20;

  const params = {
    part,
    q,
    // id,
    key:API_KEY,
    type,
    maxResults
  }

  console.log(params)

  try {
    const response = await axios.get(BASE_URL, {
      params,
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'http://localhost:3000',
      }

    });


    const videos = response.data.items;
    res.send(videos);
  } catch (error) {
    res.send(error);
  }

})

app.listen(port, () => {
  console.log(`BFF is running at http://localhost:${port}`);
});
