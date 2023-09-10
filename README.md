# single-rust-file

[GitHub (https://github.com/Suxto/single-rust-file)](https://github.com/Suxto/single-rust-file)

This extension allows you to add a `.rs` file as a standalone executable file, this extension can be used with [Cargo Scripts](https://marketplace.visualstudio.com/items?itemName=taiyuuki.vscode-cargo-scripts "link").

## Features

Just help you add file description in `Cargo.toml`

## Usage

1. Make sure there is `Cargo.toml` in your work directory, better with execute `cargo new` in you terminal.
2. Open a `.rs` file(an extence one or a new one)
3. Right click in the text editor area
4. Click the item `Add as a standalone file`
5. You may run the file with `cargo run --bin your_file_name_here`
6. Enjoy Rust!

## Requirements

Cargo

[Cargo Scripts](https://marketplace.visualstudio.com/items?itemName=taiyuuki.vscode-cargo-scripts "link").(Optional)

## Known Issues

I would fix the Issues as long as I am not busy.

+ You may add a file twice by accident, which would make cargo cannot run your file. Just remove the extra item in `Cargo.toml` manually :(

## Release Notes

+ 2023-9-10 **First Release** Ver 0.0.1
