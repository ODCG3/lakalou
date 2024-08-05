import post from "../models/PostModel.js";

export default class PostController {

    static async create(req, res) {
        
        const { contenues,model,description,titre } = req.body;

        const utilisateur = req.user.userID;
        console.log(utilisateur);
        

        try {

            const createdPost = post.create({
                contenues,model,utilisateur,commentaires: [],partages: [],dislikes: [],likes: [],description,titre,vues: []
            });
            res.status(201).json(createdPost);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
