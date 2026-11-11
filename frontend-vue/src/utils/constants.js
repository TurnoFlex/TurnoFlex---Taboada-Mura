export const FALLBACK_SERVICES = [
  // Barbería y Estilo
  {
    id: 1,
    category: 'Barbería',
    name: 'Corte de Pelo Clásico / Fade',
    description: 'Corte personalizado según estilo, degradado a elección, perfilado a navaja y peinado profesional.',
    price: 8000,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80'
  },
  {
    id: 2,
    category: 'Barbería',
    name: 'Combo Barbería VIP (Corte + Barba)',
    description: 'Servicio completo: corte de pelo, arreglo de barba, lavado con masaje capilar y acabado con bálsamo.',
    price: 12000,
    duration: '50 min',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80'
  },
  // Salud y Medicina
  {
    id: 3,
    category: 'Salud',
    name: 'Consulta Médica General',
    description: 'Atención clínica primaria, chequeo preventivo, diagnóstico integral y emisión de recetas o certificados.',
    price: 15000,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80'
  },
  {
    id: 4,
    category: 'Salud',
    name: 'Limpieza Dental Profunda & Odontología',
    description: 'Profilaxis dental profesional, eliminación de sarro, pulido de esmalte y revisión bucal completa.',
    price: 18000,
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&q=80'
  },
  // Estética y Bienestar
  {
    id: 5,
    category: 'Estética',
    name: 'Masaje Descontracturante & Relax',
    description: 'Sesión intensiva corporal para alivio de tensiones musculares, contracturas y relajación profunda.',
    price: 14000,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&q=80'
  },
  {
    id: 6,
    category: 'Estética',
    name: 'Limpieza Facial e Hidratación',
    description: 'Tratamiento facial con exfoliación, extracción de impurezas, mascarilla revitalizante y sérum.',
    price: 11000,
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80'
  },
  // Automotor y Servicios
  {
    id: 7,
    category: 'Servicios',
    name: 'Service de Mantenimiento Vehicular',
    description: 'Revisión general de fluidos, cambio de aceite/filtro, revisión de frenos y diagnóstico por escáner.',
    price: 28000,
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&q=80'
  }
];

// 22 horarios disponibles de turno
export const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM',
  '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'
];

export const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString('es-AR');
};