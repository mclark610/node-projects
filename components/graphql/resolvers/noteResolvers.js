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
  Mutation: {
    createNote: async (root, {noteName,noteDescription,noteImageFilename, noteDocFilename, noteStatus}) => {
      try {
        console.log(`createNote args: ${noteName}, ${noteDescription}, ${noteImageFilename}, ${noteDocFilename}, ${noteStatus}`);
        const results = await db.sequelize.query(`CALL create_note('${noteName}','${noteDescription}','${noteImageFilename}', '${noteDocFilename}',${noteStatus})`);
        console.log("createNote results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to createNote:", JSON.stringify(error));
        return error;
      }
    },
    updateNote: async (root, {noteID,noteName,noteDescription,noteImageFilename, noteDocFilename, noteStatus}) => {
      try {
        console.log(`updateNote args: ${noteID}, ${noteName}, ${noteDescription}, ${noteImageFilename}, ${noteDocFilename}, ${noteStatus}`);
        const results = await db.sequelize.query(`CALL update_note(${noteID}, '${noteName}','${noteDescription}','${noteImageFilename}', '${noteDocFilename}',${noteStatus})`);
        console.log("updateNote results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to updateNote:", JSON.stringify(error));
        return error;
      }
    },
    updateNoteStatus: async (root, {noteID,noteStatus}) => {
      try {
        console.log(`updateNoteStatus args: ${noteID}, ${noteStatus}`);
        const results = await db.sequelize.query(`CALL update_note_status(${noteID},${noteStatus})`);
        console.log("updateNoteStatus results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to updateNoteStatus:", JSON.stringify(error));
        return error;
      }
    },

  },
}

module.exports = {resolver};