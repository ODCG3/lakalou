import model from "../models/ModelModel.js";

export default class ModelController {

    static async create(req, res) {
        const { libelle, prix } = req.body;

        const existingModel = await model.findOne({ libelle });

        if (existingModel) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        try {

            const createdModel = model.create({
                libelle, prix
            });
            res.status(201).json(createdModel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
