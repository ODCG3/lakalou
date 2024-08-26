## safnabanopy

# Prérequis

   - Node.js (version 14.x ou supérieure)
   - NPM (version 6.x ou supérieure) ou Yarn (version 1.x ou supérieure)
   - Git

# Installation

   - Clonez le dépôt:

   ```
  git clone https://github.com/ODCG3/lakalou.git
  ```
ou
```
gh repo clone ODCG3/lakalou
```
  - ouvrir le dossier:
  ```
  cd lakalou
  ```

  - Installez les dépendances:

```
npm install && npm install -g nodemon
```
ou
```
yarn install
```

# Utilisation

Pour démarrer le serveur en mode développement:
```
nodemon app.js
```

# add these data to your .env file
```
MONGODB_URI=mongodb+srv://username:password@cluster0.fa6xdiy.mongodb.net/safnabanopy?retryWrites=true&w=majority&appName=Cluster0
TokenKey=safnabanopy
DATABASE_URL=mysql://username:password@localhost:3306/safnabanoppy
```

# step to setup your local ennvironment

  - pull the project or clone it 
  - create the .env file with the corrects datas
  - migrate your prisma schema into the database
  ``` npx prisma migrate dev ```
  - Then start working

# Guide to test your functionalities
  - compile the typescript code
    ``` npx tsc ```
  - then start the app 
  - open postman and test the endpoints

# Available Routes
  Here are all the routes defined in your Express router:

### User Authentication and Management:
1. **POST** `/register` - `PrismaUserController.create`
2. **POST** `/login` - `PrismaUserController.login`
3. **POST** `/logout` - `PrismaUserController.logout`
4. **POST** `/Notes/:id` - `PrismaUserController.addNotes`
5. **PUT** `/Notes/:id/:noteId` - `PrismaUserController.updateNote`
6. **GET** `/tailleur/:tailleurId` - `PrismaUserController.filterTailleurById`
7. **GET** `/tailleur/name/:name` - `PrismaUserController.filterByName`
8. **GET** `/filterByNotes/:id` - `PrismaUserController.filterByNotes`

### Tailleur Management:
1. **GET** `/listeTailleurs` - `PrismaUserController.getTailleurs`
2. **GET** `/myPosition` - `PrismaUserController.myPosition`
3. **GET** `/rang` - `PrismaUserController.getTailleurRanking`
4. **GET** `/tailleurs/statistique` - `PrismaUserController.getStatistiques`
5. **GET** `/filterTailleurByCertificat` - `PrismaUserController.filterTailleurByCertificat`

### Model Management:
1. **POST** `/model/create` - `ModelController.create`
2. **GET** `/model/:userId/getModels` - `ModelController.getModelsByUserId`
3. **PUT** `/model/:modelId/update` - `ModelController.updateModel`
4. **DELETE** `/model/:modelId/delete` - `ModelController.deleteModel`
5. **GET** `/model/:modelId` - `ModelController.getModelById`

### Story Management:
1. **POST** `/story/create` - `StoryController.createStory`
2. **GET** `/stories/:userId` - `StoryController.getStories`
3. **DELETE** `/story/:id/delete` - `StoryController.deleteStory`
4. **POST** `/story/:id/view` - `StoryController.viewStory`
5. **GET** `/story/:id/views` - `StoryController.getStoryViews`

### Post Management:
1. **POST** `/post/create` - `PostController.createPost`
2. **GET** `/post` - `PostController.getPosts`
3. **GET** `/post/:postId` - `PostController.getPostById`
4. **DELETE** `/post/:postId` - `PostController.deletePost`
5. **POST** `/post/:postId` - `PostController.addView`
6. **GET** `/post/:postId` - `PostController.getVues`
7. **POST** `/post/favorite/create/:postId` - `PostController.addFavoris`
8. **DELETE** `/post/favorite/remove/:postId` - `PostController.deleteFavoris`
9. **POST** `/post/:postId/share` - `PostController.partagerPost`
10. **GET** `/notifications` - `PostController.getNotifications`
11. **DELETE** `/notifications/:notificationId` - `PostController.deleteNotification`

### Commande Management:
1. **POST** `/commande` - `CommandeModelController.createCommande`
2. **POST** `/commandes/post/:postId` - `CommandeModelController.createCommande`
3. **POST** `/commandes/story/:storyId` - `CommandeModelController.createCommande`
4. **GET** `/commandes/post/:postId` - `CommandeModelController.getCommandes`
5. **GET** `/commandes/story/:storyId` - `CommandeModelController.getCommandes`
6. **GET** `/commandes/:commandeId` - `CommandeModelController.getCommandeById`

### Message and Discussion Management:
1. **POST** `/user/discussions/create` - `MessagesDiscussionController.createDiscussion`
2. **GET** `/user/discussions` - `MessagesDiscussionController.getDiscussions`
3. **GET** `/user/discussions/:userId` - `MessagesDiscussionController.getDiscussionsByUser`
4. **POST** `/user/discussions/:discussionUser/messages` - `MessagesDiscussionController.sendMessageToDiscussion`
5. **DELETE** `/user/discussions/:discussionId/messages/:messageId` - `MessagesDiscussionController.deleteMessage`
6. **PUT** `/user/discussions/:discussionId/messages/:messageId` - `MessagesDiscussionController.modifierMessages`

### User Profile and Interaction:
1. **POST** `/user/chargeCredit` - `PrismaUserController.chargeCredit`
2. **PUT** `/user/modifierMesure` - `PrismaUserController.updateMeasurements`
3. **POST** `/user/acheterBadge` - `PrismaUserController.acheterBadgege`
4. **POST** `/user/listeSouhaits/:id` - `ListeSouhaitsController.listeSouhaits`
5. **GET** `/user/listeSouhaits` - `ListeSouhaitsController.voirListeSouhaits`
6. **GET** `/signale/:userId` - `PrismaUserController.reportUser`
7. **POST** `/followUser` - `PrismaUserController.followUser`
8. **POST** `/unfollowUser` - `PrismaUserController.unfollowUser`
9. **GET** `/profile/:userID` - `PrismaUserController.profile`
10. **POST** `/changeRole` - `PrismaUserController.changeRole`
11. **POST** `/bloquerUsers` - `PrismaUserController.bloquerUsers`
12. **POST** `/debloquerUsers` - `PrismaUserController.debloquerUsers`
13. **GET** `/getUserBloquer` - `PrismaUserController.getUserBloquer`
14. **GET** `/myFollowers` - `PrismaUserController.myFollowers`

### Article Management:
1. **POST** `/CreateArticle` - `ArticleController.createArticle`
2. **POST** `/postArticle/:articleId` - `PostArticleController.createPostArticle`
3. **GET** `/getArticles` - `ArticleController.getArticles`

### Badge Purchase:
1. **POST** `/acheterBadgeVandeur/:id` - `PrismaUserController.acheterBadgeVandeur`

This list covers all the routes you defined in your Express router, categorized by functionality.