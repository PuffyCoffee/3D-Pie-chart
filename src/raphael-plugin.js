import { pie } from "./pie";

const Raphael = require("raphael");

export const createPlugin = () => {
  return Raphael.fn.pie = function(config) {
    pie(config, this);
  };
};
