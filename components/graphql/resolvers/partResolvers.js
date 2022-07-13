const { projects,parts} = require("../data.js");
const _ = require('lodash');

const resolver = {
  Query: {
    parts: () => parts,
    part: (root, { id }) => _.find(parts, { id }),
    part2: (root, {id})  => {
      const results = _.find(parts, {id});
//      console.log("author2 results: " + JSON.stringify(results));
      if (results) {
        return {
          __typename: "Part",
          ...results,
        };
      } 
      return {
        __typename: "ErrorResults",
        errorID:13,
        errorMessage: `Part with id of ${id} does not exist.`,
      }
    }
  },
}

module.exports = {resolver};