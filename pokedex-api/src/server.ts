import express from 'express';
import cors from 'cors';
import { prisma } from './database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Defina uma chave secreta para assinar o token (em produção, use variáveis de ambiente!)
const JWT_SECRET = "SECRET_SUPER_SECRETO_PARA_SER_UM_CAMPEÃO";

const app = express();

app.use(cors({
  origin: 'https://pokedex-project-six-tawny.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  return res.json({ message: "Pokédex API rodando com sucesso! 🚀" });
});

// ==========================================
// 👤 GERENCIAMENTO DE TREINADORES
// ==========================================

// 1. REGISTRO: Criar novo treinador
app.post('/treinadores', async (req, res) => {
  try {
    const { name, email, password, originRegion } = req.body;

    if (!name || !email || !password || !originRegion) {
      return res.status(400).json({ error: "Todos os campos (name, email, password, originRegion) são obrigatórios." });
    }

    // Criptografa a senha antes de salvar no banco
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newTrainer = await prisma.trainer.create({
      data: {
        name,
        email,
        password: hashedPassword, // Salva a senha protegida
        originRegion
      }
    });

    // Remove a senha do objeto de retorno por segurança
    const { password: _, ...trainerWithoutPassword } = newTrainer;

    return res.status(201).json(trainerWithoutPassword);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }
    return res.status(500).json({ error: "Erro interno ao criar o treinador." });
  }
});

// 2. LOGIN: Autenticar e gerar o Token JWT
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    // 🔒 CONTA ADMIN MESTRA (Hardcoded para segurança e simplicidade)
    const ADMIN_EMAIL = "admin@pokedex.com";
    const ADMIN_PASSWORD = "admin123"; // Defina a senha que desejar

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Gera um token JWT especial para o admin
      const token = jwt.sign(
        { trainerId: "ADMIN_ID", isAdmin: true },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        message: "Modo Deus Ativado! 🔓",
        token,
        isAdmin: true, // Avisa o frontend que este é o admin
        trainer: {
          id: "ADMIN_ID",
          name: "Administrador do Sistema",
          originRegion: "Geral"
        }
      });
    }

    // --- SE NÃO FOR O ADMIN, SEGUE O FLUXO NORMAL DE TREINADOR ---
    const trainer = await prisma.trainer.findUnique({
      where: { email }
    });

    if (!trainer) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const isPasswordValid = await bcrypt.compare(password, trainer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { trainerId: trainer.id, isAdmin: false },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      message: "Login efetuado com sucesso! 🔓",
      token,
      isAdmin: false,
      trainer: {
        id: trainer.id,
        name: trainer.name,
        originRegion: trainer.originRegion
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao fazer login." });
  }
});

// 3. Lista todos os treinadores cadastrados
app.get('/treinadores', async (req, res) => {
  try {
    const trainers = await prisma.trainer.findMany();
    return res.json(trainers);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar os treinadores." });
  }
});

// 4. Buscar o perfil completo do treinador por ID
app.get('/treinadores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await prisma.trainer.findUnique({
      where: { id },
      include: {
        badges: true, // Traz a lista de insígnias
        pokemons: {
          include: {
            pokemon: true, // Traz os detalhes do Pokémon 
          },
        },
      },
    });

    if (!trainer) {
      return res.status(404).json({ error: "Treinador não encontrado em nossa base." });
    }

    return res.json(trainer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao buscar perfil do treinador." });
  }
});

//=============================================
// --- CATÁLOGO GLOBAL DE INSÍGNIAS (Admin) ---
//=============================================

app.get('/global-badges', async (req, res) => {
  const badges = await prisma.globalBadge.findMany();
  return res.json(badges);
});

app.post('/global-badges', async (req, res) => {
  const { name, gym } = req.body;
  const badge = await prisma.globalBadge.create({ data: { name, gym } });
  return res.status(201).json(badge);
});

app.patch('/global-badges/:id', async (req, res) => {
  const { id } = req.params;
  const { name, gym } = req.body;
  const updated = await prisma.globalBadge.update({ where: { id }, data: { name, gym } });
  return res.json(updated);
});

