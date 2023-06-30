const { projects, parts, project_part } = require("../data.js");
const _ = require("lodash");
const db = require("../../../models");
const logger = require("../../../modules/logger");

const resolver = {
  Query: {
    projects: async () => {
      try {
        const results = await db.sequelize.query(
          "CALL retrieve_all_projects()"
        );
        logger.info("PROJECT RESULTS: " + JSON.stringify(results));
        return results;
      } catch (error) {
        logger.error("Unable to retrieve_projects:", JSON.stringify(error));
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
        logger.error("Unable to retrieve_project:", JSON.stringify(error));
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
        logger.error("Unable to retrieve_part:", JSON.stringify(error));
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
        logger.error("Unable to retrieve_part:", JSON.stringify(error));
        return error;
      }
    },
    tasks: async (project) => {
      try {
        const results = await db.sequelize.query(
          `CALL retrieve_project_tasks(${project.id})`
        );
        return results;
      } catch (error) {
        logger.error("Unable to retrieve_part:", JSON.stringify(error));
        return error;
      }
    },
    notes: async (project) => {
      try {
        const results = await db.sequelize.query(
          `CALL retrieve_project_notes(${project.id})`
        );
        return results;
      } catch (error) {
        logger.error("Unable to retrieve_part:", JSON.stringify(error));
        return error;
      }
    },
  },

  Mutation: {
    createProject: async (
      root,
      {
        projectName,
        projectDescription,
        projectPartNumber,
        projectStatus,
        projectPrice,
        projectVendor,
        projectImageFile,
        projectNoteFile,
      }
    ) => {
      try {
        logger.info(
          `createProject args: ${projectName}, ${projectDescription}, ${projectPartNumber}, ${projectStatus}, ${projectPrice},${projectVendor},${projectImageFile},${projectNoteFile}`
        );
        const results = await db.sequelize.query(
          `CALL create_project('${projectName}','${projectDescription}','${projectPartNumber}',${projectStatus},${projectPrice},'${projectVendor}','${projectImageFile}','${projectNoteFile}')`
        );
        logger.info("createProject results: " + JSON.stringify(results));
        return results[0];
      } catch (error) {
        logger.error("Unable to createProject:", JSON.stringify(error));
        return error;
      }
    },
    updateProject: async (
      root,
      {
        projectID,
        partID,
        projectName,
        projectDescription,
        projectPartNumber,
        projectStatus,
        projectComplete,
        projectPrice,
        projectVendor,
        projectImageFilename,
        projectDocFilename,
      }
    ) => {
      logger.info(
        `updateProject args: ${projectID},${partID}, ${projectName}, ${projectDescription}, ${projectPartNumber}, ${projectStatus}, ${projectComplete},${projectPrice},${projectVendor},${projectImageFilename},${projectDocFilename}`
      );
      try {
        const results = await db.sequelize.query(
          `CALL update_project(${projectID},${partID},'${projectName}','${projectDescription}','${projectPartNumber}',${projectStatus},${projectComplete}, ${projectPrice},'${projectVendor}','${projectImageFilename}','${projectDocFilename}')`
          );
        logger.info("updateProject results: " + JSON.stringify(results));
        return results[0];
      } catch (error) {
        logger.error("Unable to updateProject:", JSON.stringify(error));
        return error;
      }
    },
    updateProjectStatus: async (root, { projectID, projectStatus }) => {
      try {
        logger.info(`updateProjectStatus args: ${projectID}, ${projectStatus}`);
        const results = await db.sequelize.query(
          `CALL update_project_status(${projectID},${projectStatus})`
        );
        logger.info("updateProjectStatus results: " + JSON.stringify(results));
        return results[0];
      } catch (error) {
        logger.error("Unable to updateProjectStatus:", JSON.stringify(error));
        return error;
      }
    },
    updateProjectComplete: async (root, { projectID, projectComplete }) => {
      try {
        logger.info(`updateProjectStatus args: ${projectID}, ${projectComplete}`);
        const results = await db.sequelize.query(
          `CALL update_project_status(${projectID},${projectComplete})`
        );
        logger.info("updateProjectStatus results: " + JSON.stringify(results));
        return results[0];
      } catch (error) {
        logger.error("Unable to updateProjectComplete:", JSON.stringify(error));
        return error;
      }
    },
    deleteProject: async (root, {projectID}) => {
      try {
        logger.info(`deleteProject args: ${projectID}`);
        const results = await db.sequelize.query(
          `CALL delete_project(${projectID})`
        );
        return results[0];
      } catch (error) {
        logger.error(`deleteProject error: ${error}`)
        return error;
      }
    },

  },
};

module.exports = { resolver };
