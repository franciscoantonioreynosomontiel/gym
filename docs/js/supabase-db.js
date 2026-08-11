// Supabase & Local Database Integration Utility for Wisbe Gym Platform
const SUPABASE_URL = "https://qqjhadwxboeichxtxree.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxamhhZHd4Ym9laWNoeHR4cmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDY4ODAsImV4cCI6MjA5NTQyMjg4MH0.dM1VaV-lDPxoPlOHGAIbgfCSE3RMdURcVubq8tTs6yQ";

let supabaseClient = null;

// Initialize Supabase if library is loaded
if (typeof supabase !== 'undefined') {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Client initialized successfully.");
  } catch (error) {
    console.warn("Could not initialize real Supabase client. Using fallback.", error);
  }
} else {
  console.log("Supabase library not loaded. Using localStorage mockup fallback.");
}

// Default Seed Data
const DEFAULT_SEED_DATA = {
  planes: [
    { id: 1, nombre: "Mensual Básico", costo: 450.00, duracion_dias: 30, descripcion: "Acceso completo al área de pesas y cardio." },
    { id: 2, nombre: "Anual VIP", costo: 4500.00, duracion_dias: 365, descripcion: "Acceso ilimitado, todas las clases y casillero incluido." }
  ],
  clientes: [
    { id: 1, nombre: "Juan Pérez", email: "juan.perez@example.com", telefono: "555-0192", fecha_registro: "2024-01-15", estado: "Activo" },
    { id: 2, nombre: "María López", email: "maria.lopez@example.com", telefono: "555-0143", fecha_registro: "2024-02-10", estado: "Activo" }
  ],
  membresias: [
    { id: 1, cliente_id: 1, plan_id: 1, fecha_inicio: "2024-05-01", fecha_fin: "2024-05-31", estado: "Activa" },
    { id: 2, cliente_id: 2, plan_id: 2, fecha_inicio: "2024-01-01", fecha_fin: "2024-12-31", estado: "Activa" }
  ],
  pagos: [
    { id: 1, cliente_id: 1, monto: 450.00, fecha_pago: "2024-05-01", metodo_pago: "Efectivo", concepto: "Mensualidad Mayo" },
    { id: 2, cliente_id: 2, monto: 4500.00, fecha_pago: "2024-01-01", metodo_pago: "Tarjeta", concepto: "Anualidad Completa" }
  ],
  accesos: [
    { id: 1, cliente_id: 1, fecha_hora: "2024-05-18 08:30:00", tipo_acceso: "Entrada" },
    { id: 2, cliente_id: 2, fecha_hora: "2024-05-18 09:15:00", tipo_acceso: "Entrada" }
  ],
  entrenadores: [
    { id: 1, nombre: "Carlos Gómez", especialidad: "Crossfit & Funcional", telefono: "555-9876", email: "carlos.gomez@wisbe.com" },
    { id: 2, nombre: "Ana Rodríguez", especialidad: "Yoga & Pilates", telefono: "555-5432", email: "ana.rodriguez@wisbe.com" }
  ],
  clases: [
    { id: 1, nombre: "Crossfit Intensivo", entrenador_id: 1, horario: "Lunes a Viernes 07:00 AM", capacidad_maxima: 15 },
    { id: 2, nombre: "Yoga Restaurativo", entrenador_id: 2, horario: "Martes y Jueves 06:00 PM", capacidad_maxima: 20 }
  ],
  reservaciones: [
    { id: 1, clase_id: 1, cliente_id: 1, fecha_reservacion: "2024-05-18", estado: "Confirmada" },
    { id: 2, clase_id: 2, cliente_id: 2, fecha_reservacion: "2024-05-18", estado: "Confirmada" }
  ],
  productos: [
    { id: 1, nombre: "Proteína de Suero 1kg", precio: 850.00, stock: 10, codigo_barras: "7501234567890" },
    { id: 2, nombre: "Bebida Electrolitos", precio: 35.00, stock: 50, codigo_barras: "7509876543210" }
  ],
  inventario: [
    { id: 1, producto_id: 1, cantidad_movimiento: 10, tipo_movimiento: "Entrada", fecha_movimiento: "2024-05-10" },
    { id: 2, producto_id: 2, cantidad_movimiento: 50, tipo_movimiento: "Entrada", fecha_movimiento: "2024-05-12" }
  ],
  gastos: [
    { id: 1, concepto: "Pago de Luz Eléctrica", monto: 1200.00, fecha_gasto: "2024-05-02", categoria: "Servicios" },
    { id: 2, concepto: "Mantenimiento Máquinas", monto: 850.00, fecha_gasto: "2024-05-05", categoria: "Mantenimiento" }
  ],
  empleados: [
    { id: 1, nombre: "Administrador Wisbe", puesto: "Administrador General", telefono: "555-0000", salario: 15000.00, fecha_contratacion: "2024-01-01" }
  ],
  equipamiento: [
    { id: 1, nombre: "Caminadora Proform 500", estado: "Excelente", fecha_adquisicion: "2023-01-15", proximo_mantenimiento: "2024-06-15" },
    { id: 2, nombre: "Kit de Mancuernas 2kg - 20kg", estado: "Bueno", fecha_adquisicion: "2023-02-10", proximo_mantenimiento: "2024-08-10" }
  ]
};

