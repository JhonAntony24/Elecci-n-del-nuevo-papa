const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔌 Conexión con MongoDB
mongoose.connect('mongodb://localhost:27017/eleccion', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando MongoDB', err));

// 📦 Modelo de candidato
const CandidatoSchema = new mongoose.Schema({
  nombre: String,
  votos: Number,
});
const Candidato = mongoose.model('Candidato', CandidatoSchema);

// 📤 POST: guardar candidatos
app.post('/api/candidatos', async (req, res) => {
  try {
    await Candidato.deleteMany({});
    const nuevos = await Candidato.insertMany(req.body);
    res.json(nuevos);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar candidatos' });
  }
});

// 📥 GET: obtener candidatos ordenados
app.get('/api/candidatos', async (req, res) => {
  try {
    const candidatos = await Candidato.find().sort({ votos: -1 });
    res.json(candidatos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener candidatos' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});