const { projects, parts, project_part } = require("../data.js");
const _ = require("lodash");
const db = require("../../../models");

const resolver = {
  Query: {
    projects: async () => {
      try {
        const results = await db.sequelize.query("CALL retrieve_all_projects()");
        console.log("PROJECT RESULTS: " + JSON.stringify(results));
        return results;
      } catch (error) {
        console.error("Unable to retrieve_projects:", JSON.stringify(error));
        return error;
      }
    },

    project: async (root, { id }) => {
      try {
        const results = await db.sequelize.query(
          `CALL retrieve_project(${id})`
        );
        if (results[0]) {
          return {
            __typename: "Project",
            ...results[0],
          };
        } else {
          return {
            __typename: "ErrorResults",
            errorID: 13,
            errorMessage: `Project with id of ${id} does not exist.`,
          };
        }
      } catch (error) {
        console.error("Unable to retrieve_project:", JSON.stringify(error));
        return {
          __typename: "ErrorResults",
          errorID: 13,
          errorMessage: `${error}`,
        };
      }
    },
  },

  Project: {
    part: async (project) => {
      try {
        const results = await db.sequelize.query(
          `CALL retrieve_part(${project.part_id})`
        );
        return results[0];
      } catch (error) {
        console.error("Unable to retrieve_part:", JSON.stringify(error));
        return error;
      }
    },
    parts: async (project) => {
      try {
        const results = await db.sequelize.query(
          `CALL retrieve_project_parts(${project.part_id})`
        );
        return results;
      } catch (error) {
        console.error("Unable to retrieve_part:", JSON.stringify(error));
        return error;
      }
    },
    tasks: async (project) => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_project_tasks(${project.id})`);
        return results;
      } catch(error) {
        console.error("Unable to retrieve_part:", JSON.stringify(error));
        return error;
      }
    },
    notes: async (project) => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_project_notes(${project.id})`);
        return results;
      } catch(error) {
        console.error("Unable to retrieve_part:", JSON.stringify(error));
        return error;
      }
    }
  },

  Mutation: {
    createProject: async (root, {projectName,projectDescription,projectPartNumber,projectStatus,projectPrice,projectVendor,projectImageFile,projectNoteFile}) => {
      try {
        console.log(`createProject args: ${projectName}, ${projectDescription}, ${projectPartNumber}, ${projectStatus}, ${projectPrice},${projectVendor},${projectImageFile},${projectNoteFile}`);
        const results = await db.sequelize.query(`CALL create_project('${projectName}','${projectDescription}','${projectPartNumber}',${projectStatus},${projectPrice},'${projectVendor}','${projectImageFile}','${projectNoteFile}')`);
        console.log("createProject results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to createProject:", JSON.stringify(error));
        return error;
      }
    }
  }

};


module.exports = { resolver };
