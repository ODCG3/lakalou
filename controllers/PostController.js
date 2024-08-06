import model from "../models/ModelModel.js";
import post from "../models/PostModel.js";
import favori from "../models/FavoriModel.js";

export default class PostController {

    static async create(req, res) {
        
        const { contenues,model,description,titre } = req.body;

        const utilisateur = req.user.userID;
        

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


    static async addFavorite(req, res) {
        const { id } = req.params;
        const utilisateurId = req.user.userID;
        
        try {
            // Vérifier si le post appartient à l'utilisateur connecté
            const Post = await post.findById(id);
            if (!Post) {
                return res.status(404).json({ error: "Post not found" });
            }

            // Vérifier si le post est déjà dans les favoris de l'utilisateur
            const existingFavori = await favori.findOne({ utilisateur: utilisateurId, post: id });
            if (existingFavori) {
                return res.status(400).json({ error: "Post already favorited" });
            }

            // Ajouter le post aux favoris de l'utilisateur
            const newFavori = await favori.create({ utilisateur: utilisateurId, post: id });
            if (!newFavori) {
                return res.status(500).json({ error: "Failed to add post to favorites" });
            }

            res.status(200).json({ message: "Post marked as favorite", favori: newFavori });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    
    

    
}
