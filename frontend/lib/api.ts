const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8800"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem("admin-token")
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    } else {
      console.warn("Authentication token not found")
    }
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, "Network error occurred")
  }
}

// Categories API
export const categoriesApi = {
  getAll: () => apiRequest<any[]>("/categories"),
  getById: (id: string) => apiRequest<any>(`/categories/${id}`),
  create: (data: any) =>
    apiRequest<any>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/categories/${id}`, {
      method: "DELETE",
    }),
}

// Products API
export const productsApi = {
  getAll: () => apiRequest<any[]>("/products"),
  getById: (id: string) => apiRequest<any>(`/products/${id}`),
  getByCategory: (categoryId: string) => apiRequest<any[]>(`/products/category/${categoryId}`),
  create: (data: any) =>
    apiRequest<any>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/products/${id}`, {
      method: "DELETE",
    }),
}

// Orders API
export const ordersApi = {
  getAll: () => apiRequest<any[]>("/orders"),
  getById: (id: string) => apiRequest<any>(`/orders/${id}`),
  create: (data: any) =>
    apiRequest<any>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    apiRequest<any>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/orders/${id}`, {
      method: "DELETE",
    }),
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData: any) =>
    apiRequest<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  getProfile: () => apiRequest<any>("/auth/profile"),
}

// Settings API
export const settingsApi = {
  get: () => apiRequest<any>("/settings"),
  update: (data: any) =>
    apiRequest<any>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// Upload API
export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append("image", file)

    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem("token") || '';
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new ApiError(response.status, "Upload failed")
    }

    return response.json()
  },
}

export { ApiError }
