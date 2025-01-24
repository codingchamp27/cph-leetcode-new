import * as vscode from 'vscode';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

// Convert exec to a promise-based function for easier async/await usage
const execPromise = util.promisify(exec);

export const executeCode = async (
  language: 'Python' | 'Cpp',
  workspacePath: string
): Promise<void> => {
  try {
    const solutionFile = path.join(workspacePath, language === 'Python' ? 'solution.py' : 'solution.cpp');
    const inputsFiles = (await fs.readdir(workspacePath)).filter(file => file.startsWith('input') && file.endsWith('.txt'));
    const outputsFiles = (await fs.readdir(workspacePath)).filter(file => file.startsWith('output') && file.endsWith('.txt'));

    if (inputsFiles.length === 0 || outputsFiles.length === 0) {
      vscode.window.showErrorMessage('No test cases found in the workspace. Please fetch test cases first.');
      return;
    }

    if (inputsFiles.length !== outputsFiles.length) {
      vscode.window.showErrorMessage('Mismatch between the number of input and output files.');
      return;
    }

    // Check Python installation if language is Python
    if (language === 'Python') {
      try {
        await execPromise('python3 --version');
      } catch {
        vscode.window.showErrorMessage('Python is not installed or not added to PATH. Please install Python and try again.');
        return;
      }
    }

    const compileCommand = language === 'Cpp' ? `g++ -std=c++11 -o solution ${solutionFile}` : '';
    const runCommand = (inputFile: string) =>
      language === 'Python'
        ? `python3 "${solutionFile}" < "${inputFile}" || (cat "${inputFile}" | python3 "${solutionFile}")`
        : `./solution < "${inputFile}"`;

    if (language === 'Cpp') {
      // Compile the C++ file
      await execPromise(compileCommand, { cwd: workspacePath });
    }

    // Execute test cases
    for (let i = 0; i < inputsFiles.length; i++) {
      const inputFilePath = path.join(workspacePath, inputsFiles[i]);
      const expectedOutputPath = path.join(workspacePath, outputsFiles[i]);

      const inputContent = (await fs.readFile(inputFilePath, 'utf8')).trim();
      const expectedOutput = (await fs.readFile(expectedOutputPath, 'utf8')).trim();

      // Debug the command being executed
      console.log(`Running command: ${runCommand(inputFilePath)}`);

      const { stdout } = await execPromise(runCommand(inputFilePath), { cwd: workspacePath });
      const actualOutput = stdout.trim();

      if (actualOutput === expectedOutput) {
        vscode.window.showInformationMessage(`Test Case ${i + 1}: Passed ✅`);
      } else {
        vscode.window.showWarningMessage(
          `Test Case ${i + 1}: Failed ❌\nInput: ${inputContent}\nExpected: ${expectedOutput}\nGot: ${actualOutput}`
        );
      }
    }
  } catch (error: any) {
    console.error("Error executing code:", error.message);
    vscode.window.showErrorMessage(`Error executing code: ${error.message}`);
  }
};
