const { projects, parts, project_part } = require("../data.js");
const _ = require("lodash");

const resolver = {
  Query: {
    projects: () => projects,
    project: (root, { id }) => _.find(projects, { id }),
    project2: (root, { id }) => {
      const results = _.find(projects, { id });
      //      console.log("author2 results: " + JSON.stringify(results));
      if (results) {
        return {
          __typename: "Project",
          ...results,
        };
      }
      return {
        __typename: "ErrorResults",
        errorID: 13,
        errorMessage: `Project with id of ${id} does not exist.`,
      };
    },
  },

  Project: {
    //    part: project => _.find(parts,{id: project.part_id}),
    part: (project) => {
      const test = _.find(parts, { id: project.part_id });
      console.log("project id: " + project.id);
      console.log("part_id   : " + project.part_id);
      console.log("test: " + JSON.stringify(test));
      return test;
    },
    parts: (project) => {
      const output = new Array();
      const project_parts = _.filter(project_part, { project_id: project.id });
      _.forEach(project_parts, (proj_part) => {
        let obj = _.find(parts, { id: proj_part.part_id });
        if (obj) {
          output.push(obj);
        }
      });
      return output;
    },
  },
};

module.exports = { resolver };
