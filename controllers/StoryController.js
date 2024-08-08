import Story from '../models/StoryModel.js';

const createStory = (req, res) => {
  const currentTime = new Date();
  const expirationTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 24 heures plus tard
  const userID = req.user.userID;

  const story = new Story({
    userId: userID,
    content: req.body.content,
    mediaUrl: req.body.mediaUrl,
    expiresAt: expirationTime
  });

  story.save()
    .then(() => {
      res.status(201).json({
        message: 'Story créée avec succès!'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message
      });
    });
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

const getStoryViews = (req, res) => {
  const storyId = req.params.id;

  Story.findById(storyId)
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

  }


export default {
  createStory,
  getStories,
  deleteStory,
  viewStory,
  getStoryViews,
};
