// seed.js
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
  // Suppression de toutes les notifications existantes
  await prisma.usersNotifications.deleteMany();

  // Création de nouvelles notifications pour tester
  const notifications = [
    {
      message: "Un nouveau modèle a été créé par : Modèle A",
      action: 'model_created',
      userId: 1, // Remplacez par un ID d'utilisateur valide
      postId: 1, // Remplacez par un ID de modèle valide
      read: false,
    },
    {
      message: "L'utilisateur avec l'ID 1 a aimé votre post.",
      action: 'post_liked',
      userId: 2, // Remplacez par un ID d'utilisateur valide
      postId: 2, // Remplacez par un ID de post valide
      read: false,
    },
    {
      message: "L'utilisateur avec l'ID 1 a retiré son like de votre post.",
      action: 'post_unliked',
      userId: 2, // Remplacez par un ID d'utilisateur valide
      postId: 2, // Remplacez par un ID de post valide
      read: false,
    },
    {
      message: "Votre post a été commenté par l'utilisateur 3.",
      action: 'post_commented',
      userId: 1, // Remplacez par un ID d'utilisateur valide
      postId: 3, // Remplacez par un ID de post valide
      read: false,
    },
  ];

  // Insertion des notifications
  await Promise.all(
    notifications.map((notification) => 
      prisma.usersNotifications.create({ data: notification })
    )
  );

  console.log('Notifications insérées avec succès!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
