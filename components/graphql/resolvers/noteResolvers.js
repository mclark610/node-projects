const { projects,notes} = require("../data.js");
const _ = require('lodash');
const db = require("../../../models");
const logger = require("../../../modules/logger");

const resolver = {
  Query: {
    notes: async () => {
      try {
        const results = await db.sequelize.query("CALL retrieve_all_notes()");
        //logger.info("NOTES RESULTS: " + JSON.stringify(results));
        
        return results;
      } catch (error) {
        logger.error("Unable to retrieve_all_notes:", JSON.stringify(error));
        return error;
      }
    },
    note: async (root, {id})  => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_note(${id})`);
        logger.info("NOTE RESULTS: " + JSON.stringify(results));
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
        logger.info(`createNote args: ${noteName}, ${noteDescription}, ${noteImageFilename}, ${noteDocFilename}, ${noteStatus}`);
        const results = await db.sequelize.query(`CALL create_note('${noteName}','${noteDescription}','${noteImageFilename}', '${noteDocFilename}',${noteStatus})`);
        logger.info("createNote results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        logger.error("Unable to createNote:", JSON.stringify(error));
        return error;
      }
    },
    updateNote: async (root, {noteID,noteName,noteDescription,noteImageFilename, noteDocFilename, noteStatus}) => {
      try {
        logger.info(`updateNote args: ${noteID}, ${noteName}, ${noteDescription}, ${noteImageFilename}, ${noteDocFilename}, ${noteStatus}`);
        const results = await db.sequelize.query(`CALL update_note(${noteID}, '${noteName}','${noteDescription}','${noteImageFilename}', '${noteDocFilename}',${noteStatus})`);
        logger.info("updateNote results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        logger.error("Unable to updateNote:", JSON.stringify(error));
        return error;
      }
    },
    updateNoteStatus: async (root, {noteID,noteStatus}) => {
      try {
        logger.info(`updateNoteStatus args: ${noteID}, ${noteStatus}`);
        const results = await db.sequelize.query(`CALL update_note_status(${noteID},${noteStatus})`);
        logger.info("updateNoteStatus results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        logger.error("Unable to updateNoteStatus:", JSON.stringify(error));
        return error;
      }
    },
    deleteNote: async (root, {noteID}) => {
      try {
        logger.info(`deleteNote args: ${noteID}`);
        const results = await db.sequelize.query(`CALL delete_note(${noteID})`);
        logger.info("deleteNote results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        logger.error("Unable to deleteNote:", JSON.stringify(error));
        return error;
      }
    },

  },
}

module.exports = {resolver};