import db from '../db/knex.js';

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
  const { ingredients, garnishes, sauces, plate_style, plating_style, image_url } = req.body;

  if (!ingredients || !garnishes || !sauces || !plate_style || !plating_style || !image_url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newPlating = await db('platings').insert({
      ingredients,
      garnishes,
      sauces,
      plate_style,
      plating_style,
      image_url,
    }).returning('*'); 

    res.status(201).json({ id: newPlating[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create plating' });
  }
};