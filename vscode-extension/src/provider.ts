import * as vscode from 'vscode';
import { DataOpsAPI } from './api';

export class DataOpsCompletionProvider implements vscode.CompletionItemProvider {
    private api: DataOpsAPI;

    constructor(api: DataOpsAPI) {
        this.api = api;
    }

    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): Promise<vscode.CompletionItem[]> {
        // Get current line text up to cursor
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        
        // Only trigger for meaningful prefixes
        if (linePrefix.trim().length < 3) {
            return [];
        }

        try {
            // Get surrounding context (previous 10 lines)
            const startLine = Math.max(0, position.line - 10);
            const contextRange = new vscode.Range(startLine, 0, position.line, 0);
            const contextText = document.getText(contextRange);

            // Get completions from API
            const response = await this.api.autocomplete(linePrefix, contextText);

            // Convert to VSCode completion items
            return response.completions.map((completion, index) => {
                const item = new vscode.CompletionItem(
                    completion,
                    vscode.CompletionItemKind.Snippet
                );
                item.detail = 'DataOps Copilot';
                item.insertText = completion;
                item.sortText = String(index).padStart(3, '0'); // Maintain order
                return item;
            });
        } catch (error) {
            console.error('Autocomplete error:', error);
            return [];
        }
    }
}