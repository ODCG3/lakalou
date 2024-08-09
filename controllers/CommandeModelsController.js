import CommandeModels from '../models/CommandeModelsModel.js';
import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';
import Story from '../models/StoryModel.js';
import Model from '../models/ModelModel.js';

// Effectuer une commande d'un modèle dans un post
export async function createCommande(req, res) {
    try {
        const { model_libelle, adresseLivraison } = req.body;
        const userId = req.user.userID;
        const { postId, storyId } = req.params;

        let model = null;
        let ownerId = null;

        // Vérifier si c'est un post ou une story
        if (postId && !storyId) {
            // Gérer la commande à partir d'un post
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post non trouvé' });
            }

            // Vérifier si le modèle existe dans le post
            model = post.model;
            if (!model) {
                return res.status(404).json({ message: 'Modèle non trouvé dans le post' });
            }

            // Empêcher un utilisateur de commander sur son propre post
            if (post.utilisateur.toString() === userId) {
                return res.status(403).json({ message: 'Vous ne pouvez pas commander sur votre propre post' });
            }

            ownerId = post.utilisateur;

        } else if (!postId && storyId) {
            // Gérer la commande à partir d'une story
            const story = await Story.findById(storyId);
            if (!story) {
                return res.status(404).json({ message: 'Story non trouvée' });
            }

            // Vérifier si le modèle existe dans la story
            model = story.model;
            if (!model) {
                return res.status(404).json({ message: 'Modèle non trouvé dans la story' });
            }

            // Empêcher un utilisateur de commander sur sa propre story
            if (story.userId.toString() === userId) {
                return res.status(403).json({ message: 'Vous ne pouvez pas commander sur votre propre story' });
            }

            ownerId = story.userId;

        } else {
            return res.status(400).json({ message: 'Veuillez spécifier soit un postId, soit un storyId, mais pas les deux ou aucun.' });
        }


        // Créer la commande
        const commande = new CommandeModels({
            user_id: userId,
            post_id: postId || null,
            story_id: storyId || null,
            model_libelle: model_libelle,
            adresseLivraison
        });

        // Sauvegarder la commande
        await commande.save();

        // Associer la commande à l'utilisateur
        const user = await User.findById(userId);
        user.MesCommand.push(commande.id);
        await user.save();

        // Associer la commande au tailleur (propriétaire du post ou de la story)
        const tailleur = await User.findById(ownerId);
        tailleur.CommandesUtilisateur.push(commande.id);
        await tailleur.save();

        res.status(201).json(commande);

        // Vérifier si le modèle existe dans le post
        const model = post.model;
        if (!model) {
            return res.status(404).json({ message: 'Model not found in the post' });
        }
        // un user ne doit pas pouvoire commander sur un post qu'il à fait
        
        const modelCommander = Model.findById(model);
        if(modelCommander.quantite > 0){

            // Créer la commande
            const commande = CommandeModels.create({
                user_id: userId,
                post_id: postId,
                model_libelle: model_libelle,
                adresseLivraison
            });
            
            modelCommander.quantite -= 1;
            await modelCommander.save();
            
            // Associer la commande à l'utilisateur
            const user = await User.findById(userId);
            user.MesCommand.push((await commande).id);
            await user.save();
            
            const tailleur = await User.findById(post.utilisateur);
            tailleur.CommandesUtilisateur.push((await commande).id);
            await tailleur.save();
            
            // Sauvegarder la commande
            
            res.status(201).json(commande);
        }else{
            res.status(400).json({ message: 'Le modèle n\'est plus disponible' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur : ' + error.message });
    }
}


// Récupérer toutes les commandes d'un post
export async function getCommandesByPostId(req, res) {
    try {
        const postId = req.params.postId;
        const commandes = await CommandeModels.find({ post_id: postId });

        res.json(commandes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Récupérer une commande par son id
export async function getCommandeById(req, res) {
    try {
        const commandeId = req.params.commandeId;
        const commande = await CommandeModels.findById(commandeId);

        if (!commande) {
            return res.status(404).json({ message: 'Commande not found' });
        }

        res.json(commande);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
