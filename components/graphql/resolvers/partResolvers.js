const { projects,parts} = require("../data.js");
const _ = require('lodash');
const db = require("../../../models");


const resolver = {
  Query: {
    parts: async () => {
      try {
        const results = await db.sequelize.query("CALL retrieve_all_parts()");
        console.log("PART RESULTS: " + JSON.stringify(results));
        
        return results;
      } catch (error) {
        console.error("Unable to retrieve_all_parts:", JSON.stringify(error));
        return error;
      }
    },
    part: async (root, {id})  => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_part(${id})`);
        console.log("PART RESULTS: " + JSON.stringify(results));
        if (results) {
          return {
            __typename: "Part",
            ...results[0],
          };
        } else  {
          return {
            __typename: "ErrorResults",
            errorID:13,
            errorMessage: `Part with id of ${id} does not exist.`,
          }
        }
      } 
      catch (error) {
          return {
            __typename: "ErrorResults",
            errorID:13,
            errorMessage: `Part with id of ${id} does not exist.`,
          }
      }
    },
  },
  Mutation: {
    createPart: async (root, {projectID,partName,partDescription,partNumber,partStatus,partPrice,partVendor,partImageFile,partNoteFile}) => {
      try {
        console.log(`createProject args: ${projectID},${partName}, ${partDescription}, ${partNumber}, ${partStatus}, ${partPrice},${partVendor},${partImageFile},${partNoteFile}`);
        const results = await db.sequelize.query(`CALL create_part(${projectID},'${partName}','${partDescription}','${partNumber}',${partStatus},${partPrice},'${partVendor}','${partImageFile}','${partNoteFile}')`);
        console.log("createPart results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to createPart:", JSON.stringify(error));
        return error;
      }
    },
    createDocForPart: async (root, {partID,docFilename}) => {
      try {
        console.log(`createDocForPart args: ${partID},${docFilename}`);
        const results = await db.sequelize.query(`CALL create_doc_for_part(${partID},'${docFilename}')`);
        console.log("createDocForPart results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to createDocForPart:", JSON.stringify(error));
        return error;
      }
    },
    createImageForPart: async (root, {partID,imageFilename}) => {
      try {
        console.log(`createImageForPart args: ${partID},${imageFilename}`);
        const results = await db.sequelize.query(`CALL create_image_for_part(${partID},'${imageFilename}')`);
        console.log("createImageForPart results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to createImageForPart:", JSON.stringify(error));
        return error;
      }
    },
    updatePart: async (root, {partID,partName,partDescription,partNumber,partStatus,partPrice,partVendor,partImageFilename,partDocFilename}) => {
        console.log(`updatePart args: ${partID},${partName}, ${partDescription}, ${partNumber}, ${partStatus}, ${partPrice},${partVendor},${partImageFilename},${partDocFilename}`);
        try {
          const results = await db.sequelize.query(`CALL update_part(${partID},'${partName}','${partDescription}','${partNumber}',${partPrice},'${partVendor}',${partStatus},'${partImageFilename}','${partDocFilename}')`);
          console.log("updatePart results: " + JSON.stringify(results));
          return results[0];
      } catch(error) {
          console.error("Unable to updatePart:", JSON.stringify(error));
          return error;
      }
    },
    updatePartStatus: async (root, {partID,partStatus}) => {
      try {
        console.log(`updatePartStatus args: ${partID}, ${partStatus}`);
        const results = await db.sequelize.query(`CALL update_part_status(${partID},${partStatus})`);
        console.log("updatePartStatus results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to updatePartStatus:", JSON.stringify(error));
        return error;
      }
    },
    deletePart: async (root, {partID}) => {
      try {
        console.log(`deletePart args: ${partID}`);
        const results = await db.sequelize.query(`CALL delete_part(${partID})`);
        console.log("deletePart results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to deletePart:", JSON.stringify(error));
        return error;
      }
    },
    removePartFromProject: async (root, {projectID, partID}) => {
      try {
        console.log(`removePartFromProject args: ${projectID}`);
        const results = await db.sequelize.query(`CALL remove_part_from_project(${projectID}, ${partID})`);
        console.log("removePartFromProject results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to removePartFromProject:", JSON.stringify(error));
        return error;
      }
    },
    associatePartWithProject: async (root, {projectID,partID}) => {
      try {
        console.log(`associatePartWithProject args: ${projectID}`);
        const results = await db.sequelize.query(`CALL associate_part_with_project(${projectID}, ${partID})`);
        console.log("associatePartWithProject results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to associatePartWithProject:", JSON.stringify(error));
        return error;
      }
    }, 
    associatePartWithTask: async (root, {taskID,partID}) => {
      try {
        console.log(`associatePartWithTask args: ${projectID}`);
        const results = await db.sequelize.query(`CALL associate_part_with_task(${projectID}, ${taskID})`);
        console.log("associatePartWithTask results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to associatePartWithTask:", JSON.stringify(error));
        return error;
      }
    } 
  



  }

}

module.exports = {resolver};