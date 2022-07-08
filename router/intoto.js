'use strict';
/* intoto.js is messing with graphql using all tables
 *
 */

const express = require('express');
const router = express.Router();
const { graphqlHTTP } = require('express-graphql');
const logger = require('../modules/logger.js');

const Part = require('../modules/data_part');
const Project = require('../modules/data_project');
const Task = require('../modules/data_task');
const Note = require('../modules/data_note');

const graphql = require('graphql');
const graphqlDate = require('graphql-iso-date');
const cookieParser = require('cookie-parser');

// TODO: create /user/destroy to destroy session
// TODO: check if user authorized to perform user maintenance

router.use(cookieParser());

/*
let statusType = new graphql.GraphQLEnumType({
    name: 'status',
    values: {
        active: { value: 0},
        inactive: {value: 1}
    }
});
*/
var noteType = new graphql.GraphQLObjectType({
    name: 'Note',
    fields: {
        id:  {
            type: graphql.GraphQLInt,
        },
        name: {
            type: graphql.GraphQLString,
        },
        description: {
            type: graphql.GraphQLString,
        },
        image_filename:{
            type: graphql.GraphQLString,
        },
        doc_filename: {
            type: graphql.GraphQLString,
        },
        complete: {
            type: graphql.GraphQLBoolean,
        },
        status: {
            type: graphql.GraphQLString,
        },
        createdAt: {
            type: graphqlDate.GraphQLDateTime
        },
        updatedAt: {
            type: graphqlDate.GraphQLDateTime
        }
    }
});

var partType = new graphql.GraphQLObjectType({
    name: 'Part',
    fields: {
        id:  {
            type: graphql.GraphQLInt,
        },
        name: {
            type: graphql.GraphQLString,
        },
        part_nbr: {
            type: graphql.GraphQLString
        },
        price: {
            type: graphql.GraphQLFloat
        },
        description: {
            type: graphql.GraphQLString,
        },
        vendor: {
            type: graphql.GraphQLString,
        },
        image_filename:{
            type: graphql.GraphQLString,
        },
        doc_filename: {
            type: graphql.GraphQLString,
        },
        complete: {
            type: graphql.GraphQLBoolean,
        },
        status: {
            type: graphql.GraphQLString,
        },
        createdAt: {
            type: graphqlDate.GraphQLDateTime
        },
        updatedAt: {
            type: graphqlDate.GraphQLDateTime
        }
    }
});

var taskType = new graphql.GraphQLObjectType({
    name: 'Task',
    fields: {
        id:  {
            type: graphql.GraphQLInt,
        },
        maintainId: {
            type: graphql.GraphQLInt,
        },
        parts: {
            type: new graphql.GraphQLList(partType),
        },
        notes: {
            type: new graphql.GraphQLList(noteType),
        },
        name: {
            type: graphql.GraphQLString,
        },
        dueOnHour: {
            type: graphql.GraphQLInt
        },
        dueOnDate: {
            type: graphqlDate.GraphQLDateTime
        },
        description: {
            type: graphql.GraphQLString,
        },
        complete: {
            type: graphql.GraphQLBoolean,
        },
        status: {
            type: graphql.GraphQLString,
        },
        createdAt: {
            type: graphqlDate.GraphQLDateTime
        },
        updatedAt: {
            type: graphqlDate.GraphQLDateTime
        }
    }

});

var maintainType = new graphql.GraphQLObjectType({
    name: 'Project',
    fields: {
        id:  {
            type: graphql.GraphQLInt,
        },
        tasks: {
            type: new graphql.GraphQLList(taskType),
        },
        name: {
            type: graphql.GraphQLString,
        },
        part_nbr: {
            type: graphql.GraphQLString
        },
        description: {
            type: graphql.GraphQLString,
        },
        complete: {
            type: graphql.GraphQLBoolean,
        },
        status: {
            type: graphql.GraphQLString,
        },
        createdAt: {
            type: graphqlDate.GraphQLDateTime
        },
        updatedAt: {
            type: graphqlDate.GraphQLDateTime
        }
    }

});


let queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        part: {
            type: partType,
            args: {
                id: {
                    type: graphql.GraphQLInt
                }
            },
            resolve: function( _, id ) {
                return Part.fetch(id["id"]);
                //return fakeDatabase[id];
            }
        },
        parts: {
            type: new graphql.GraphQLList(partType),
            resolve: function() {
                return Part.fetch(undefined);
            }
        },
        task: {
            type: taskType,
            args: {
                id: {
                    type: graphql.GraphQLInt
                }
            },
            resolve: function( _, id ) {
                return Task.fetch(id["id"]);
                //return fakeDatabase[id];
            }
        },
        tasks: {
            type: new graphql.GraphQLList(taskType),
            resolve: function() {
                return Task.fetch(undefined);
            }
        },
        note: {
            type: noteType,
            args: {
                id: {
                    type: graphql.GraphQLInt
                }
            },
            resolve: function( _, id ) {
                return Note.fetch(id["id"]);
                //return fakeDatabase[id];
            }
        },
        notes: {
            type: new graphql.GraphQLList(noteType),
            resolve: function() {
                return Note.fetch(undefined);
            }
        },
        maintain: {
            type: maintainType,
            args: {
                id: {
                    type: graphql.GraphQLInt
                }
            },
            resolve: (_,id) => {
                return Project.fetch(id["id"]);
            },

        },
        maintains: {
            type: new graphql.GraphQLList(maintainType),
            resolve: () => {
                return Project.fetch(undefined);
            },

        }
    }
});

//logger.info("parts: " + JSON.stringify(fakeDatabase['a']));

router.use((req,res,next) => {
    // Check user is logged in.
    logger.info("toto use called");
    next();
});

router.get('/test',(req,res) => {
    logger.info("############################ toto/test called ##########################");
    Part.fetch(req.params["id"])
        .then((results) => {
            logger.info("results: " + JSON.stringify(results));
            res.send("toto/test called " + JSON.stringify(results));
        })
        .catch((err) => {
            logger.info("err: " + JSON.stringify(err));
            res.send("toto/test called " + JSON.stringify(err));
        });
});

let schema = new graphql.GraphQLSchema({
    query: queryType
});

router.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

module.exports = router;
