import CommandeModels from '../models/CommandeModelsModel.js';
import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';
import Model from '../models/ModelModel.js';

// Effectuer une commande d'un modèle dans un post
export async function createCommande(req, res) {
    try {
        const { model_libelle, adresseLivraison } = req.body;
        const postId = req.params.postId;
        const userId = req.user.userID;

        // Vérifier si le post existe
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

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

        // Réduire le stock du modèle
        // const modelToUpdate = await Model.findById(model._id);
        // modelToUpdate.stock -= 1;
        // await modelToUpdate.save();



        // await commande.save();

        // res.status(201).json(commande);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error '+error });
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
