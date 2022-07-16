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
        console.log(`createProject args: ${projectID}, ${taskName}, ${taskDescription}, ${taskStatus}, ${taskComplete}`);
        const results = await db.sequelize.query(`CALL create_task(${projectID}, '${taskName}','${taskDescription}',${taskStatus},${taskComplete})`);
        console.log("createTask results: " + JSON.stringify(results));
        return results[0];
      } catch(error) {
        console.error("Unable to createTask:", JSON.stringify(error));
        return error;
      }
    }
  }
}

module.exports = {resolver};