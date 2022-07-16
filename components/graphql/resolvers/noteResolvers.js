const { projects,notes} = require("../data.js");
const _ = require('lodash');
const db = require("../../../models");


const resolver = {
  Query: {
    notes: async () => {
      try {
        const results = await db.sequelize.query("CALL retrieve_all_notes()");
        //console.log("NOTES RESULTS: " + JSON.stringify(results));
        
        return results;
      } catch (error) {
        console.error("Unable to retrieve_all_notes:", JSON.stringify(error));
        return error;
      }
    },
    note: async (root, {id})  => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_note(${id})`);
        console.log("NOTE RESULTS: " + JSON.stringify(results));
        if (results) {
          return {
            __typename: "Note",
            ...results[0],
          };
        } else  {
          return {
            __typename: "ErrorResults",
            errorID:13,
            errorMessage: `Note with id of ${id} does not exist.`,
          }
        }
      } 
      catch (error) {
          return {
            __typename: "ErrorResults",
            errorID:13,
            errorMessage: `Note with id of ${id} does not exist.`,
          }
      }
    },
  },
}

module.exports = {resolver};