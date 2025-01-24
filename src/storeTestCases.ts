import * as vscode from 'vscode';
import fs from 'fs/promises';
import path from 'path';

export const storeTestCases = async (
  inputs: string[],
  outputs: string[],
  workspacePath: string
): Promise<void> => {
  try {
    if (inputs.length !== outputs.length) {
      vscode.window.showErrorMessage(
        "Mismatch between the number of inputs and outputs. Please check the test cases."
      );
      return;
    }

    for (let i = 0; i < inputs.length; i++) {
      const inputFilePath = path.join(workspacePath, `input${i + 1}.txt`);
      const outputFilePath = path.join(workspacePath, `output${i + 1}.txt`);

      // Write the input and output to separate files
      await fs.writeFile(inputFilePath, inputs[i], 'utf8');
      await fs.writeFile(outputFilePath, outputs[i], 'utf8');

      console.log(`Input written to ${inputFilePath}`);
      console.log(`Output written to ${outputFilePath}`);
    }

    vscode.window.showInformationMessage(
      `Test cases have been successfully written as separate input and output files in the workspace folder.`
    );
  } catch (error: any) {
    console.error("Error writing test cases:", error.message);
    vscode.window.showErrorMessage(`Error storing test cases: ${error.message}`);
  }
};
