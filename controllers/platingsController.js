import db from '../db/knex.js';
import axios from 'axios';

export const getPlatings = async (req, res) => {
  try {
    const platings = await db('platings').select();
    console.log(platings);
    res.status(200).json(platings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch platings' });
  }
};

export const createPlating = async (req, res) => {
  const { ingredients, garnishes, sauces, plate_style, plating_style } = req.body;

  if (!ingredients || !garnishes || !sauces || !plate_style || !plating_style) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: `A beautifully plated dish with ingredients: ${ingredients}, garnishes: ${garnishes}, sauces: ${sauces}, on a ${plate_style} in ${plating_style} style.`,
        n: 1,
        size: '1024x1024',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const image_url = response.data.data[0].url;

    const [newPlating] = await db('platings')
      .insert({
        ingredients,
        garnishes,
        sauces,
        plate_style,
        plating_style,
        image_url,
      })
      .returning(['id', 'image_url', 'created_at']);

    res.status(201).json(newPlating);
  } catch (err) {
    console.error('Error creating plating:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create plating' });
  }
};