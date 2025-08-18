# iracing-capture

Minimal Electron application capable of resizing the iRacing simulator and
capturing screenshots at several resolutions (1080p, 2K, 4K, and 8K).

This project demonstrates how to use Windows APIs from Node via the
[`win-control`](https://www.npmjs.com/package/win-control) module
to resize the simulator window before taking a screenshot.  The screenshot
is captured using the `screenshot-desktop` package and saved in the user's
Pictures directory. Because it relies on Win32 APIs, the application only runs on Windows.

## Development

```bash
npm install
npm start
```

The application will open a small window with buttons for each supported
resolution.  Ensure iRacing is running before selecting a resolution.

## Testing

There are no automated tests yet.  The `npm test` script is provided only to
satisfy tooling requirements.
