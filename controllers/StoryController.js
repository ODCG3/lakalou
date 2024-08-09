import Story from '../models/StoryModel.js';
import user from "../models/UserModel.js";
import model from "../models/ModelModel.js";

const createStory = async (req, res) => {
  try {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 24 heures plus tard
    const userID = req.user.userID;

    // Rechercher l'utilisateur connecté
    const connectedUser = await user.findById(userID);

    // Vérifiez si l'utilisateur a le rôle "tailleur"
    if (connectedUser.role !== 'tailleur') {
      return res.status(403).json({ error: 'Vous n\'êtes pas un tailleur, seul les tailleurs peuvent poster des statuts' });
    }

    // Vérifiez si l'utilisateur a suffisamment de crédits
    if (connectedUser.credits > 0) {
      // Recherchez le modèle que vous souhaitez associer à la story (par exemple, basé sur l'ID dans req.body)
      const modelID = req.body.model; // Assurez-vous que l'ID du modèle est fourni dans la requête
      const Model = await model.findById(modelID);

      if (!Model) {
        return res.status(404).json({ error: 'Modèle non trouvé' });
      }

      // Créez la nouvelle story
      const story = new Story({
        userId: userID,
        model: Model._id, // Ajoutez le modèle à la story
        description: req.body.description,
        contenu: req.body.contenu,
        expiresAt: expirationTime
      });

      // Sauvegardez la story
      await story.save();

      // Réduire le crédit de l'utilisateur et sauvegardez
      connectedUser.credits -= 1;
      await connectedUser.save();

      // Réponse de succès
      res.status(201).json({
        message: 'Story créée avec succès!'
      });
    } else {
      res.status(400).json({ error: 'Vous n\'avez pas assez de crédits pour poster un statut' });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getStories = (req, res) => {
  Story.find({ userId: req.params.userId, expiresAt: { $gt: new Date() } })
    .then(stories => {
      res.status(200).json(stories);
    })
    .catch(error => {
      res.status(400).json({ error: error.message });
    });
};
const deleteStory = (req, res) => {
  const storyId = req.params.id;
  const userID = req.user.userID;

  Story.deleteOne({ _id: storyId, userId: userID })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Story supprimée avec succès' });
      } else {
        res.status(404).json({ message: 'Story non trouvée ou vous n\'êtes pas autorisé à la supprimer' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
};
const viewStory = (req, res) => {
  const storyId = req.params.id;

  Story.findByIdAndUpdate(storyId, { $inc: { views: 1 } }, { new: true })
    .then(story => {
      if (story) {
        res.status(200).json({ views: story.views });
      } else {
        res.status(404).json({ message: 'Story non trouvée' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
};

const getStoryViews = async (req, res) => {
  const storyId = req.params.id;

  try{
    const story = await Story.findById(storyId);

    if(!story) {
      res.status(404).json({ message: "story not found"});
    }

    res.status(200).json({ views: story.views });
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
    // .then(story => {
    //   if (story) {
    //     res.status(200).json({ views: story.views });
    //   } else {
    //     res.status(404).json({ message: 'Story non trouvée' });
    //   }
    // })
    // .catch(error => {
    //   res.status(500).json({ error: error.message });
    // });

  }


export default {
  createStory,
  getStories,
  deleteStory,
  viewStory,
  getStoryViews,
};
