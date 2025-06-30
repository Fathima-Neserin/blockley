// registerBlocks.js
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

// Define dynamic places block
export const defineDynamicPlaceBlock = (options) => {
  Blockly.Blocks["dynamic_places"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("Choose")
        .appendField(new Blockly.FieldDropdown(() => options), "CHOICE");
      this.setOutput(true, null);
      this.setColour(230);
      this.setTooltip("Select a place you want to visit");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["dynamic_places"] = function (block) {
    const choice = block.getFieldValue("CHOICE");
    return [`"${choice}"`, javascriptGenerator.ORDER_ATOMIC];
  };
};

// Define dynamic API block
export const defineDynamicApiBlock = (options) => {
  Blockly.Blocks["dynamic_apis"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("API")
        .appendField(new Blockly.FieldDropdown(() => options), "API_CHOICE");
      this.setOutput(true, null);
      this.setColour(180);
      this.setTooltip("Select an API endpoint");
      this.setHelpUrl("");
    },
  };

  javascriptGenerator.forBlock["dynamic_apis"] = function (block) {
    const choice = block.getFieldValue("API_CHOICE");
    return [`"${choice}"`, javascriptGenerator.ORDER_ATOMIC];
  };
};
