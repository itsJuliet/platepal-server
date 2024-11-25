import db from '../db/knex.js';
import axios from 'axios';

export const getPlatings = async (req, res) => {
  try {
    console.log("Fetching all platings from the database.");
    const platings = await db('platings').select();
    console.log("Platings retrieved:", platings);

    res.status(200).json({
      success: true,
      platings,
      message: "Platings retrieved successfully. Check the server logs for details.",
    });
  } catch (err) {
    console.error("Error fetching platings:", err);
    res.status(500).json({ error: 'Failed to fetch platings' });
  }
};

export const createPlating = async (req, res) => {
  const { ingredients, garnishes, sauces, plate_style, plating_style } = req.body;

  console.log("Received POST request with body:", req.body);

  if (!ingredients || !garnishes || !sauces || !plate_style || !plating_style) {
    console.error("Validation failed: Missing required fields.");
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    let image_url;

    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Using mock DALL·E image generation.");
      image_url = 'https://mock-image-url.com/example.jpg';
    } else {
      console.log("Calling OpenAI API for image generation.");
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

      console.log("OpenAI API response:", response.data);
      image_url = response.data.data[0].url;
    }

    console.log("Inserting new plating into the database.");
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

    console.log("New plating inserted:", newPlating);

    res.status(201).json({
      success: true,
      message: 'Plating created successfully',
      plating: newPlating,
      log: { ingredients, garnishes, sauces }, 
    });
  } catch (err) {
    console.error("Error creating plating:", err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create plating' });
  }
};