app.delete('/global-badges/:id', async (req, res) => {
  await prisma.globalBadge.delete({ where: { id: req.params.id } });
  return res.json({ message: "Insígnia removida do catálogo." });
});

// --- CONQUISTA DE INSÍGNIAS (Treinador) ---

app.post('/treinadores/badges', async (req, res) => {
  // Recebemos o badgeId (ID da GlobalBadge) vindo do frontend
  const { trainerId, badgeId, name, gym } = req.body;
  
  try {
    // 1. Verifica se o treinador já tem essa insígnia (pelo nome)
    const exists = await prisma.badge.findFirst({ where: { trainerId, name } });
    if (exists) return res.status(400).json({ error: "Você já possui esta insígnia!" });

    // 2. Cria a Badge forçando o "id" a ser idêntico ao "badgeId" (FK da GlobalBadge)
    const newBadge = await prisma.badge.create({
      data: {
        id: badgeId, // <-- CRUCIAL: O id da Badge DEVE ser o mesmo id da GlobalBadge
        name,
        gym,
        trainerId // Conecta o treinador diretamente pelo ID
      }
    });

    return res.status(201).json(newBadge);
  } catch (error) {
    console.error("Erro detalhado no Prisma:", error);
    return res.status(500).json({ error: "Erro interno no servidor ao salvar a insígnia." });
  }
});

app.get('/treinadores/:id/badges', async (req, res) => {
  const { id } = req.params;
  try {
    const badges = await prisma.badge.findMany({
      where: {
        trainerId: id
      }
    });
    return res.json(badges);
  } catch (error) {
    console.error("Erro ao buscar badges direto:", error);
    return res.status(500).json({ error: "Erro ao carregar insígnias do treinador." });
  }
});


// ==========================================
// 🦖 GERENCIAMENTO DE POKÉMONS (Base de dados global)
// ==========================================

// 1. Listar Pokémon base do sistema
app.get('/pokemons', async (req, res) => {
  try {
    const pokemons = await prisma.pokemon.findMany(); 
    return res.json(pokemons);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar os Pokémon do sistema." });
  }
});

// 2. Cadastrar um Pokémon na base global (Para podermos capturar depois)
app.post('/pokemons', async (req, res) => {
  try {
    const { name, pokedexNum, type1, type2, evolvesToId } = req.body;

    const newPokemon = await prisma.pokemon.create({
      data: {
        name,
        pokedexNum: Number(pokedexNum),
        type1,
        type2: type2 || null,
        evolvesToId: evolvesToId || null // O pokemon pode ou não ter evolução, então é opcional
      }
    });

    return res.status(201).json(newPokemon);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar o Pokémon na base global." });
  }
});

