import express, { Request, Response, Router, RequestHandler } from 'express';

// Definición del tipo TextItem
type TextItem = {
  id: number;
  content: string;
};

// Almacenamiento en memoria
const texts: TextItem[] = [];
let nextId = 1;

// Función para contar palabras
const countWords = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
};

const app = express();
const router = Router();

app.use(express.json());
app.use(router);

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

// Registrar rutas
router.post('/texts', createText);
router.get('/texts', getAllTexts);
router.get('/texts/:id/uppercase', getUppercaseText);
router.get('/texts/contador', countTextWords);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 