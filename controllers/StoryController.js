import Story from '../models/StoryModel.js';
import user from "../models/UserModel.js";
import model from "../models/ModelModel.js";

const createStory = async (req, res) => {
  const currentTime = new Date();
  const expirationTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 24 heures plus tard
  const userID = req.user.userID;

  try {
    const connectedUser = await user.findById(userID);

    if (connectedUser.role !== "tailleur") {
      return res.status(403).json({ error: 'Vous n\'êtes pas un tailleur, seul les tailleurs peuvent poster des statuts' });
    }
    
    // Recherchez le modèle que vous souhaitez associer à la story (par exemple, basé sur l'ID dans req.body)
      const modelID = req.body.model; // Assurez-vous que l'ID du modèle est fourni dans la requête
      const Model = await model.findById(modelID);
    
    if (!Model) {
        return res.status(400).json({ error: 'Modèle non trouvé' });
      }

    if (connectedUser.credits > 0) {
      
      
      const story = new Story({
        userId: userID,
        model: Model._id,
        description: req.body.description,
        expiresAt: expirationTime,
        blockedUsers: req.body.blockedUsers || []  // Récupérer la liste des utilisateurs bloqués depuis la requête
      });

      await story.save();
      connectedUser.credits -= 1;
      connectedUser.stories.push(story._id);
      await connectedUser.save();
      res.status(201).json({
        message: 'Story créée avec succès!'
      });
    } else {

      res.status(402).json({ error: 'Crédits insuffisants pour créer une story' });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getStories = async (req, res) => {
  const viewerId = req.user.userID; // L'utilisateur qui fait la demande de voir les stories
  const ownerId = req.params.userId; // L'utilisateur propriétaire des stories

  try {
    // Récupérer les stories de l'utilisateur tout en excluant celles où l'utilisateur qui fait la requête est bloqué
    const stories = await Story.find({
      userId: ownerId,
      expiresAt: { $gt: new Date() },
      blockedUsers: { $ne: viewerId }  // Exclure les stories où le viewerId est dans la liste des utilisateurs bloqués
    });

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
        res.status(400).json({ message: 'Story non trouvée' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Une erreur interne est survenue. Veuillez réessayer plus tard.'});
    });
};

const getStoryViews = async (req, res) => {
  const storyId = req.params.id;

  try {
    const story = await Story.findById(storyId);

    if (!story) {
      res.status(404).json({ message: "La story n'a pas été trouvée."  });
    }

    res.status(200).json({ views: story.views });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Une erreur interne est survenue. Veuillez réessayer plus tard. "});
  }
};

export default {
  createStory,
  getStories,
  deleteStory,
  viewStory,
  getStoryViews,
};
