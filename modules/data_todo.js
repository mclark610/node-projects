const logger = require('../modules/logger');
const models = require( '../models');
const { todos, parts, notes } = models;

// manually tested: success
let insert = (body) => {
    return todos.create(body);
};

let fetch = (id) => {
    if (id) {
        return todos.findByPk(id, {
            include: [{
                model: parts,
                as: 'parts'
            },{
                model: notes,
                as: 'notes'
            }
            /*,{
                model: maintains,
                as: 'maintains'
            }*/],
        });
    }
    else {
        return todos.findAll({});
    }
};

// tested manually - works
let update = (body) => {
    return todos.update(body, {where: {"id": body["id"]}});
};

// tested manually without validation works
let deleteTodo = (id) => {
    return todos.findByPk(id);
};

module.exports = {
    insert,
    fetch,
    update,
    deleteTodo
};
