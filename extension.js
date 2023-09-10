const vscode = require('vscode');
const path = require('path');
const { parse, stringify } = require('@iarna/toml');
const fs = require('fs');

async function verifyCargoToml(folderPath) {
	const cargoTomlPath = path.join(folderPath, 'Cargo.toml');
	try {
		await vscode.workspace.fs.stat(vscode.Uri.file(cargoTomlPath));
		return cargoTomlPath;
	} catch (error) {
		return null;
	}
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('single-rust-file.addToTOML', async (uri) => {
		if (!uri || !uri.fsPath.endsWith('.rs')) return;
		let currentFolderPath = path.dirname(uri.fsPath);

		let currentFileName = path.basename(uri.fsPath).split('.');

		let cargoTomlPath = await verifyCargoToml(currentFolderPath);

		while (!cargoTomlPath && currentFolderPath !== '/') {
			const parentFolderPath = path.dirname(currentFolderPath);
			cargoTomlPath = await verifyCargoToml(parentFolderPath);
			currentFolderPath = parentFolderPath;
		}

		// console.log(cargoTomlPath);
		if (!cargoTomlPath) {
			vscode.window.showErrorMessage('Can`t find Cargo.toml');
			return;
		}
		let relativePath = uri.fsPath.replace(path.dirname(cargoTomlPath), '').substring(1);
		relativePath = relativePath.replace(/\\/g, "/");

		const config = {
			name: currentFileName[0],
			path: relativePath
		};

		// let binConfig = [config];
		// console.log(binSection);

		try {
			const cargoTomlData = fs.readFileSync(cargoTomlPath, 'utf-8');
			const cargoTomlObject = parse(cargoTomlData);
			// console.log(cargoTomlObject);
			if (Array.isArray(cargoTomlObject.bin)) {
				// @ts-ignore
				cargoTomlObject.bin.push(config);
			} else if (cargoTomlObject.package) {
				cargoTomlObject.bin = [config];
			} else {
				vscode.window.showErrorMessage(`No [package] section found in ${cargoTomlPath}. Please check the toml file.`);
				return;
			}
			let scriptName = 'run_' + currentFileName[0];
			let scriptAction = "cargo run --bin " + currentFileName[0];

			if (!cargoTomlObject.package.hasOwnProperty('metadata')) {
				cargoTomlObject.package['metadata'] = {};
			}

			if (!cargoTomlObject.package['metadata'].hasOwnProperty('scripts')) {
				cargoTomlObject.package['metadata'].scripts = {};
			}

			cargoTomlObject.package['metadata']['scripts'][scriptName] = scriptAction;

			console.log(cargoTomlObject);

			const updatedCargoTomlData = stringify(cargoTomlObject);
			fs.writeFileSync(cargoTomlPath, updatedCargoTomlData, 'utf-8');

			vscode.window.showInformationMessage(`Content inserted to ${cargoTomlPath}.`);
		} catch (error) {
			vscode.window.showErrorMessage(`Failed to insert content to ${cargoTomlPath}: ${error}`);
		}

	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

