// lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = {
  auth: {
    verify: async () => {
      try {
        const response = await fetch(`${API_URL}/auth/verify`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Auth verification failed");
        }

        const data = await response.json();
        return {
          authenticated: true,
          user: data.user || data.data,
          ...data,
        };
      } catch (error) {
        console.error("Auth verify error:", error);
        return { authenticated: false, user: null };
      }
    },

    // login: async (credentials) => {
    //   try {
    //     const response = await fetch(`${API_URL}/auth/login`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(credentials),
    //       credentials: 'include',
    //     });

    //     if (!response.ok) {
    //       const error = await response.json();
    //       throw new Error(error.message || 'Login failed');
    //     }

    //     return await response.json();
    //   } catch (error) {
    //     console.error('Login error:', error);
    //     throw error;
    //   }
    // },

    // register: async (userData) => {
    //   try {
    //     const response = await fetch(`${API_URL}/auth/register`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(userData),
    //       credentials: 'include',
    //     });

    //     if (!response.ok) {
    //       const error = await response.json();
    //       throw new Error(error.message || 'Registration failed');
    //     }

    //     return await response.json();
    //   } catch (error) {
    //     console.error('Register error:', error);
    //     throw error;
    //   }
    // },

    logout: async () => {
      try {
        // Use the Next.js API route
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Logout failed');
        }

        return await response.json();
      } catch (error) {
        console.error("Logout error:", error);
        throw error;
      }
    },
  },

  //   cart: {
  //     get: async () => {
  //       try {
  //         const response = await fetch(`${API_URL}/cart`, {
  //           method: 'GET',
  //           credentials: 'include',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         });

  //         if (!response.ok) {
  //           throw new Error('Failed to fetch cart');
  //         }

  //         return await response.json();
  //       } catch (error) {
  //         console.error('Cart fetch error:', error);
  //         throw error;
  //       }
  //     },

  //     add: async (productId, quantity) => {
  //       try {
  //         const response = await fetch(`${API_URL}/cart/add`, {
  //           method: 'POST',
  //           credentials: 'include',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ productId, quantity }),
  //         });

  //         if (!response.ok) {
  //           throw new Error('Failed to add to cart');
  //         }

  //         return await response.json();
  //       } catch (error) {
  //         console.error('Add to cart error:', error);
  //         throw error;
  //       }
  //     },

  //     remove: async (productId) => {
  //       try {
  //         const response = await fetch(`${API_URL}/cart/remove`, {
  //           method: 'DELETE',
  //           credentials: 'include',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ productId }),
  //         });

  //         if (!response.ok) {
  //           throw new Error('Failed to remove from cart');
  //         }

  //         return await response.json();
  //       } catch (error) {
  //         console.error('Remove from cart error:', error);
  //         throw error;
  //       }
  //     },

  //     // update: async (productId, quantity) => {
  //     //   try {
  //     //     const response = await fetch(`${API_URL}/cart/update`, {
  //     //       method: 'PUT',
  //     //       credentials: 'include',
  //     //       headers: {
  //     //         'Content-Type': 'application/json',
  //     //       },
  //     //       body: JSON.stringify({ productId, quantity }),
  //     //     });

  //     //     if (!response.ok) {
  //     //       throw new Error('Failed to update cart');
  //     //     }

  //     //     return await response.json();
  //     //   } catch (error) {
  //     //     console.error('Update cart error:', error);
  //     //     throw error;
  //     //   }
  //     // },
  //   },
};
