import * as vscode from 'vscode';
import { DataOpsAPI } from './api';
import { DataOpsCompletionProvider } from './provider';

let api: DataOpsAPI;

export function activate(context: vscode.ExtensionContext) {
    console.log('DataOps Copilot is now active');

    // Initialize API client
    const config = vscode.workspace.getConfiguration('dataopsCopilot');
    const apiUrl = config.get<string>('apiUrl', 'http://localhost:8000/api/v1');
    api = new DataOpsAPI(apiUrl);

    // Register generate code command
    const generateCommand = vscode.commands.registerCommand(
        'dataops-copilot.generateCode',
        async () => {
            const prompt = await vscode.window.showInputBox({
                prompt: 'Describe the ETL task you want to generate',
                placeHolder: 'e.g., Extract data from S3, clean nulls, load to PostgreSQL'
            });

            if (!prompt) {
                return;
            }

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            try {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Generating code...',
                    cancellable: false
                }, async () => {
                    const response = await api.generateCode(prompt);
                    
                    // Insert generated code at cursor position
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.active, response.code);
                    });

                    vscode.window.showInformationMessage('Code generated successfully!');
                });
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to generate code: ${error}`);
            }
        }
    );

    // Register improve code command
    const improveCommand = vscode.commands.registerCommand(
        'dataops-copilot.improveCode',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            const selection = editor.selection;
            const selectedCode = editor.document.getText(selection);

            if (!selectedCode) {
                vscode.window.showWarningMessage('Please select code to improve');
                return;
            }

            // Ask for focus areas
            const focusAreas = await vscode.window.showQuickPick(
                ['performance', 'error_handling', 'readability', 'security', 'scalability'],
                {
                    canPickMany: true,
                    placeHolder: 'Select areas to focus on (optional)'
                }
            );

            try {
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Analyzing code...',
                    cancellable: false
                }, async () => {
                    const response = await api.improveCode(selectedCode, focusAreas);
                    
                    // Show suggestions in a new document
                    const doc = await vscode.workspace.openTextDocument({
                        content: `# Original Code\n\n${response.original_code}\n\n# Suggestions\n\n${response.suggestions}`,
                        language: 'markdown'
                    });
                    await vscode.window.showTextDocument(doc);
                });
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to improve code: ${error}`);
            }
        }
    );

    // Register autocomplete provider
    const enableAutocomplete = config.get<boolean>('enableAutocomplete', true);
    if (enableAutocomplete) {
        const provider = new DataOpsCompletionProvider(api);
        const providerDisposable = vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: 'python' },
            provider,
            '.'
        );
        context.subscriptions.push(providerDisposable);
    }

    context.subscriptions.push(generateCommand, improveCommand);
}

export function deactivate() {}