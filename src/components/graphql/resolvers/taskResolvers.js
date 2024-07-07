const { projects,parts} = require("../data.js");
const _ = require('lodash');
const db = require("../../../models");
const logger = require("../../../modules/logger");


const resolver = {
  Query: {
    tasks: async () => {
      try {
        const results = await db.sequelize.query("CALL retrieve_all_tasks()");
        logger.info("task RESULTS: " + JSON.stringify(results));
        
        return results;
      } catch (error) {
        logger.error("Unable to retrieve_all_tasks:", JSON.stringify(error));
        return error;
      }
    },
    task: async (root, {id})  => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_task(${id})`);
        logger.info("task RESULTS: " + JSON.stringify(results));
        if (results) {
          return {
            __typename: "Task",
            ...results[0],
          };
        } else  {
          return {
            __typename: "ErrorResults",
            errorID:13,
            errorMessage: `Task with id of ${id} does not exist.`,
          }
        }
      } 
      catch (error) {
          return {
            __typename: "ErrorResults",
            errorID:13,
            errorMessage: `Task with id of ${id} does not exist.`,
          }
      }
    },
  },
  Task: {
    parts: async (task) => {
      try {
        const results = await db.sequelize.query(
          `CALL retrieve_task_parts(${task.id})`
        );
        return results;
      } catch (error) {
        logger.error("Unable to retrieve_task_parts:", JSON.stringify(error));
        return error;
      }
    },
    notes: async (project) => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_task_notes(${task.id})`);
        return results;
      } catch(error) {
        logger.error("Unable to retrieve_task_notes:", JSON.stringify(error));
        return error;
      }
    }
  },
  Mutation: {
    createTask: async (root, {projectID,taskName,taskDescription,taskStatus,taskComplete}) => {
      try {
        logger.info(`createTask args: ${projectID}, ${taskName}, ${taskDescription}, ${taskStatus}, ${taskComplete}`);
        const results = await db.sequelize.query(`CALL create_task(${projectID}, '${taskName}','${taskDescription}',${taskStatus},${taskComplete})`);
        logger.info("createTask results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        logger.error("Unable to createTask:", JSON.stringify(error));
        return error;
      }
    },
    updateTask: async (root, {taskID,taskName,taskDescription,taskStatus,taskComplete}) => {
      try {
        logger.info(`updateTask args: ${taskID}, ${taskName}, ${taskDescription}, ${taskStatus}, ${taskComplete}`);
        const results = await db.sequelize.query(`CALL update_task(${taskID}, '${taskName}','${taskDescription}',${taskStatus},${taskComplete})`);
        logger.info("updateTask results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        logger.error("Unable to updateTask:", JSON.stringify(error));
        return error;
      }
    },
    updateTaskComplete: async (root, {taskID,taskComplete}) => {
      try {
        logger.info(`updateTaskComplete args: ${taskID}, ${taskComplete}`);
        const results = await db.sequelize.query(`CALL update_task_complete(${taskID},${taskComplete})`);
        logger.info("updateTaskComplete results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        logger.error("Unable to updateTaskComplete:", JSON.stringify(error));
        return error;
      }
    },
    updateTaskStatus: async (root, {taskID,taskStatus}) => {
      try {
        logger.info(`updateTaskComplete args: ${taskID}, ${taskStatus}`);
        const results = await db.sequelize.query(`CALL update_task_status(${taskID},${taskStatus})`);
        logger.info("updateTaskStatus results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        logger.error("Unable to updateTaskStatus:", JSON.stringify(error));
        return error;
      }
    },
    deleteTask: async (root, {taskID}) => {
      try {
        logger.info(`deleteTask args: ${taskID}`);
        const results = await db.sequelize.query(
          `CALL delete_task(${taskID})`
        );
        return results[0];
      } catch (error) {
        logger.error(`deleteTask error: ${error}`)
        return error;
      }
    },
    removeTaskFromProject: async (root, {projectID, taskID}) => {
      try {
        logger.info(`removeTaskFromProject args: ${projectID}, ${taskID}`);
        const results = await db.sequelize.query(
          `CALL remove_task_from_project(${projectID}, ${taskID})`
        );
        return results[0];
      } catch (error) {
        logger.error(`removeTaskFromProject error: ${error}`)
        return error;
      }
    },
    associateTaskWithProject: async (root, {projectID, taskID}) => {
      try {
        logger.info(`associateTaskWithProject args: ${projectID}, ${taskID}`);
        const results = await db.sequelize.query(
          `CALL associate_task_with_project(${projectID}, ${taskID})`
        );
        return results[0];
      } catch (error) {
        logger.error(`associateTaskWithProject error: ${error}`)
        return error;
      }
    }

  }
}

module.exports = {resolver};