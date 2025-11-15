"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
var vscode = require("vscode");
var api_1 = require("./api");
var provider_1 = require("./provider");
var api;
function activate(context) {
    var _this = this;
    console.log('DataOps Copilot is now active');
    // Initialize API client
    var config = vscode.workspace.getConfiguration('dataopsCopilot');
    var apiUrl = config.get('apiUrl', 'http://localhost:8000/api/v1');
    api = new api_1.DataOpsAPI(apiUrl);
    // Register generate code command
    var generateCommand = vscode.commands.registerCommand('dataops-copilot.generateCode', function () { return __awaiter(_this, void 0, void 0, function () {
        var prompt, editor;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, vscode.window.showInputBox({
                        prompt: 'Describe the ETL task you want to generate',
                        placeHolder: 'e.g., Extract data from S3, clean nulls, load to PostgreSQL'
                    })];
                case 1:
                    prompt = _a.sent();
                    if (!prompt) {
                        return [2 /*return*/];
                    }
                    editor = vscode.window.activeTextEditor;
                    if (!editor) {
                        return [2 /*return*/];
                    }
                    try {
                        vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: 'Generating code...',
                            cancellable: false
                        }, function () { return __awaiter(_this, void 0, void 0, function () {
                            var response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, api.generateCode(prompt)];
                                    case 1:
                                        response = _a.sent();
                                        // Insert generated code at cursor position
                                        editor.edit(function (editBuilder) {
                                            editBuilder.insert(editor.selection.active, response.code);
                                        });
                                        vscode.window.showInformationMessage('Code generated successfully!');
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    catch (error) {
                        vscode.window.showErrorMessage("Failed to generate code: ".concat(error));
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    // Register improve code command
    var improveCommand = vscode.commands.registerCommand('dataops-copilot.improveCode', function () { return __awaiter(_this, void 0, void 0, function () {
        var editor, selection, selectedCode, focusAreas;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    editor = vscode.window.activeTextEditor;
                    if (!editor) {
                        return [2 /*return*/];
                    }
                    selection = editor.selection;
                    selectedCode = editor.document.getText(selection);
                    if (!selectedCode) {
                        vscode.window.showWarningMessage('Please select code to improve');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, vscode.window.showQuickPick(['performance', 'error_handling', 'readability', 'security', 'scalability'], {
                            canPickMany: true,
                            placeHolder: 'Select areas to focus on (optional)'
                        })];
                case 1:
                    focusAreas = _a.sent();
                    try {
                        vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: 'Analyzing code...',
                            cancellable: false
                        }, function () { return __awaiter(_this, void 0, void 0, function () {
                            var response, doc;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, api.improveCode(selectedCode, focusAreas)];
                                    case 1:
                                        response = _a.sent();
                                        return [4 /*yield*/, vscode.workspace.openTextDocument({
                                                content: "# Original Code\n\n".concat(response.original_code, "\n\n# Suggestions\n\n").concat(response.suggestions),
                                                language: 'markdown'
                                            })];
                                    case 2:
                                        doc = _a.sent();
                                        return [4 /*yield*/, vscode.window.showTextDocument(doc)];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    }
                    catch (error) {
                        vscode.window.showErrorMessage("Failed to improve code: ".concat(error));
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    // Register autocomplete provider
    var enableAutocomplete = config.get('enableAutocomplete', true);
    if (enableAutocomplete) {
        var provider = new provider_1.DataOpsCompletionProvider(api);
        var providerDisposable = vscode.languages.registerCompletionItemProvider({ scheme: 'file', language: 'python' }, provider, '.');
        context.subscriptions.push(providerDisposable);
    }
    context.subscriptions.push(generateCommand, improveCommand);
}
function deactivate() { }
