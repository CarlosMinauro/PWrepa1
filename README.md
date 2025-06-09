# API RESTful con Express y TypeScript

Este proyecto implementa una API RESTful utilizando Express.js y TypeScript, que permite gestionar textos con diferentes operaciones.

## 🚀 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## 📦 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd <nombre-del-directorio>
```

2. Inicializar el proyecto:
```bash
npm init -y
```

3. Instalar dependencias:
```bash
# Dependencias principales
npm install express

# Dependencias de desarrollo
npm install -D typescript ts-node-dev @types/express @types/node
```

4. Inicializar TypeScript:
```bash
npx tsc --init
```

5. Crear la estructura de carpetas:
```bash
mkdir src
```

## ⚙️ Configuración

1. Modificar el `package.json` para agregar el script de desarrollo:
```json
{
  "name": "pwrepa1",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.3",
    "@types/node": "^22.15.30",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.8.3"
  }
}
```

2. Configurar `tsconfig.json` (se genera automáticamente con `npx tsc --init`)

## 💻 Implementación del Servidor

El servidor se implementa en `src/index.ts` siguiendo estas mejores prácticas:

1. Importar las dependencias necesarias:
```typescript
import express, { Request, Response, Router, RequestHandler } from 'express';
```

2. Definir los tipos necesarios:
```typescript
type TextItem = {
  id: number;
  content: string;
};
```

3. Configurar el servidor y el router:
```typescript
const app = express();
const router = Router();

app.use(express.json());
app.use(router);
```

4. Implementar los manejadores de rutas como funciones separadas:
```typescript
// Función para contar palabras
const countWords = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
};

// POST /texts - Crear un nuevo texto
const createText: RequestHandler = (req, res) => {
  const { content } = req.body as { content: string };
  
  if (!content || typeof content !== 'string') {
    res.status(400).json({ error: 'El contenido es requerido y debe ser una cadena de texto' });
    return;
  }

  const newText: TextItem = {
    id: nextId++,
    content
  };

  texts.push(newText);
  res.status(201).json(newText);
};

// GET /texts - Obtener todos los textos
const getAllTexts: RequestHandler = (_req, res) => {
  res.json(texts);
};

// GET /texts/:id/uppercase - Obtener texto en mayúsculas
const getUppercaseText: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id);
  const text = texts.find(t => t.id === id);

  if (!text) {
    res.status(404).json({ error: 'Texto no encontrado' });
    return;
  }

  res.json({ content: text.content.toUpperCase() });
};

// GET /texts/contador - Contar palabras de un texto
const countTextWords: RequestHandler = (req, res) => {
  const id = parseInt(req.query.id as string);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const text = texts.find(t => t.id === id);

  if (!text) {
    res.status(404).json({ error: 'Texto no encontrado' });
    return;
  }

  const wordCount = countWords(text.content);
  res.json({ wordCount });
};
```

5. Registrar las rutas:
```typescript
router.post('/texts', createText);
router.get('/texts', getAllTexts);
router.get('/texts/:id/uppercase', getUppercaseText);
router.get('/texts/contador', countTextWords);
```

6. Iniciar el servidor:
```typescript
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
```

## 🏃‍♂️ Ejecución

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## 📡 Endpoints

### 1. Crear un nuevo texto
```bash
# En Windows (PowerShell):
curl -X POST http://localhost:3000/texts -H "Content-Type: application/json" -d "{\"content\": \"Hola mundo\"}"

# En Windows (CMD):
curl -X POST http://localhost:3000/texts -H "Content-Type: application/json" -d "{\"content\": \"Hola mundo\"}"

# En Linux/Mac:
curl -X POST http://localhost:3000/texts \
  -H "Content-Type: application/json" \
  -d '{"content": "Hola mundo"}'
```

### 2. Obtener todos los textos
```bash
# En Windows (PowerShell o CMD):
curl http://localhost:3000/texts

# En Linux/Mac:
curl http://localhost:3000/texts
```

### 3. Obtener texto en mayúsculas
```bash
# En Windows (PowerShell o CMD):
curl http://localhost:3000/texts/1/uppercase