// 3. Vincular um Pokémon a um treinador específico (Capturar)
app.post('/capturas', async (req, res) => {
  try {
    const { trainerId, pokemonId, nickname, level } = req.body;

    // 1. Verifica se o treinador existe no banco
    const trainerExists = await prisma.trainer.findUnique({
      where: { id: trainerId }
    });

    // 2. Verifica se o Pokémon base existe no catálogo global
    const pokemonExists = await prisma.pokemon.findUnique({
      where: { id: pokemonId }
    });

    if (!trainerExists || !pokemonExists) {
      return res.status(404).json({ error: "Treinador ou Pokémon não encontrado no sistema." });
    }

    // 3. Cria o registro na tabela de Pokémons Capturados
    const captured = await prisma.capturedPokemon.create({
      data: {
        trainerId,
        pokemonId,
        nickname: nickname || null,
        level: level ? Number(level) : 1 // Padrão level 1 se não enviar
      }
    });

    return res.status(201).json({
      message: "Pokémon capturado com sucesso! 🎉",
      captured
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao realizar a captura do Pokémon." });
  }
});

// 4. Lista todos os Pokémons do time/capturados de um treinador específico
app.get('/treinadores/:id/time', async (req, res) => {
  try {
    const { id } = req.params; 

    const trainerWithPokemons = await prisma.trainer.findUnique({
      where: { id: id },
      include: {
        captured: {
          include: {
            pokemon: true 
          }
        }
      }
    });

    if (!trainerWithPokemons) {
      return res.status(404).json({ error: "Treinador não encontrado." });
    }

    // Retorna apenas a lista de pokémons capturados com seus detalhes
    return res.json({
      trainer: trainerWithPokemons.name,
      region: trainerWithPokemons.originRegion,
      team: trainerWithPokemons.captured
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar o time do treinador." });
  }
});

// 5. Evoluir um Pokémon capturado (Usando Auto-referenciamento inteligente)
app.patch('/pokemons/:id/evoluir', async (req, res) => {
  try {
    const { id } = req.params; 
    const { nickname, level } = req.body; 

    
    const capturedExists = await prisma.capturedPokemon.findUnique({
      where: { id: id },
      include: { pokemon: true } 
    });

    if (!capturedExists) {
      return res.status(404).json({ error: "Pokémon capturado não encontrado." });
    }

    
    const nextEvolutionId = capturedExists.pokemon.evolvesToId;

    if (!nextEvolutionId) {
      return res.status(400).json({ 
        error: `O ${capturedExists.pokemon.name} não possui mais evoluções registradas no sistema.` 
      });
    }

    // 3. Atualiza os dados no banco usando o ID da evolução que o banco descobriu sozinho
    const evolvedPokemon = await prisma.capturedPokemon.update({
      where: { id: id },
      data: {
        pokemonId: nextEvolutionId, 
        nickname: nickname || capturedExists.nickname,
        level: level ? Number(level) : capturedExists.level
      },
      include: {
        pokemon: true 
      }
    });

    return res.json({
      message: `Parabéns! Seu ${capturedExists.pokemon.name} evoluiu! 🎉`,
      evolvedPokemon
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao evoluir o Pokémon de forma inteligente." });
  }
});

// 6. Rota para atualizar os dados de um Pokémon no catálogo global
app.patch('/pokemons/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID do Pokémon global (ex: ID do Squirtle)
    const { name, pokedexNum, type1, type2, evolvesToId } = req.body;

    // 1. Verifica se o Pokémon que queremos editar existe
    const pokemonExists = await prisma.pokemon.findUnique({
      where: { id }
    });

    if (!pokemonExists) {
      return res.status(404).json({ error: "Pokémon não encontrado no catálogo global." });
    }

    // 2. Se enviou uma evolução, verifica se o ID da evolução realmente existe
    if (evolvesToId) {
      const evolutionExists = await prisma.pokemon.findUnique({
        where: { id: evolvesToId }
      });

      if (!evolutionExists) {
        return res.status(404).json({ error: "O ID do Pokémon de evolução fornecido não existe." });
      }
    }

    // 3. Atualiza os dados no banco
    const updatedPokemon = await prisma.pokemon.update({
      where: { id },
      data: {
        name: name || pokemonExists.name,
        pokedexNum: pokedexNum ? Number(pokedexNum) : pokemonExists.pokedexNum,
        type1: type1 || pokemonExists.type1,
        type2: type2 !== undefined ? type2 : pokemonExists.type2,
        evolvesToId: evolvesToId || pokemonExists.evolvesToId
      }
    });

    return res.json({
      message: "Pokémon do catálogo atualizado com sucesso! 📝",
      updatedPokemon
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar o Pokémon global." });
  }
});

// 7. Rota para libertar/deletar um Pokémon capturado
app.delete('/pokemons/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Primeiro verifica se o Pokémon capturado existe
    const capturedExists = await prisma.capturedPokemon.findUnique({
      where: { id }
    });

    if (!capturedExists) {
      return res.status(404).json({ error: "Pokémon capturado não encontrado." });
    }

    // Antes de deletar o Pokémon, precisamos remover ele de qualquer time (TeamMember) 
    // para evitar erros de chave estrangeira (Constraint Violation)
    await prisma.teamMember.deleteMany({
      where: { capturedId: id }
    });

    // Agora sim deleta o Pokémon capturado
    await prisma.capturedPokemon.delete({
      where: { id }
    });

    return res.json({ message: "Pokémon libertado na natureza com sucesso! 🍃" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao libertar o Pokémon." });
  }
});

// ==========================================
// 🏆 GERENCIAMENTO DE TIMES (A Elite dos 6)
// ==========================================

// 1. Criar um novo Time (Ex: "Time de Kanto", "Time Principal")
app.post('/teams', async (req, res) => {
  try {
    const { name, trainerId } = req.body;

    if (!name || !trainerId) {
      return res.status(400).json({ error: "Nome do time e ID do treinador são obrigatórios." });
    }

    const newTeam = await prisma.team.create({
      data: {
        name,
        trainerId
      }
    });

    return res.status(201).json(newTeam);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar o time." });
  }
});

// 2. Adicionar um Pokémon Capturado ao Time (Com trava de máximo 6)
app.post('/teams/members', async (req, res) => {
  try {
    const { teamId, capturedId } = req.body;

    if (!teamId || !capturedId) {
      return res.status(400).json({ error: "O ID do time e o ID do Pokémon capturado são obrigatórios." });
    }

    // Validação 1: Conta quantos integrantes esse time já possui
    const currentMemberCount = await prisma.teamMember.count({
      where: { teamId }
    });

    if (currentMemberCount >= 6) {
      return res.status(400).json({ error: "Sua equipe já está cheia! Um time pode ter no máximo 6 Pokémons." });
    }

    // Validação 2: Evita colocar o MESMO Pokémon repetido (mesma instância) no mesmo time
    const alreadyInTeam = await prisma.teamMember.findFirst({
      where: {
        teamId,
        capturedId
      }
    });

    if (alreadyInTeam) {
      return res.status(400).json({ error: "Este Pokémon específico já está escalado neste time!" });
    }

    // Se passou pelas travas, adiciona o integrante
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        capturedId
      }
    });

    return res.status(201).json({
      message: "Pokémon escalado para o time com sucesso! ⚔️",
      newMember
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao adicionar o Pokémon ao time." });
  }
});

// 3. Opcional/Suporte: Listar os times de um treinador com seus respectivos integrantes
app.get('/treinadores/:trainerId/teams', async (req, res) => {
  try {
    const { trainerId } = req.params;

    const teams = await prisma.team.findMany({
      where: { trainerId },
      include: {
        members: {
          include: {
            captured: {
              include: {
                pokemon: true
              }
            }
          }
        }
      }
    });

    return res.json(teams);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar os times." });
  }
});


// ==========================================
// ⚡ MODO DEUS: ROTAS ADMINISTRATIVAS
// ==========================================

// 1. EXCLUIR TREINADOR (Remove o treinador e limpa seus vínculos para não quebrar o banco)
app.delete('/admin/treinadores/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Remove insígnias, membros de times, times e capturas do treinador primeiro
    await prisma.badge.deleteMany({ where: { trainerId: id } });
    await prisma.teamMember.deleteMany({ where: { team: { trainerId: id } } });
    await prisma.team.deleteMany({ where: { trainerId: id } });
    await prisma.capturedPokemon.deleteMany({ where: { trainerId: id } });

    // Deleta o treinador definitivo
    await prisma.trainer.delete({ where: { id } });

    return res.json({ message: "Treinador banido e removido do sistema com sucesso! ⚡" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao excluir treinador." });
  }
});

// 2. EDITAR TREINADOR (Atualiza os dados cadastrais na visão do Admin)
app.patch('/admin/treinadores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, originRegion } = req.body;

    const updated = await prisma.trainer.update({
      where: { id },
      data: { name, email, originRegion }
    });

    return res.json({ message: "Dados do treinador atualizados!", updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar treinador." });
  }
});

// 3. EXCLUIR POKÉMON GLOBAL (Apaga a espécie do catálogo geral)
app.delete('/admin/pokemons/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Desvincula dependências de evolução e instâncias capturadas
    await prisma.pokemon.updateMany({ where: { evolvesToId: id }, data: { evolvesToId: null } });
    await prisma.teamMember.deleteMany({ where: { captured: { pokemonId: id } } });
    await prisma.capturedPokemon.deleteMany({ where: { pokemonId: id } });

    // Deleta do catálogo global
    await prisma.pokemon.delete({ where: { id } });

    return res.json({ message: "Espécie removida do catálogo global!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao excluir Pokémon global." });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});