// Seed LocalStorage if empty
function seedLocalStorage() {
  for (const [key, value] of Object.entries(DEFAULT_SEED_DATA)) {
    const storageKey = `wisbe_local_${key}`;
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }
}
seedLocalStorage();

// Security / Admin authentication check
function checkAdminAccess() {
  const isAdmin = localStorage.getItem("wisbe_admin_logged_in") === "true";
  const filename = window.location.pathname.split("/").pop();
  if (!isAdmin && filename.startsWith("admin")) {
    window.location.href = "login.html";
  }
}

// Database CRUD wrapper functions (real Supabase with localStorage backup)
const DB = {
  async get(tableName) {
    const supabaseTable = `wisbe_${tableName}`;
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from(supabaseTable).select('*');
        if (!error && data && data.length > 0) return data;
        console.warn(`Supabase get error or empty on ${supabaseTable}, using local storage:`, error);
      } catch (err) {
        console.warn(`Supabase connection failed for get ${supabaseTable}:`, err);
      }
    }
    const localData = localStorage.getItem(`wisbe_local_${tableName}`);
    return localData ? JSON.parse(localData) : [];
  },

  async insert(tableName, rowData) {
    const supabaseTable = `wisbe_${tableName}`;
    let insertedRow = null;
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from(supabaseTable).insert([rowData]).select();
        if (!error && data && data.length > 0) {
          insertedRow = data[0];
        } else {
          console.warn(`Supabase insert error on ${supabaseTable}:`, error);
        }
      } catch (err) {
        console.warn(`Supabase connection failed for insert ${supabaseTable}:`, err);
      }
    }

    // Always sync with LocalStorage
    const localData = JSON.parse(localStorage.getItem(`wisbe_local_${tableName}`) || "[]");
    const newId = localData.length > 0 ? Math.max(...localData.map(r => r.id || 0)) + 1 : 1;
    const newRow = insertedRow || { id: newId, ...rowData };
    localData.push(newRow);
    localStorage.setItem(`wisbe_local_${tableName}`, JSON.stringify(localData));
    return newRow;
  },

  async update(tableName, id, rowData) {
    const supabaseTable = `wisbe_${tableName}`;
    let updatedRow = null;
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from(supabaseTable).update(rowData).eq('id', id).select();
        if (!error && data && data.length > 0) {
          updatedRow = data[0];
        } else {
          console.warn(`Supabase update error on ${supabaseTable}:`, error);
        }
      } catch (err) {
        console.warn(`Supabase connection failed for update ${supabaseTable}:`, err);
      }
    }

    // Always sync with LocalStorage
    const localData = JSON.parse(localStorage.getItem(`wisbe_local_${tableName}`) || "[]");
    const index = localData.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      localData[index] = { ...localData[index], ...rowData, ...(updatedRow || {}) };
      localStorage.setItem(`wisbe_local_${tableName}`, JSON.stringify(localData));
      return localData[index];
    }
    return null;
  },

  async delete(tableName, id) {
    const supabaseTable = `wisbe_${tableName}`;
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.from(supabaseTable).delete().eq('id', id);
        if (error) {
          console.warn(`Supabase delete error on ${supabaseTable}:`, error);
        }
      } catch (err) {
        console.warn(`Supabase connection failed for delete ${supabaseTable}:`, err);
      }
    }

    // Always sync with LocalStorage
    const localData = JSON.parse(localStorage.getItem(`wisbe_local_${tableName}`) || "[]");
    const filtered = localData.filter(r => r.id !== parseInt(id));
    localStorage.setItem(`wisbe_local_${tableName}`, JSON.stringify(filtered));
    return true;
  }
};

// Check access on load
document.addEventListener("DOMContentLoaded", () => {
  checkAdminAccess();
});
