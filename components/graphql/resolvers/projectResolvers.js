const { projects,parts} = require("../data.js");
const _ = require('lodash');

const resolver = {
  Query: {
    projects: () => projects,
    project: (root, { id }) => _.find(project, { id }),
    project2: (root, {id})  => {
      const results = _.find(projects, {id});
//      console.log("author2 results: " + JSON.stringify(results));
      if (results) {
        return {
          __typename: "Project",
          ...results,
        };
      } 
      return {
        __typename: "ErrorResults",
        errorID:13,
        errorMessage: `Project with id of ${id} does not exist.`,
      }
    }
  },

  Project: {
    part: project => _.filter(parts,{part_id: project.part_id}),
  },
}

module.exports ={resolver};