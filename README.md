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