# speed up your typescript compilation

# Features

- Ultra fast typescript
- Don't check type at compile time (It's ide's job)
- Auto re-compile when ts file saved and restart debugger.
- add your own custom command after rootDir compiled

# How to use

Open command palette by pressing `F1` then start typing "compile typescript" and run suggested command.
keyboard shortcut : <kbd>Ctrl</kbd> +<kbd>Alt</kbd> + <kbd>C</kbd>

**In debug mode**\
Just save ts file, typescript auto re-compiled and auto-restart debugger.

**Enable Watch mode**\
Open command palette by pressing `F1` then start typing "compilets watch mode" and run suggested command.
keyboard shortcut : <kbd>Ctrl</kbd> +<kbd>Alt</kbd> + <kbd>W</kbd>
**compileTs** auto-compile typescript file when saved,

**How to add custom command (run after compiled rootDir or file save in watch mode)**\
open setting by pressing (ctrl+,) and search `runCompileCommand` or,\
`runWatchCommand` (only work in watch mode)\
Enter your **shell** script

# TODO

- [] read and sync workspace tsconfig.json file

# ⚠️ Note

Not tested on windows
