import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { defineDynamicPlaceBlock, defineDynamicApiBlock } from "../blocks/registerBlocks";
import "blockly/blocks";
import "blockly/javascript";
import "blockly/python";
import CodeViewer from "./CodeViewer"; // optional UI for showing generated code

// Initial place options
const placeOptions = [
  ["Chennai", "CHENNAI"],
  ["Mumbai", "MUMBAI"],
  ["Banglore", "BANGLORE"],
  ["New_Delhi", "NEW_DELHI"],
  ["Cochin", "COCHIN"]
];

const apiOptions = [
  ["GET /users", "GET_USERS"],
  ["POST /login", "POST_LOGIN"],
  ["PUT /update", "PUT_UPDATE"],
  ["DELETE /account", "DELETE_ACCOUNT"],
];
const BlocklyComponent = () => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  let workspace = useRef(null);

  const [generatedCode, setGeneratedCode] = useState("");
  const [dropDownOptions, setDropDownOptions] = useState(placeOptions);

  // 💡 Create custom dynamic dropdown block with places
  const defineDynamicPlaceBlock = (options) => {
    // Register block definition
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

    // Generator code (outputs selected place as a string)
    javascriptGenerator.forBlock["dynamic_places"] = function (block) {
      const choice = block.getFieldValue("CHOICE");
      return [`"${choice}"`, javascriptGenerator.ORDER_ATOMIC];
    };
  };

   useEffect(() => {
    if (!Blockly.Blocks["dynamic_places"]) {
      defineDynamicPlaceBlock(dropDownOptions);
    }
    if (!Blockly.Blocks["dynamic_apis"]) {
      defineDynamicApiBlock(apiOptions);
    }

    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
    });
  }, []);

  // 🛠 Generate JS code
  const generateCode = () => {
    const code = javascriptGenerator.workspaceToCode(workspace.current);
    console.log("Generated Code", code);
    setGeneratedCode(code || "No code generated");
    alert("code generated");
  };

  // 💾 Save blocks to localStorage
  const saveBlocks = () => {
    const json = Blockly.serialization.workspaces.save(workspace.current);
    const jsonText = JSON.stringify(json);
    localStorage.setItem("blockly_workspace", jsonText);
    alert("Blocks saved");
  };

  // 🔁 Load blocks from localStorage
  const loadBlocks = () => {
    const jsonText = localStorage.getItem("blockly_workspace");
    if (jsonText) {
      const json = JSON.parse(jsonText);
      Blockly.serialization.workspaces.load(json, workspace.current);

      // Center the view
      Blockly.svgResize(workspace.current);
      workspace.current.scrollCenter();

      alert("Blocks Loaded");
    } else {
      alert("No saved blocks found");
    }
  };

  return (
    <>
      {/* Buttons */}
      <div style={{ margin: "15px" }}>
        <button style={{ marginLeft: "10px" }} onClick={generateCode}>
          Generate Code
        </button>
        <button style={{ marginLeft: "10px" }} onClick={saveBlocks}>
          Save Blocks
        </button>
        <button style={{ marginLeft: "10px" }} onClick={loadBlocks}>
          Load Blocks
        </button>
      </div>

      {/* Toolbox Definition */}
      <xml
        xmlns="https://developers.google.com/blockly/xml"
        ref={toolbox}
        style={{ display: "none" }}
      >
        <category name="Logic" colour="210">
          <block type="controls_if"></block>
          <block type="logic_compare"></block>
        </category>
        <category name="Loops" colour="120">
          <block type="controls_repeat_ext"></block>
          <block type="controls_whileUntil"></block>
        </category>
        <category name="Loops 2" colour="110">
          <block type="controls_repeat"></block>
          <block type="controls_for"></block>
        </category>
        <category name="Math" colour="230">
          <block type="math_number"></block>
          <block type="math_arithmetic"></block>
        </category>
        <category name="Text" colour="160">
          <block type="text"></block>
          <block type="text_print"></block>
        </category>
        <category name="Places" colour="260">
          <block type="dynamic_places"></block>
        </category>
        <category name="APIs" colour="290">
          <block type="dynamic_apis" />
        </category>
      </xml>

      {/* Blockly Workspace */}
      <div
        ref={blocklyDiv}
        style={{ height: "80vh", width: "80vw", margin: 0, padding: 0 }}
      ></div>

      {/* Code Display */}
      <CodeViewer code={generatedCode} />
    </>
  );
};

export default BlocklyComponent;
