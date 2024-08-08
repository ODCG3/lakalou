import model from "../models/ModelModel.js";
import post from "../models/PostModel.js";
import favori from "../models/FavoriModel.js";
import partage from "../models/PartageModel.js";
import user from "../models/UserModel.js";

export default class PostController {

    static async create(req, res) {

        const connectedUser = await user.findById(req.user.userID);
        console.log(connectedUser);
        if (connectedUser.role != "tailleur") {
            return res.status(403).json({ error: 'Vous n\'êtes pas un tailleur' });
        }

        const { contenues, model, description, titre } = req.body;

        const utilisateur = req.user.userID;


        try {

            const createdPost = await post.create({
                contenues, model, utilisateur, commentaires: [], partages: [], dislikes: [], likes: [], description, titre, vues: []
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
        const id = req.params.id;

        const testpost = await post.findById(id);
        console.log(testpost);


        try {
            const deletedPost = await post.findOneAndDelete({ _id: id, utilisateur: req.user.userID });
            console.log(deletedPost);

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

        try {
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


    static async removeFavorite(req, res) {
        const { id } = req.params; // id du favori à supprimer
        const utilisateurId = req.user.userID;

        try {
            // Vérifier si le favori existe
            const favoriToRemove = await favori.findOne({ utilisateur: utilisateurId, post: id });
            if (!favoriToRemove) {
                return res.status(404).json({ error: "Favorite not found" });
            }

            // Supprimer le favori
            await favoriToRemove.deleteOne();
            res.status(200).json({ message: "Favorite removed successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async partagerPost(req, res) {
        const { postId } = req.params;
        const utilisateurId = req.user.userID;
        const { utilisateurCible } = req.body;

        try {
            // Vérifier si le post appartient à l'utilisateur connecté
            const postData = await post.findById(postId);
            if (!postData) {
                return res.status(404).json({ error: "Post not found" });
            }

            // Vérifier si l'utilisateur cible existe
            const utilisateurCibleData = await user.findById(utilisateurCible);
            if (!utilisateurCibleData) {
                return res.status(404).json({ error: "User not found" });
            }

            const donneePartage =  partage.create({sender: utilisateurCible,post: postId,receiver: utilisateurCible});
            if (!donneePartage) {
                return res.status(500).json({ error: "Failed to share post" });
            }

            // Ajouter le post à la liste des partages de l'utilisateur cible
            postData.partages.push(utilisateurId);
            await postData.save();

            res.status(200).json({
                message: "Post shared successfully",
                post: postData
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async marquerVue(req,res){
        const { postId } = req.params;
        const utilisateurId = req.user.userID;

        try {
            const postData = await post.findById(postId);
            if (!postData) {
                return res.status(404).json({ error: "Post not found" });
            }

            // Ajouter le post à la liste des vues de l'utilisateur
            postData.vues.push(utilisateurId);
            await postData.save();

            res.status(200).json({ message: "Post viewed successfully", post: postData });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getVues(req, res){
        const { postId } = req.params;

        try {
            const postData = await post.findById(postId);
            if (!postData) {
                return res.status(404).json({ error: "Post not found" });
            }

            res.status(200).json(postData.vues.length);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllFavorites(req, res) {
        const utilisateurId = req.user.userID;
        console.log(utilisateurId);
        
        try {
            
            // Récupérer tous les favoris de l'utilisateur sans les détails du post
            const favoris = await favori.find({ utilisateur: utilisateurId });
    
            // Vérifier si des favoris ont été trouvés
            if (!favoris.length) {
                return res.status(404).json({ error: "No favorites found" });
            }
    
            // Retourner les favoris
            res.status(200).json(favoris);
        } catch (error) {
            console.error('Error retrieving favorites:', error);
            res.status(500).json({ error: error.message });
        }
    }

}
