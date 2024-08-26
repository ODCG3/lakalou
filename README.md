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
  Here are all the routes defined in our Express router:

# API Routes Documentation

## Authentication

- **POST** `/register`  
  Registers a new user.

- **POST** `/login`  
  Logs in a user.

- **POST** `/logout`  
  Logs out a user. (Requires authentication)

## User Management

- **POST** `/Notes/:id`  
  Adds a note to a user. (Requires authentication)

- **PUT** `/Notes/:id/:noteId`  
  Updates a specific note for a user. (Requires authentication)

- **GET** `/GetNotes`  
  Retrieves all notes for the authenticated user. (Requires authentication)

- **GET** `/tailleur/:tailleurId`  
  Retrieves a specific tailor by ID. (Requires authentication)

- **GET** `/tailleur/name/:name`  
  Retrieves a tailor by name. (Requires authentication)

- **GET** `/filterByNotes/:id`  
  Filters tailors by notes. (Requires authentication)

- **GET** `/listeTailleurs`  
  Lists all tailors. (Requires authentication)

- **GET** `/myPosition`  
  Retrieves the user's current position. (Requires authentication)

- **GET** `/rang`  
  Retrieves the ranking of tailors. (Requires authentication)

- **POST** `/followUser`  
  Follows a user. (Requires authentication)

- **POST** `/unfollowUser`  
  Unfollows a user. (Requires authentication)

- **GET** `/profile/:userID`  
  Retrieves the profile of a user by ID. (Requires authentication)

- **POST** `/changeRole`  
  Changes the role of a user. (Requires authentication)

- **POST** `/bloquerUsers`  
  Blocks a user. (Requires authentication)

- **POST** `/debloquerUsers`  
  Unblocks a user. (Requires authentication)

- **GET** `/getUserBloquer`  
  Lists all blocked users. (Requires authentication)

- **GET** `/myFollowers`  
  Retrieves a list of followers for the authenticated user. (Requires authentication)

- **GET** `/tailleurs/statistique`  
  Retrieves statistics for tailors. (Requires authentication)

- **GET** `/filterTailleurByCertificat`  
  Filters tailors by certificate. (Requires authentication)

- **POST** `/acheterBadgeVandeur/:id`  
  Purchases a badge for a vendor. (Requires authentication)

## Model Management

- **POST** `/model/create`  
  Creates a new model. (Requires authentication)

- **GET** `/model/:userId/getModels`  
  Retrieves models by user ID. (Requires authentication)

- **PUT** `/model/:modelId/update`  
  Updates a specific model by ID. (Requires authentication)

- **DELETE** `/model/:modelId/delete`  
  Deletes a specific model by ID. (Requires authentication)

- **GET** `/model/:modelId`  
  Retrieves a specific model by ID. (Requires authentication)

## Story Management

- **POST** `/story/create`  
  Creates a new story. (Requires authentication)

- **GET** `/stories/:userId`  
  Retrieves all stories for a user by ID. (Requires authentication)

- **DELETE** `/story/:id/delete`  
  Deletes a specific story by ID. (Requires authentication)

- **POST** `/story/:id/view`  
  Increments the view count for a story. (Requires authentication)

- **GET** `/story/:id/views`  
  Retrieves the view count for a story. (Requires authentication)

## Post Management

- **POST** `/post/create`  
  Creates a new post. (Requires authentication)

- **GET** `/post`  
  Retrieves all posts. (Requires authentication)

- **GET** `/post/:postId`  
  Retrieves a specific post by ID. (Requires authentication)

- **DELETE** `/post/:postId`  
  Deletes a specific post by ID. (Requires authentication)

- **POST** `/post/:postId`  
  Adds a view to a post. (Requires authentication)

- **GET** `/post/:postId`  
  Retrieves the number of views for a post. (Requires authentication)

- **POST** `/post/favorite/create/:postId`  
  Adds a post to favorites. (Requires authentication)

- **DELETE** `/post/favorite/remove/:postId`  
  Removes a post from favorites. (Requires authentication)

- **POST** `/post/:postId/share`  
  Shares a specific post. (Requires authentication)

- **GET** `/notifications`  
  Retrieves all notifications for the authenticated user. (Requires authentication)

- **DELETE** `/notifications/:notificationId`  
  Deletes a specific notification by ID. (Requires authentication)

## Comment Management

- **POST** `/post/:postId/comments/create`  
  Adds a comment to a post. (Requires authentication)

- **DELETE** `/comment/:commentId`  
  Deletes a specific comment by ID. (Requires authentication)

- **GET** `/post/:postId/comments`  
  Retrieves all comments for a specific post. (Requires authentication)

## Commande Management

- **POST** `/commande`  
  Creates a new command. (Requires authentication)

- **POST** `/commandes/post/:postId`  
  Creates a command for a post. (Requires authentication)

- **POST** `/commandes/story/:storyId`  
  Creates a command for a story. (Requires authentication)

- **GET** `/commandes/post/:postId`  
  Retrieves commands for a specific post. (Requires authentication)

- **GET** `/commandes/story/:storyId`  
  Retrieves commands for a specific story. (Requires authentication)

- **GET** `/commandes/:commandeId`  
  Retrieves a specific command by ID. (Requires authentication)

## Messaging Management

- **POST** `/user/discussions/create`  
  Creates a new discussion. (Requires authentication)

- **GET** `/user/discussions`  
  Retrieves all discussions for the authenticated user. (Requires authentication)

- **GET** `/user/discussions/:userId`  
  Retrieves discussions by user ID. (Requires authentication)

- **POST** `/user/discussions/:discussionUser/messages`  
  Sends a message to a discussion. (Requires authentication)

- **DELETE** `/user/discussions/:discussionId/messages/:messageId`  
  Deletes a specific message by ID. (Requires authentication)

- **PUT** `/user/discussions/:discussionId/messages/:messageId`  
  Modifies a specific message by ID. (Requires authentication)

## Additional User Features

- **POST** `/user/chargeCredit`  
  Charges credit to the user’s account. (Requires authentication)

- **PUT** `/user/modifierMesure`  
  Updates the user's measurements. (Requires authentication)

- **POST** `/user/acheterBadge`  
  Purchases a badge for the user. (Requires authentication)

- **POST** `/user/listeSouhaits/:id`  
  Adds to the user’s wishlist. (Requires authentication)

- **GET** `/user/listeSouhaits`  
  Retrieves the user's wishlist. (Requires authentication)

- **GET** `/signale/:userId`  
  Reports a user. (Requires authentication)
