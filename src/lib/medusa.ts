
import axios from 'axios';

// Base URL for the MedusaJS backend
const MEDUSA_API_URL = 'http://localhost:9000';

// Create a configured axios instance
const medusaClient = axios.create({
  baseURL: MEDUSA_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Products
export const getProducts = async (params = {}) => {
  try {
    const response = await medusaClient.get('/store/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await medusaClient.get(`/store/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Categories/Collections
export const getCollections = async () => {
  try {
    const response = await medusaClient.get('/store/collections');
    return response.data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

export const getCollectionById = async (id: string) => {
  try {
    const response = await medusaClient.get(`/store/collections/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching collection with id ${id}:`, error);
    throw error;
  }
};

// Cart
export const createCart = async () => {
  try {
    const response = await medusaClient.post('/store/carts');
    return response.data;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};

export const getCart = async (cartId: string) => {
  try {
    const response = await medusaClient.get(`/store/carts/${cartId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cart with id ${cartId}:`, error);
    throw error;
  }
};

export const addToCart = async (cartId: string, variantId: string, quantity: number) => {
  try {
    const response = await medusaClient.post(`/store/carts/${cartId}/line-items`, {
      variant_id: variantId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (cartId: string, lineId: string, quantity: number) => {
  try {
    const response = await medusaClient.post(`/store/carts/${cartId}/line-items/${lineId}`, {
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (cartId: string, lineId: string) => {
  try {
    const response = await medusaClient.delete(`/store/carts/${cartId}/line-items/${lineId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

// Customer
export const createCustomer = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const response = await medusaClient.post('/store/customers', {
      email,
      password,
      first_name: firstName,
      last_name: lastName
    });
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const loginCustomer = async (email: string, password: string) => {
  try {
    const response = await medusaClient.post('/store/auth', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getCustomer = async () => {
  try {
    const response = await medusaClient.get('/store/auth');
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

// Orders
export const getCustomerOrders = async () => {
  try {
    const response = await medusaClient.get('/store/customers/me/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
};

// Checkout
export const updateShippingAddress = async (cartId: string, shippingAddress: any) => {
  try {
    const response = await medusaClient.post(`/store/carts/${cartId}/shipping-address`, {
      address: shippingAddress
    });
    return response.data;
  } catch (error) {
    console.error('Error updating shipping address:', error);
    throw error;
  }
};

export const completeCheckout = async (cartId: string) => {
  try {
    const response = await medusaClient.post(`/store/carts/${cartId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error completing checkout:', error);
    throw error;
  }
};

// Search
export const searchProducts = async (query: string) => {
  try {
    const response = await medusaClient.get('/store/products', { 
      params: {
        q: query
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export default medusaClient;
