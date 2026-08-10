-- SQL Schema for Gym Administration Platform (Wisbe)
-- Database: PostgreSQL (Supabase)

-- 1. PLANES
CREATE TABLE IF NOT EXISTS wisbe_planes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    costo DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    duracion_dias INT NOT NULL DEFAULT 30,
    descripcion TEXT
);

-- 2. CLIENTES
CREATE TABLE IF NOT EXISTS wisbe_clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(20),
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'Activo' -- Activo, Inactivo
);

-- 3. MEMBRESÍAS
CREATE TABLE IF NOT EXISTS wisbe_membresias (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES wisbe_clientes(id) ON DELETE CASCADE,
    plan_id INT REFERENCES wisbe_planes(id) ON DELETE RESTRICT,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'Activa' -- Activa, Vencida, Cancelada
);

-- 4. PAGOS
CREATE TABLE IF NOT EXISTS wisbe_pagos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES wisbe_clientes(id) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(50) NOT NULL, -- Efectivo, Tarjeta, Transferencia
    concepto VARCHAR(150) NOT NULL
);

-- 5. ACCESOS
CREATE TABLE IF NOT EXISTS wisbe_accesos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES wisbe_clientes(id) ON DELETE CASCADE,
    fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tipo_acceso VARCHAR(20) DEFAULT 'Entrada' -- Entrada, Salida
);

-- 6. ENTRENADORES
CREATE TABLE IF NOT EXISTS wisbe_entrenadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    especialidad VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(150)
);

-- 7. CLASES
CREATE TABLE IF NOT EXISTS wisbe_clases (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    entrenador_id INT REFERENCES wisbe_entrenadores(id) ON DELETE SET NULL,
    horario VARCHAR(50) NOT NULL, -- e.g., "Lunes 08:00 AM"
    capacidad_maxima INT NOT NULL DEFAULT 20
);

-- 8. RESERVACIONES
CREATE TABLE IF NOT EXISTS wisbe_reservaciones (
    id SERIAL PRIMARY KEY,
    clase_id INT REFERENCES wisbe_clases(id) ON DELETE CASCADE,
    cliente_id INT REFERENCES wisbe_clientes(id) ON DELETE CASCADE,
    fecha_reservacion DATE DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'Confirmada' -- Confirmada, Cancelada
);

-- 9. PRODUCTOS
CREATE TABLE IF NOT EXISTS wisbe_productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    codigo_barras VARCHAR(50)
);

-- 10. INVENTARIO (Movimientos)
CREATE TABLE IF NOT EXISTS wisbe_inventario (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES wisbe_productos(id) ON DELETE CASCADE,
    cantidad_movimiento INT NOT NULL,
    tipo_movimiento VARCHAR(20) NOT NULL, -- Entrada, Salida, Ajuste
    fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. GASTOS
CREATE TABLE IF NOT EXISTS wisbe_gastos (
    id SERIAL PRIMARY KEY,
    concepto VARCHAR(150) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_gasto DATE DEFAULT CURRENT_DATE,
    categoria VARCHAR(50) NOT NULL -- Mantenimiento, Servicios, Sueldos, etc.
);

-- 12. EMPLEADOS
CREATE TABLE IF NOT EXISTS wisbe_empleados (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    puesto VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    salario DECIMAL(10, 2) NOT NULL,
    fecha_contratacion DATE DEFAULT CURRENT_DATE
);

-- 13. EQUIPAMIENTO
CREATE TABLE IF NOT EXISTS wisbe_equipamiento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Excelente', -- Excelente, Bueno, Regular, En Mantenimiento
    fecha_adquisicion DATE DEFAULT CURRENT_DATE,
    proximo_mantenimiento DATE
);

-- Inserts iniciales de prueba con ON CONFLICT (id) DO NOTHING para re-ejecución segura
INSERT INTO wisbe_planes (id, nombre, costo, duracion_dias, descripcion) VALUES
(1, 'Mensual Básico', 450.00, 30, 'Acceso completo al área de pesas y cardio.'),
(2, 'Anual VIP', 4500.00, 365, 'Acceso ilimitado, todas las clases y casillero incluido.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO wisbe_clientes (id, nombre, email, telefono, estado) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', '555-0192', 'Activo'),
(2, 'María López', 'maria.lopez@example.com', '555-0143', 'Activo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO wisbe_entrenadores (id, nombre, especialidad, telefono, email) VALUES
(1, 'Carlos Gómez', 'Crossfit & Funcional', '555-9876', 'carlos.gomez@wisbe.com'),
(2, 'Ana Rodríguez', 'Yoga & Pilates', '555-5432', 'ana.rodriguez@wisbe.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO wisbe_clases (id, nombre, entrenador_id, horario, capacidad_maxima) VALUES
(1, 'Crossfit Intensivo', 1, 'Lunes a Viernes 07:00 AM', 15),
(2, 'Yoga Restaurativo', 2, 'Martes y Jueves 06:00 PM', 20)
ON CONFLICT (id) DO NOTHING;

INSERT INTO wisbe_productos (id, nombre, precio, stock, codigo_barras) VALUES
(1, 'Proteína de Suero 1kg', 850.00, 10, '7501234567890'),
(2, 'Bebida Electrolitos', 35.00, 50, '7509876543210')
ON CONFLICT (id) DO NOTHING;

INSERT INTO wisbe_empleados (id, nombre, puesto, telefono, salario) VALUES
(1, 'Administrador Wisbe', 'Administrador General', '555-0000', 15000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO wisbe_equipamiento (id, nombre, estado, fecha_adquisicion, proximo_mantenimiento) VALUES
(1, 'Caminadora Proform 500', 'Excelente', '2023-01-15', '2024-06-15'),
(2, 'Kit de Mancuernas 2kg - 20kg', 'Bueno', '2023-02-10', '2024-08-10')
ON CONFLICT (id) DO NOTHING;
