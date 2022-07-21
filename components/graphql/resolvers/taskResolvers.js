const { projects,parts} = require("../data.js");
const _ = require('lodash');
const db = require("../../../models");


const resolver = {
  Query: {
    tasks: async () => {
      try {
        const results = await db.sequelize.query("CALL retrieve_all_tasks()");
        console.log("task RESULTS: " + JSON.stringify(results));
        
        return results;
      } catch (error) {
        console.error("Unable to retrieve_all_tasks:", JSON.stringify(error));
        return error;
      }
    },
    task: async (root, {id})  => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_task(${id})`);
        console.log("task RESULTS: " + JSON.stringify(results));
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
        console.error("Unable to retrieve_task_parts:", JSON.stringify(error));
        return error;
      }
    },
    notes: async (project) => {
      try {
        const results = await db.sequelize.query(`CALL retrieve_task_notes(${task.id})`);
        return results;
      } catch(error) {
        console.error("Unable to retrieve_task_notes:", JSON.stringify(error));
        return error;
      }
    }
  },
  Mutation: {
    createTask: async (root, {projectID,taskName,taskDescription,taskStatus,taskComplete}) => {
      try {
        console.log(`createTask args: ${projectID}, ${taskName}, ${taskDescription}, ${taskStatus}, ${taskComplete}`);
        const results = await db.sequelize.query(`CALL create_task(${projectID}, '${taskName}','${taskDescription}',${taskStatus},${taskComplete})`);
        console.log("createTask results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to createTask:", JSON.stringify(error));
        return error;
      }
    },
    updateTask: async (root, {taskID,taskName,taskDescription,taskStatus,taskComplete}) => {
      try {
        console.log(`updateTask args: ${taskID}, ${taskName}, ${taskDescription}, ${taskStatus}, ${taskComplete}`);
        const results = await db.sequelize.query(`CALL update_task(${taskID}, '${taskName}','${taskDescription}',${taskStatus},${taskComplete})`);
        console.log("updateTask results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to updateTask:", JSON.stringify(error));
        return error;
      }
    },
    updateTaskComplete: async (root, {taskID,taskComplete}) => {
      try {
        console.log(`updateTaskComplete args: ${taskID}, ${taskComplete}`);
        const results = await db.sequelize.query(`CALL update_task_complete(${taskID},${taskComplete})`);
        console.log("updateTaskComplete results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to updateTaskComplete:", JSON.stringify(error));
        return error;
      }
    },
    updateTaskStatus: async (root, {taskID,taskStatus}) => {
      try {
        console.log(`updateTaskComplete args: ${taskID}, ${taskStatus}`);
        const results = await db.sequelize.query(`CALL update_task_status(${taskID},${taskStatus})`);
        console.log("updateTaskStatus results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to updateTaskStatus:", JSON.stringify(error));
        return error;
      }
    },
    deleteTask: async (root, {taskID}) => {
      try {
        console.log(`deleteTask args: ${taskID}`);
        const results = await db.sequelize.query(
          `CALL delete_task(${taskID})`
        );
        return results[0];
      } catch (error) {
        console.error(`deleteTask error: ${error}`)
        return error;
      }
    },
    removeTaskFromProject: async (root, {projectID, taskID}) => {
      try {
        console.log(`removeTaskFromProject args: ${projectID}, ${taskID}`);
        const results = await db.sequelize.query(
          `CALL remove_task_from_project(${projectID}, ${taskID})`
        );
        return results[0];
      } catch (error) {
        console.error(`removeTaskFromProject error: ${error}`)
        return error;
      }
    },
    associateTaskWithProject: async (root, {projectID, taskID}) => {
      try {
        console.log(`associateTaskWithProject args: ${projectID}, ${taskID}`);
        const results = await db.sequelize.query(
          `CALL associate_task_with_project(${projectID}, ${taskID})`
        );
        return results[0];
      } catch (error) {
        console.error(`associateTaskWithProject error: ${error}`)
        return error;
      }
    }

  }
}

module.exports = {resolver};