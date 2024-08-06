import model from "../models/ModelModel.js";
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

    static async getAllPosts(req, res) {
        try {
            const posts = await post.find({});
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getPostById(req, res) {

        try {
            const postData = await post.findById(req.params.id);
            console.log(postData, req.params.id);
            
            if (!postData) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(postData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deletePost(req, res) {
        const { id } = req.params.id;

        try {
            const deletedPost = await post.findByIdAndDelete(id);
            if (!deletedPost) {
                return res.status(404).json({ error: 'Post not found' });
            }
            res.json(deletedPost);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getModel(req, res) {
        const postId = req.params.id;

        try{
            const postData = await post.findById(postId);
            const modelData = await model.findById(postData.model);

            res.json(modelData);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
