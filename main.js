// main.js
import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync } from 'fs';

// 记录到本地文件，打包后也能看
import { appendFileSync } from 'fs';
import { join } from 'path';
const log = (m) => appendFileSync(join(process.cwd(), 'electron-error.log'), `${new Date().toISOString()} ${m}\n`);
process.on('uncaughtException', (e) => { log('uncaught ' + e.stack); app.quit(); });
process.on('unhandledRejection', (e) => { log('unhandled ' + e.stack); app.quit(); });

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({ width: 1200, height: 800 });
    const indexPath = join(__dirname, 'dist', 'index.html');

    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        if (!existsSync(indexPath)) {
            console.error('[Electron] 找不到', indexPath);
            app.quit();
            return;
        }
        win.loadFile(indexPath);
    }
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());