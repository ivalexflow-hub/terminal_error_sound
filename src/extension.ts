import * as vscode from 'vscode';
import * as path from 'path';
import { execFile } from 'child_process';

let wavPath = '';

function playSound() {
	console.log(`terminal-error-sound: playing ${wavPath}`);
	execFile('powershell.exe', [
		'-NoProfile', '-NonInteractive', '-Command',
		`(New-Object System.Media.SoundPlayer '${wavPath}').PlaySync()`
	], (err, stdout, stderr) => {
		if (err) {
			console.error('terminal-error-sound: playback error –', err.message);
		}
		if (stderr) {
			console.error('terminal-error-sound: PS stderr –', stderr.trim());
		}
		if (stdout) {
			console.log('terminal-error-sound: PS stdout –', stdout.trim());
		}
	});
}

export function activate(context: vscode.ExtensionContext) {
	console.log('terminal-error-sound is now active!');

	wavPath = path.join(context.extensionPath, 'media', 'faaah.wav');

	// Test command via Command Palette
	context.subscriptions.push(
		vscode.commands.registerCommand('terminal-error-sound.testSound', () => {
			playSound();
		})
	);

	// Log when shell integration activates
	context.subscriptions.push(
		vscode.window.onDidChangeTerminalShellIntegration((e) => {
			console.log(`terminal-error-sound: shell integration active in "${e.terminal.name}"`);
		})
	);

	// Play sound on non-zero exit code
	context.subscriptions.push(
		vscode.window.onDidEndTerminalShellExecution((event) => {
			const exitCode = event.exitCode;
			console.log(`terminal-error-sound: command ended, exitCode=${exitCode}`);

			if (exitCode !== undefined && exitCode !== 0) {
				playSound();
			}
		})
	);
}

export function deactivate() {}