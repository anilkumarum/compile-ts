# compile typescript by [swc](https://swc.rs/)

# Note

This extension is in testing currently. only work on linux

# Features

- Ultra fast typescript compile by swc
- Don't check type at compile time (It's ide's job)
- Auto re-compile when ts file saved and restart debugger.
- add custom command after rootDir compiled

# How to use

Open command palette by pressing `F1` then start typing "compile typescript" and run suggested command.

**In debug mode**\
Just save ts file, typescript auto re-compiled and restart debugger.

# Note

It use [swc](https://swc.rs/docs/migrating-from-tsc) under the hood so don't use in production
