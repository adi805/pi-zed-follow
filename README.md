# pi-zed-follow

Pi extension that auto-opens files in Zed editor when Pi writes or edits them. Mimics ACP's auto-follow behavior but works with Pi running in terminal.

## Install

```bash
pi install path:D:/Estate/Pi_Project/pi-zed-follow
```

## What it does

When Pi `write` or `edit` a file, this extension automatically opens that file in Zed's editor tab. So you get the same "auto-follow" experience as ACP — but with Pi running in terminal.

## Config

Set `ZED_PATH` env var if Zed is not at the default location:

```bash
set ZED_PATH=C:\path\to\zed.exe
```

## Layout

Use with terminal docked left in Zed settings:

```json
{
  "terminal": {
    "dock": "left",
    "default_width": 500
  }
}
```

Pi runs in left terminal, edited files auto-open in right editor.
