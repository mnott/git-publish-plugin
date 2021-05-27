import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, FileSystemAdapter } from 'obsidian';

interface MyPluginSettings {
	gitCommand: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	gitCommand: "osascript -e 'tell app \"Terminal\"' -e 'activate' -e 'do script \"cd \\\"_VAULT_\\\"&& ./publish.sh && exit \"' -e 'end tell'",
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		// Possible Icons: 'logo-crystal', 'create-new', 'trash', 'search', 'right-triangle', 'document', 'folder', 'pencil', 'left-arrow', 'right-arrow', 'three-horizontal-bars', 'dot-network', 'audio-file', 'image-file', 'pdf-file', 'gear', 'documents', 'blocks', 'go-to-file', 'presentation', 'cross-in-box', 'microphone', 'microphone-filled', 'two-columns', 'link', 'popup-open', 'checkmark', 'hashtag', 'left-arrow-with-tail', 'right-arrow-with-tail', 'lines-of-text', 'vertical-three-dots', 'pin', 'magnifying-glass', 'info', 'horizontal-split', 'vertical-split', 'calendar-with-checkmark', 'sheets-in-box', 'up-and-down-arrows', 'broken-link', 'cross', 'any-key', 'reset', 'star', 'crossed-star', 'dice', 'filled-pin', 'enter', 'help', 'vault', 'open-vault', 'paper-plane', 'bullet-list', 'uppercase-lowercase-a', 'star-list', 'expand-vertically', 'languages', 'switch', 'pane-layout', 'install'

		this.addRibbonIcon('popup-open', 'Git Publish', () => {
			const execSync = require('child_process').execSync;
			const adapter = this.app.vault.adapter as FileSystemAdapter;
			const vault_path = adapter.getBasePath();
			new Notice('Running Git Publish');

			var cmd = this.settings.gitCommand;
			cmd = cmd.replace("_VAULT_", vault_path);
			console.log('Executing: ' + cmd);

			const output = execSync(cmd, { encoding: 'utf-8' });
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'open-sample-modal',
			name: 'Open Sample Modal',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		/*
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
		*/
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Git Publish (c) 2021 Matthias Nott'});

		var def = "osascript -e 'tell app \"Terminal\"' -e 'activate' -e 'do script \"cd \\\"_VAULT_\\\"&& ./publish.sh && exit \"' -e 'end tell'";

		new Setting(containerEl)
			.setName('Git Publish Command')
			.setDesc("Default: " + def)
			.addText(text => text
				.setPlaceholder(def)
				.setValue(this.plugin.settings.gitCommand)
				.onChange(async (value) => {
					console.log('Git Setting: ' + value);
					this.plugin.settings.gitCommand = value;
					await this.plugin.saveSettings();
				}));
	}
}
