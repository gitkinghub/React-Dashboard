const axios = require("axios");
const { faker } = require("@faker-js/faker");

const API_URL = "http://localhost:5000";
const NUM_USERS = 50;
const NUM_PRODUCTS = 100;

let users = [];
let products = [];

// Generate Users
async function generateUsers() {
  for (let i = 0; i < NUM_USERS; i++) {
    const user = {
      avatar: faker.image.avatar(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      createdAt: faker.date.past().toISOString(),
      verified: faker.datatype.boolean(),
      productIds: [] // Initialize with empty array to hold product IDs
    };

    try {
      const response = await axios.post(`${API_URL}/users`, user);
      users.push({ ...user, id: response.data.id }); // Store user with ID
      console.log(`Created user: ${user.firstName} ${user.lastName}`);
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
    }
  }
}

// Generate Products
async function generateProducts() {
  for (let i = 0; i < NUM_PRODUCTS; i++) {
    const product = {
      image: faker.image.url(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      category: faker.commerce.department(),
      createdAt: faker.date.past().toISOString(),
      available: faker.datatype.boolean(),
      userIds: [] // Initialize with empty array to hold user IDs
    };

    try {
      const response = await axios.post(`${API_URL}/products`, product);
      products.push({ ...product, id: response.data.id }); // Store product with ID
      console.log(`Created product: ${product.name}`);
    } catch (error) {
      console.error(`Error creating product: ${error.message}`);
    }
  }
}

// Establish Relationships between Users and Products
async function establishRelationships() {
  products.forEach((product) => {
    // Randomly assign a few users to each product
    const numUsers = faker.datatype.number({ min: 1, max: 5 });
    for (let i = 0; i < numUsers; i++) {
      const randomUser =
        users[faker.datatype.number({ min: 0, max: users.length - 1 })];
      product.userIds.push(randomUser.id);
      randomUser.productIds.push(product.id);
    }
  });

  // Update Users and Products with relationships
  await Promise.all(
    products.map(async (product) => {
      try {
        await axios.put(`${API_URL}/products/${product.id}`, product);
        console.log(`Updated product relationships: ${product.name}`);
      } catch (error) {
        console.error(`Error updating product: ${error.message}`);
      }
    })
  );

  await Promise.all(
    users.map(async (user) => {
      try {
        await axios.put(`${API_URL}/users/${user.id}`, user);
        console.log(
          `Updated user relationships: ${user.firstName} ${user.lastName}`
        );
      } catch (error) {
        console.error(`Error updating user: ${error.message}`);
      }
    })
  );
}

async function generateData() {
  console.log("Generating users...");
  await generateUsers();
  console.log("Generating products...");
  await generateProducts();
  console.log("Establishing relationships...");
  await establishRelationships();
  console.log("Data generation complete!");
}

generateData();
