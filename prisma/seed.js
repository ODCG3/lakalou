// prisma/seed.js

const { PrismaClient, Users_role } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Créer des utilisateurs
  const user1 = await prisma.users.create({
    data: {
      email: 'user1@example.com',
      nom: 'John',
      prenom: 'Doe',
      password: 'password123',
      photoProfile: 'path/to/photo1.jpg',
      role: Users_role.CLIENT, // Utiliser l'énumération
      status: 'active',
      credits: 100,
    },
  });

  const user2 = await prisma.users.create({
    data: {
      email: 'user2@example.com',
      nom: 'Jane',
      prenom: 'Doe',
      password: 'password123',
      photoProfile: 'path/to/photo2.jpg',
      role: Users_role.CLIENT, // Utiliser l'énumération
      status: 'active',
      credits: 200,
    },
  });

  // Créer des modèles
  const model1 = await prisma.models.create({
    data: {
      contenu: { /* JSON data here */ },
      libelle: 'Modèle A',
      prix: 150,
      quantite: 10,
      tailleurID: user2.id,
    },
  });

  const model2 = await prisma.models.create({
    data: {
      contenu: { /* JSON data here */ },
      libelle: 'Modèle B',
      prix: 250,
      quantite: 5,
      tailleurID: user2.id,
    },
  });

  // Créer des posts
  await prisma.posts.create({
    data: {
      datePublication: new Date(),
      description: 'Un super modèle à découvrir.',
      titre: 'Post sur Modèle A',
      utilisateurId: user1.id,
      modelId: model1.id,
      articlesid: null,
    },
  });

  await prisma.posts.create({
    data: {
      datePublication: new Date(),
      description: 'Nouveau modèle disponible.',
      titre: 'Post sur Modèle B',
      utilisateurId: user1.id,
      modelId: model2.id,
      articlesid: null,
    },
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
