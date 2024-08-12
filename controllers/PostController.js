import model from "../models/ModelModel.js";
import post from "../models/PostModel.js";
import favori from "../models/FavoriModel.js";
import partage from "../models/PartageModel.js";
import user from "../models/UserModel.js";

export default class PostController {

    static async create(req, res) {
        const connectedUser = await user.findById(req.user.userID);
        if (connectedUser.role != "tailleur") {
            return res.status(402).json({ error: 'Vous n\'êtes pas un tailleur , seul les tailleur peuvent cree des postes' });
        }

        const { model, description, titre } = req.body;
        const utilisateur = req.user.userID;

        try {
            if(connectedUser.credits > 0){
                const createdPost = await post.create({
                    model, utilisateur, commentaires: [], partages: [], dislikes: [], likes: [], description, titre, vues: []
                });

                connectedUser.posts.push(createdPost._id);

                connectedUser.credits -= 1;
                await connectedUser.save();
                await PostController.notifyFollowers(utilisateur, createdPost._id); // Notifier les abonnés
                res.status(201).json(createdPost);
            }else{
                res.status(403).json({ error: 'Vous n\'avez pas assez de crédits pour poster veuillez recharger votre compte' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Méthode pour notifier les abonnés
    static async notifyFollowers(userId, postId) {
        try {
            // Récupérer les informations de l'utilisateur
            const userData = await user.findById(userId);
            if (!userData) {
                console.error('Utilisateur non trouvé pour la notification');
                return;
            }
        
            // Récupérer les abonnés de l'utilisateur
            const followers = userData.followers;
        
            for (const followerId of followers) {
                // Récupérer les informations de l'abonné
                const follower = await user.findById(followerId);
                if (follower) {
                    // Ajouter une notification pour chaque abonné
                    follower.notifications.push({
                        type: 'post',
                        message: `L'utilisateur ${userData.nom} a créé un nouveau post`,
                        postId: postId
                    });
    
                    await follower.save(); 
                }
            }
        } catch (error) {
            console.error('Erreur lors de la notification des abonnés:', error);
        }
    }

    static async deleteNotification(req, res) {
        const userId = req.user.userID;
        const { notificationId } = req.params;
    
        try {
             const userData = await user.findById(userId);
            if (!userData) {
                return res.status(404).json({ error: 'User not found' });
            }
    
             const updatedNotifications = userData.notifications.filter(notification => notification._id.toString() !== notificationId);
    
             userData.notifications = updatedNotifications;
            await userData.save();
    
            res.status(200).json({ message: 'Notification removed successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }






   
    
    

    static async getNotifications(req, res) {
        const userId = req.user.userID;

        try {
            const userData = await user.findById(userId).select('notifications');
            console.log(userData);
            if (!userData) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(userData.notifications);
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
                return res.status(402).json({ error: "Post not found" });
            }

            // Vérifier si le post est déjà dans les favoris de l'utilisateur
            const existingFavori = await favori.findOne({ utilisateur: utilisateurId, post: id });
            if (existingFavori) {
                return res.status(400).json({ error: "Post already favorited" });
            }

            // Ajouter le post aux favoris de l'utilisateur
            const newFavori = await favori.create({ utilisateur: utilisateurId, post: id });
            
            const connectedUser = await user.findById(req.user.userID);
            connectedUser.favories.push(newFavori.utilisateur);
            await connectedUser.save();

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
                return res.status(400).json({ error: "Favorite not found" });
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
                return res.status(400).json({ error: "Post not found" });
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
