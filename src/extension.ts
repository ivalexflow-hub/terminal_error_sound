import * as vscode from 'vscode';
import * as path from 'path';
import * as soundPlay from 'sound-play';

export function activate(context: vscode.ExtensionContext) {

	console.log('terminal-error-sound is now active!');

	// Test command: run "Terminal Error Sound: Test Sound" from the Command Palette
	context.subscriptions.push(
		vscode.commands.registerCommand('terminal-error-sound.testSound', () => {
			playErrorSound(context);
		})
	);

	// Log when shell integration activates so we know it's working
	context.subscriptions.push(
		vscode.window.onDidChangeTerminalShellIntegration((e) => {
			console.log(`terminal-error-sound: shell integration active in terminal "${e.terminal.name}"`);
		})
	);

	context.subscriptions.push(
		vscode.window.onDidEndTerminalShellExecution((event) => {
			const exitCode = event.exitCode;
			console.log(`terminal-error-sound: command ended, exitCode=${exitCode}`);

			if (exitCode !== undefined && exitCode !== 0) {
				playErrorSound(context);
			}
		})
	);
}

async function playErrorSound(context: vscode.ExtensionContext) {

	const soundPath = path.join(
		context.extensionPath,
		'media',
		'faaah.wav'
	);

	console.log(`terminal-error-sound: playing ${soundPath}`);

	try {
		await soundPlay.play(soundPath);
	} catch (err) {
		console.error('terminal-error-sound: failed to play sound –', err);
	}

}

export function deactivate() {}