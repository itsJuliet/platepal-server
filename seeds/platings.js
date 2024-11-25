/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('platings').del();

  await knex('platings').insert([
    {
      ingredients: 'Chicken, Thyme, Garlic',
      garnishes: 'Lemon zest, Microgreens',
      sauces: 'Butter sauce',
      plate_style: 'Stone oval plate',
      plating_style: 'Modern',
      image_url: 'images/ex1.png',
    },
    {
      ingredients: 'Salmon, Potatoes, Dill, Lemon',
      garnishes: 'Parsley, Lemon wedge',
      sauces: 'Dill sauce',
      plate_style: 'White round plate',
      plating_style: 'Rustic',
      image_url: 'images/ex2.png',
    },
    {
      ingredients: 'Beef, Broccoli',
      garnishes: 'Chives',
      sauces: 'Peppercorn Sauce',
      plate_style: 'Square Plate',
      plating_style: 'Minimalist',
      image_url: 'images/ex3.png',
    }
  ]);
}