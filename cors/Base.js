import db from "../database/data.js";

export class Base {
    constructor(model) {
        this.db = db[model];
        this.model = model;
    }

    getAll() {
        return this.db;
    }

    getOne(id) {
        return this.db.find(item => item.id === parseInt(id));
    }

    getObject(column,id){
        const datas =  this.db.find(item => item.id === parseInt(id) && item[column]);
        return datas[column];
    }

    create(model) {
        console.log(model);
        model.id = this.db.length;
        this.db.push(model);
        db[this.model].push(model);
        return model;
    }

    update(id, updatedModel) {
        const index = this.db.findIndex(item => item.id === parseInt(id));
        if (index === -1) return null;
        this.db[index] = { ...this.db[index], ...updatedModel };
        return this.db[index];
    }

    delete(id) {
        const index = this.db.findIndex(item => item.id === parseInt(id));
        if (index === -1) return null;
        this.db.splice(index, 1);
        return this.db;
    }

}
