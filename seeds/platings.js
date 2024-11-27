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
      image_url: 'http://localhost:8080/images/ex1.png',
      local_image_path: '/ex1.png',
    },
    {
      ingredients: 'Salmon, Potatoes, Dill, Lemon',
      garnishes: 'Parsley, Lemon wedge',
      sauces: 'Dill sauce',
      plate_style: 'White round plate',
      plating_style: 'Rustic',
      image_url: 'http://localhost:8080/images/ex2.png',
      local_image_path: '/ex2.png',
    },
    {
      ingredients: 'Beef, Broccoli, Jasmine Rice',
      garnishes: 'Chives',
      sauces: 'Peppercorn Sauce',
      plate_style: 'Square Plate',
      plating_style: 'Minimalist',
      image_url: 'http://localhost:8080/images/ex3.png',
      local_image_path: '/ex3.png',
    },
    {
      ingredients: 'Macaroni, Tomatoes, Basil',
      garnishes: 'Basil',
      sauces: 'Tomato meat sauce',
      plate_style: 'Round beige',
      plating_style: 'Simple',
      image_url: 'http://localhost:8080/images/6e8aa92f-6fd5-4e81-85f9-49a75190d45f.jpg',
      local_image_path: '/6e8aa92f-6fd5-4e81-85f9-49a75190d45f.jpg',
    },
    {
      ingredients: 'Tomahawk steak, mashed potatoes, bean and lentil salad',
      garnishes: 'parsley',
      sauces: 'peppercorn sauce',
      plate_style: 'white round',
      plating_style: 'Modern',
      image_url: 'http://localhost:8080/images/288a176f-1e0a-4472-ae4b-bdcc92d14cc6.jpg',
      local_image_path: '/288a176f-1e0a-4472-ae4b-bdcc92d14cc6.jpg',
    }
  ]);
}