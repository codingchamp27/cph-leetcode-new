import * as vscode from 'vscode';
import { fetchProblem } from './fetchProblemURL';
import { storeTestCases } from './storeTestCases';
import { createBoilerplateFile } from './boilerplateCreator';
import { executeCode } from './codeExecutor';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('cph-leetcode-new.fetchTestCases', async () => {
            try {
                // Check if a workspace folder is open
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders || workspaceFolders.length === 0) {
                    vscode.window.showErrorMessage('Please open a workspace folder to store test cases and boilerplate.');
                    return;
                }
                const workspacePath = workspaceFolders[0].uri.fsPath;

                // Fetch problem URL
                const url = await vscode.window.showInputBox({
                    prompt: 'Enter LeetCode problem URL',
                    ignoreFocusOut: true,
                });

                if (!url || !isValidURL(url)) {
                    vscode.window.showErrorMessage('A valid LeetCode problem URL is required.');
                    return;
                }

                // Fetch test cases
                const testCases = await fetchProblem(url);
                if (!testCases) {
                    vscode.window.showErrorMessage('Failed to fetch test cases. Ensure the URL is correct.');
                    return;
                }

                // Select programming language
                const language = await vscode.window.showQuickPick(['Python', 'Cpp'], {
                    placeHolder: 'Select the programming language for the solution',
                    ignoreFocusOut: true,
                });

                if (!language) {
                    vscode.window.showErrorMessage('Programming language selection is required.');
                    return;
                }

                // Store test cases and create boilerplate
                await storeTestCases(testCases.inputs, testCases.outputs, workspacePath);
                const boilerplateFilePath = await createBoilerplateFile(language as 'Python' | 'Cpp', workspacePath);

                // Open the boilerplate file in the editor
                const document = await vscode.workspace.openTextDocument(boilerplateFilePath);
                await vscode.window.showTextDocument(document);

                vscode.window.showInformationMessage(
                    `Boilerplate file created at ${boilerplateFilePath}. Test cases successfully stored!`
                );
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Error: ${error.message}`);
                    console.error("Error:", error.message);
                } else {
                    vscode.window.showErrorMessage('An unknown error occurred.');
                    console.error("Unknown error:", error);
                }
            }
        }),

        vscode.commands.registerCommand('cph-leetcode-new.runTestCases', async () => {
            try {
                // Check if a workspace folder is open
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders || workspaceFolders.length === 0) {
                    vscode.window.showErrorMessage('Please open a workspace folder to execute test cases.');
                    return;
                }
                const workspacePath = workspaceFolders[0].uri.fsPath;

                // Select programming language
                const language = await vscode.window.showQuickPick(['Python', 'Cpp'], {
                    placeHolder: 'Select the programming language for the solution to execute',
                    ignoreFocusOut: true,
                });

                if (!language) {
                    vscode.window.showErrorMessage('Programming language selection is required.');
                    return;
                }

                // Execute test cases
                await executeCode(language as 'Python' | 'Cpp', workspacePath);
            } catch (error) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(`Error: ${error.message}`);
                    console.error("Error:", error.message);
                } else {
                    vscode.window.showErrorMessage('An unknown error occurred.');
                    console.error("Unknown error:", error);
                }
            }
        })
    );
}

export function deactivate() {}

// Utility function to validate URLs
function isValidURL(url: string): boolean {
    try {
        new URL(url);
        return url.startsWith('https://leetcode.com/problems/');
    } catch {
        return false;
    }
}