# En Linux/Mac:
curl http://localhost:3000/texts/1/uppercase
```

### 4. Contar palabras de un texto
```bash
# En Windows (PowerShell o CMD):
curl http://localhost:3000/texts/contador?id=1

# En Linux/Mac:
curl http://localhost:3000/texts/contador?id=1
```

## 📡 Documentación de Endpoints

### Estructura Base
Todos los endpoints están definidos en `src/index.ts` y siguen el patrón RESTful. Cada endpoint está implementado como una función separada para mejor mantenibilidad.

### 1. POST /texts
Crea un nuevo texto en el sistema.

**Request:**
```json
{
  "content": "string"
}
```

**Response (201 Created):**
```json
{
  "id": number,
  "content": "string"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "El contenido es requerido y debe ser una cadena de texto"
}
```

**Implementación:**
```typescript
const createText: RequestHandler = (req, res) => {
  const { content } = req.body as { content: string };
  
  if (!content || typeof content !== 'string') {
    res.status(400).json({ error: 'El contenido es requerido y debe ser una cadena de texto' });
    return;
  }

  const newText: TextItem = {
    id: nextId++,
    content
  };

  texts.push(newText);
  res.status(201).json(newText);
};
```

### 2. GET /texts
Obtiene todos los textos almacenados.

**Response (200 OK):**
```json
[
  {
    "id": number,
    "content": "string"
  }
]
```

**Implementación:**
```typescript
const getAllTexts: RequestHandler = (_req, res) => {
  res.json(texts);
};
```

### 3. GET /texts/:id/uppercase
Obtiene un texto específico en mayúsculas.

**Response (200 OK):**
```json
{
  "content": "STRING"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Texto no encontrado"
}
```

**Implementación:**
```typescript
const getUppercaseText: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id);
  const text = texts.find(t => t.id === id);

  if (!text) {
    res.status(404).json({ error: 'Texto no encontrado' });
    return;
  }

  res.json({ content: text.content.toUpperCase() });
};
```

### 4. GET /texts/contador
Cuenta las palabras de un texto específico.

**Query Parameters:**
- `id`: ID del texto a contar

**Response (200 OK):**
```json
{
  "wordCount": number
}
```

**Response (400 Bad Request):**
```json
{
  "error": "ID inválido"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Texto no encontrado"
}
```

**Implementación:**
```typescript
const countTextWords: RequestHandler = (req, res) => {
  const id = parseInt(req.query.id as string);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }

  const text = texts.find(t => t.id === id);

  if (!text) {
    res.status(404).json({ error: 'Texto no encontrado' });
    return;
  }

  const wordCount = countWords(text.content);
  res.json({ wordCount });
};
```

## 🔧 Modificación de Endpoints

### Agregar un Nuevo Endpoint
1. Define la función del manejador:
```typescript
const nuevoEndpoint: RequestHandler = (req, res) => {
  // Lógica del endpoint
};
```

2. Registra la ruta en el router:
```typescript
router.get('/nueva-ruta', nuevoEndpoint);
```

### Modificar un Endpoint Existente
1. Localiza la función del manejador en `src/index.ts`
2. Modifica la lógica según sea necesario
3. Actualiza la documentación en el README.md

### Ejemplo de Modificación
Para agregar un endpoint que devuelva el texto en minúsculas:

```typescript
// 1. Agregar la función del manejador
const getLowercaseText: RequestHandler = (req, res) => {
  const id = parseInt(req.params.id);
  const text = texts.find(t => t.id === id);

  if (!text) {
    res.status(404).json({ error: 'Texto no encontrado' });
    return;
  }

  res.json({ content: text.content.toLowerCase() });
};

// 2. Registrar la ruta
router.get('/texts/:id/lowercase', getLowercaseText);
```

### Consideraciones al Modificar
1. Mantén la consistencia en el manejo de errores
2. Actualiza la documentación
3. Asegúrate de que los tipos TypeScript sean correctos
4. Prueba los cambios con los comandos curl proporcionados

## 📁 Estructura del Proyecto

```