export class Controller {
    constructor(model){
        this.model = new model();
    }

    getAll(req, res){
        res.json(this.model.getAll());
    }

    getOne(req, res){
        const id = req.params.id;
        const item = this.model.getOne(id);
        if(!item) return res.status(404).send("Not Found");
        res.json(item);
    }

    getCol(req, res, col){
        const items = this.model.getObject(col,req.params.id);
        res.json(items);
    }

    create(req, res){
        console.log(req);
        const item = this.model.create(req.query);
        res.status(201).json(item);
    }

    update(req, res){
        const id = req.params.id;
        const updatedItem = this.model.update(id, req.body);
        if(!updatedItem) return res.status(404).send("Not Found");
        res.json(updatedItem);
    }

    delete(req, res){
        const id = req.params.id;
        const updatedItem = this.model.delete(id);
        if(!updatedItem) return res.status(404).send("Not Found");
        res.json(updatedItem);
    }
}