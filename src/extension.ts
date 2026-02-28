import * as vscode from 'vscode';
import * as path from 'path';
import { execFile, exec } from 'child_process';

let wavPath = '';

function playSound() {
	console.log(`terminal-error-sound: playing ${wavPath}`);

	switch (process.platform) {
		case 'win32':
			// Windows: built-in .NET SoundPlayer (WAV only)
			execFile('powershell.exe', [
				'-NoProfile', '-NonInteractive', '-Command',
				`(New-Object System.Media.SoundPlayer '${wavPath}').PlaySync()`
			], logResult);
			break;

		case 'darwin':
			// macOS: built-in afplay (supports WAV, MP3, AAC, etc.)
			execFile('afplay', [wavPath], logResult);
			break;

		default:
			// Linux: try aplay (ALSA) → paplay (PulseAudio) → play (SoX)
			exec(
				`aplay "${wavPath}" 2>/dev/null || paplay "${wavPath}" 2>/dev/null || play "${wavPath}" 2>/dev/null`,
				logResult
			);
			break;
	}
}

function logResult(err: Error | null, stdout?: string, stderr?: string) {
	if (err) {
		console.error('terminal-error-sound: playback error –', err.message);
	}
	if (stderr?.trim()) {
		console.error('terminal-error-sound: stderr –', stderr.trim());
	}
	if (stdout?.trim()) {
		console.log('terminal-error-sound: stdout –', stdout.trim());
	}
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