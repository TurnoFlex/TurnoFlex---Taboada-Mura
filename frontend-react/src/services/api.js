const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Credenciales inválidas.");
    return data;
  },

  register: async (name, email, password, role = "CLIENTE") => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al registrarse.");
    return data;
  },

  getMe: async (token) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Sesión inválida");
    return res.json();
  },

  // Services
  getServices: async (token) => {
    const res = await fetch(`${API_URL}/services`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Error al obtener servicios");
    return res.json();
  },

  createService: async (token, serviceData) => {
    const res = await fetch(`${API_URL}/services`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(serviceData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear servicio");
    return data;
  },

  // Appointments
  getMyAppointments: async (token) => {
    const res = await fetch(`${API_URL}/appointments/my-appointments`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Error al obtener turnos");
    return res.json();
  },

  getAllAppointments: async (token) => {
    const res = await fetch(`${API_URL}/appointments`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error("Error al obtener agenda");
    return res.json();
  },

  createAppointment: async (token, appointmentData) => {
    const res = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: getHeaders(token),
      body: JSON.stringify(appointmentData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo reservar el turno");
    return data;
  },

  updateAppointmentStatus: async (token, id, status) => {
    const res = await fetch(`${API_URL}/appointments/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(token),
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al actualizar estado");
    return data;
  },
};
