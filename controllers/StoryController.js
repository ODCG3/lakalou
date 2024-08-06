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

export default {
  createStory
};
