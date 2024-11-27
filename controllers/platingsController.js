import db from '../db/knex.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url'; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getPlatings = async (req, res) => {
  try {
    console.log("Fetching all platings from the database.");
    const platings = await db('platings').select();
    console.log("Platings retrieved:", platings);

    res.status(200).json({
      success: true,
      platings: platings.map(plating => ({
        ...plating,
        image_url: plating.image_url,
        local_image_path: plating.local_image_path,
      })),
      message: "Platings retrieved successfully. Check the server logs for details.",
    });
  } catch (err) {
    console.error("Error fetching platings:", err);
    res.status(500).json({ error: 'Failed to fetch platings' });
  }
};

export const getPlatingById = async (req, res) => {
  const { id } = req.params; 

  try {
    const plating = await db('platings').where({ id }).first();

    if (!plating) {
      return res.status(404).json({ error: 'Plating not found' });
    }

    res.status(200).json({
      success: true,
      plating: {
        id: plating.id,
        ingredients: plating.ingredients,
        garnishes: plating.garnishes,
        sauces: plating.sauces,
        plate_style: plating.plate_style,
        plating_style: plating.plating_style,
        image_url: plating.image_url,
        local_image_path: plating.local_image_path,
        created_at: plating.created_at,
      },
    });
  } catch (err) {
    console.error("Error fetching plating by ID:", err.message);
    res.status(500).json({ error: 'Failed to fetch plating' });
  }
};

export const createPlating = async (req, res) => {
  console.log("NODE_ENV is:", process.env.NODE_ENV);

  const { ingredients, garnishes, sauces, plate_style, plating_style } = req.body;

  if (!ingredients || !garnishes || !sauces || !plate_style || !plating_style) {
    console.error("Validation failed: Missing required fields.");
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let image_url;

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      console.log("Using mock DALL·E image generation.");
      image_url = "http://localhost:8080/images/ex2.png";
    } else {
      console.log("Calling OpenAI API for real image generation.");

      const prompt = `A beautifully plated dish with ingredients: ${ingredients}, garnishes: ${garnishes}, sauces: ${sauces}, on a ${plate_style} plate in ${plating_style} style.`;

      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt,
          model: "dall-e-3",
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          timeout: 30000,
        }
      );

      if (response.data?.data?.[0]?.url) {
        image_url = response.data.data[0].url;
      } else {
        throw new Error("No image URL found in OpenAI response");
      }
    }

    console.log("Image URL generated:", image_url);

    const [insertedId] = await db('platings')
      .insert({
        image_url,
        ingredients,
        garnishes,
        sauces,
        plate_style,
        plating_style,
        created_at: db.fn.now(),
      });

    const [newPlating] = await db('platings')
      .where('id', insertedId);

    const local_image_path = `/images/${insertedId}.jpg`; 

    res.status(201).json({
      success: true,
      message: "Plating generated successfully",
      plating: {
        ...newPlating,
        local_image_path, 
      },
    });
  } catch (err) {
    console.error("Error during plating creation:", {
      message: err.message,
      stack: err.stack,
    });

    res.status(500).json({
      error: "Failed to generate plating",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const saveImageToGallery = async (req, res) => {
  const { image_url, ingredients, garnishes, sauces, plate_style, plating_style } = req.body;

  if (!image_url || !ingredients || !garnishes || !sauces || !plate_style || !plating_style) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Attempting to download image from:', image_url);

    const response = await axios.get(image_url, { responseType: 'arraybuffer' });
    console.log('Image downloaded with status:', response.status);

    if (!response.data) {
      throw new Error('No image data received');
    }

    const fileName = `${uuidv4()}.jpg`; 
    const filePath = path.join(__dirname, '..', 'public', 'images', fileName);
    console.log('Saving image to:', filePath);

    fs.writeFileSync(filePath, response.data);
    console.log('Image saved successfully');

    const local_image_path = `/images/${fileName}`;

    const [insertedId] = await db('platings')
      .insert({
        image_url, 
        local_image_path, 
        ingredients,
        garnishes,
        sauces,
        plate_style,
        plating_style,
        created_at: db.fn.now(),
      });

    const [newPlating] = await db('platings')
      .where('id', insertedId);

    return res.status(200).json({
      message: 'Image saved and plating created successfully',
      savedImagePath: local_image_path,
      plating: newPlating,
    });
  } catch (err) {
    console.error('Error saving image:', err.message);
    return res.status(500).json({ error: 'Failed to save image', details: err.message });
  }
};