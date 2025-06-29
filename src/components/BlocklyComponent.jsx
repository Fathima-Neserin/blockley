import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";
import "blockly/javascript";
import "blockly/python";
import CodeViewer from "./CodeViewer";
 
const BlocklyComponent = () => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  let workspace = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");

  useEffect(() => {
    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
    });
  }, []);

 const generateCode = () => {
  const topBlocks = workspace.current.getTopBlocks(false);
  console.log("Top Blocks:", topBlocks);

  const code = javascriptGenerator.workspaceToCode(workspace.current);
  console.log("Generated Code", code);
  // alert(code || "No code generated");
  setGeneratedCode(code || "No code generated")
};


  const saveBlocks = () => {
    const json = Blockly.serialization.workspaces.save(workspace.current);
    const jsonText = JSON.stringify(json)
    localStorage.setItem("blockly_workspace", jsonText);
    alert("Blocks saved");
  };

  const loadBlocks = () => {
    const jsonText = localStorage.getItem("blockly_workspace");
    if (jsonText) {
      const json = JSON.parse(jsonText);
      Blockly.serialization.workspaces.load(json, workspace.current);

          // Optional: Center the view after loading
    Blockly.svgResize(workspace.current);
    workspace.current.scrollCenter();

      alert("Blocks Loaded");
    } else {
      alert("No saved blocks found");
    }
  };

  return (
    <>
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

      <xml
        xmlns="https://developers.google.com/blockly/xml"
        ref={toolbox}
        style={{ display: "none" }}
      >
        <category name={"Logic"} colour={"210"}>
          <block type={"controls_if"}></block>
          <block type={"logic_compare"}></block>
        </category>
        <category name={"Loops"} colour={"120"}>
          <block type={"controls_repeat_ext"}></block>
          <block type={"controls_whileUntil"}></block>
        </category>
        <category name="Loops 2" colour="110">
          <block type="controls_repeat" />
          <block type="controls_for" />
        </category>
        <category name={"Math"} colour={"230"}>
          <block type={"math_number"}></block>
          <block type={"math_arithmetic"}></block>
        </category>
        <category name={"Text"} colour={"210"}>
          <block type={"text"}></block>
          <block type={"text_print"}></block>
        </category>
      </xml>

      <div
        ref={blocklyDiv}
        style={{ height: "80vh", width: "80vw", margin: 0, padding: 0 }}
      ></div>
      <CodeViewer code={generatedCode}/>
    </>
  );
};

export default BlocklyComponent;
