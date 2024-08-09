import model from "../models/ModelModel.js";
import post from "../models/PostModel.js";
import User from '../models/UserModel.js';

export default class ModelController {

    static async create(req, res) {
        const { libelle, prix,quantite,contenu } = req.body;

        const existingModel = await model.findOne({ libelle });

        if (existingModel) {
            return res.status(400).json({ error: 'Cet model est déjà utilisé' });
        }

        try {

            const createdModel = model.create({
                libelle, prix , quantite,contenu
            });

            const connectedUser = await User.findById(req.user.userID);
            connectedUser.mesModels.push({idModel: createdModel._id,libelle: (await createdModel).libelle,nombreDeCommande:0,note:[]});
            await connectedUser.save();

            res.status(201).json(createdModel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    // getModelsByUserId permete de récupérer tous les modèles d'un utilisateur 

    static async getModelsByUserId(req, res) {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ error: 'User ID is required' });
        const user = await User.findById(userId);
        try {
        const posts = await post.find({ utilisateur:userId});
        const models = await Promise.all(posts.map(async (element) => {
            return await model.findById(element.model);
        }));
    
        // If models may contain circular references, you can handle it like this:
        const modelsWithoutCircularRefs = models.map(model => {
            return JSON.parse(JSON.stringify(model)); // This removes circular references
        });
    
        console.log(modelsWithoutCircularRefs);
        res.json(modelsWithoutCircularRefs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

 
    // getModelById permet de récupérer un modèle par son id
    static async getModelById(req, res) {
        const { modelId } = req.params; // Get the modelId from the request parameters

        try {
            const foundModel = await model.findById(modelId); // Use the correct variable name
            if (!foundModel) return res.status(404).json({ error: 'Model not found' });
            res.json(foundModel); // Send the found model as the response
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    // updateModel permet de mettre à jour les informations d'un modèle
    static async updateModel(req, res) {
        const { modelId } = req.params; // Get the modelId from the request parameters
        const { libelle, prix , contenu } = req.body; // Get the fields to update from the request body

        try {
            const updatedModel = await model.findByIdAndUpdate(
                modelId,
                { libelle, prix },
                { new: true } // Ensure the updated document is returned
            );
            if (!updatedModel) return res.status(404).json({ error: 'Model not found' });
            res.json(updatedModel); // Send the updated model as the response
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    // deleteModel permet de supprimer un modèle
    static async deleteModel(req, res) {
        const { modelId } = req.params; // Get the modelId from the request parameters

        try {
            const deletedModel = await model.findByIdAndDelete(modelId); // Find and delete the model by its ID
            if (!deletedModel) return res.status(404).json({ error: 'Model not found' });
            res.json({ message: 'Model deleted successfully' }); // Send a success message as the response
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }



}

