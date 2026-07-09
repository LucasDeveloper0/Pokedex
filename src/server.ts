import express from 'express';
import { prisma } from './database.js'; // Importa a conexão que acabamos de criar

const app = express();
app.use(express.json());

// Rota antiga de teste
app.get('/', (req, res) => {
  return res.json({ message: "Pokédex API rodando com sucesso! 🚀" });
});

// LISTAR Pokémon do banco de dados
app.get('/pokemons', async (req, res) => {
  try {
    const pokemons = await prisma.pokemon.findMany(); 
    return res.json(pokemons);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao conectar no banco de dados." });
  }
});

// NOVA ROTA: Criar um novo Pokémon
app.post('/pokemons', async (req, res) => {
  try {
    const { pokedexNum, name, type1, type2 } = req.body;

    // Salva o Pokémon usando o Prisma
    const newPokemon = await prisma.pokemon.create({
      data: {
        pokedexNum: Number(pokedexNum),
        name,
        type1,
        type2,
      }
    });

    return res.status(201).json(newPokemon);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar o Pokémon no banco de dados." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});