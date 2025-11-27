
const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// STATE
let shellUploaded = false; // Flag to track if user successfully "wrote" the shell

// --- 1. HOMEPAGE (The "Normal" Site) ---
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>RailTrack Logistics | Global Operations</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #e2e8f0; }
                .glass-panel { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
                .status-dot { box-shadow: 0 0 8px currentColor; }
                .train-row:hover { background: rgba(255,255,255,0.05); }
            </style>
        </head>
        <body class="min-h-screen flex flex-col">
            <!-- Navigation -->
            <nav class="border-b border-slate-700 bg-slate-900/80 sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="bg-blue-600 p-2 rounded-lg text-white"><i class="fa-solid fa-train text-2xl"></i></div>
                        <div>
                            <span class="block font-bold text-xl tracking-tight text-white leading-none">RAILTRACK</span>
                            <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Global Logistics</span>
                        </div>
                    </div>
                    <div class="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                        <a href="#" class="text-white hover:text-blue-400 transition">Network Status</a>
                        <a href="#" class="hover:text-blue-400 transition">Freight Tracking</a>
                        <a href="#" class="hover:text-blue-400 transition">Schedules</a>
                        <a href="#" class="hover:text-blue-400 transition">Corporate</a>
                    </div>
                    <div class="flex items-center gap-4">
                        <button class="text-slate-400 hover:text-white"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                </div>
            </nav>

            <!-- Hero / Dashboard -->
            <main class="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
                
                <!-- Status Bar -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div class="glass-panel p-6 rounded-xl flex items-center gap-4">
                        <div class="p-3 bg-green-900/50 text-green-400 rounded-lg"><i class="fa-solid fa-signal"></i></div>
                        <div>
                            <div class="text-xs text-slate-400 uppercase font-bold">Network Uptime</div>
                            <div class="text-2xl font-bold text-white">99.98%</div>
                        </div>
                    </div>
                    <div class="glass-panel p-6 rounded-xl flex items-center gap-4">
                        <div class="p-3 bg-blue-900/50 text-blue-400 rounded-lg"><i class="fa-solid fa-train-subway"></i></div>
                        <div>
                            <div class="text-xs text-slate-400 uppercase font-bold">Active Trains</div>
                            <div class="text-2xl font-bold text-white">2,405</div>
                        </div>
                    </div>
                    <div class="glass-panel p-6 rounded-xl flex items-center gap-4">
                        <div class="p-3 bg-orange-900/50 text-orange-400 rounded-lg"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div>
                            <div class="text-xs text-slate-400 uppercase font-bold">Signaling Alerts</div>
                            <div class="text-2xl font-bold text-white">3</div>
                        </div>
                    </div>
                    <div class="glass-panel p-6 rounded-xl flex items-center gap-4">
                        <div class="p-3 bg-purple-900/50 text-purple-400 rounded-lg"><i class="fa-solid fa-server"></i></div>
                        <div>
                            <div class="text-xs text-slate-400 uppercase font-bold">System Load</div>
                            <div class="text-2xl font-bold text-white">42%</div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <!-- Live Train Board -->
                    <div class="lg:col-span-2 glass-panel rounded-xl overflow-hidden">
                        <div class="p-6 border-b border-slate-700 flex justify-between items-center">
                            <h2 class="font-bold text-white text-lg"><i class="fa-regular fa-clock mr-2 text-slate-400"></i> Live Departures</h2>
                            <div class="flex items-center gap-2 text-xs text-green-400">
                                <div class="w-2 h-2 rounded-full bg-green-500 status-dot"></div> LIVE
                            </div>
                        </div>
                        <div class="p-0">
                            <table class="w-full text-left text-sm text-slate-400">
                                <thead class="bg-slate-800/50 text-xs uppercase font-bold text-slate-500">
                                    <tr>
                                        <th class="p-4">Train ID</th>
                                        <th class="p-4">Destination</th>
                                        <th class="p-4">Platform</th>
                                        <th class="p-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-700/50">
                                    <tr class="train-row transition">
                                        <td class="p-4 font-mono text-white">RT-8842</td>
                                        <td class="p-4">London Gateway</td>
                                        <td class="p-4 text-center">4A</td>
                                        <td class="p-4 text-right text-green-400 font-bold">ON TIME</td>
                                    </tr>
                                    <tr class="train-row transition">
                                        <td class="p-4 font-mono text-white">RT-109X</td>
                                        <td class="p-4">Manchester Freight Terminal</td>
                                        <td class="p-4 text-center">9</td>
                                        <td class="p-4 text-right text-yellow-400 font-bold">DELAYED (8m)</td>
                                    </tr>
                                    <tr class="train-row transition">
                                        <td class="p-4 font-mono text-white">RT-3321</td>
                                        <td class="p-4">Edinburgh Waverley</td>
                                        <td class="p-4 text-center">2</td>
                                        <td class="p-4 text-right text-green-400 font-bold">DEPARTED</td>
                                    </tr>
                                    <tr class="train-row transition">
                                        <td class="p-4 font-mono text-white">RT-998A</td>
                                        <td class="p-4">Bristol Temple Meads</td>
                                        <td class="p-4 text-center">1B</td>
                                        <td class="p-4 text-right text-green-400 font-bold">ON TIME</td>
                                    </tr>
                                    <tr class="train-row transition">
                                        <td class="p-4 font-mono text-white">RT-5500</td>
                                        <td class="p-4">Liverpool Lime St</td>
                                        <td class="p-4 text-center">-</td>
                                        <td class="p-4 text-right text-slate-500 font-bold">SCHEDULED</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Sidebar Info -->
                    <div class="space-y-6">
                        <!-- Alert Box -->
                        <div class="glass-panel p-6 rounded-xl border-l-4 border-yellow-500">
                            <h3 class="text-yellow-500 font-bold mb-2 uppercase text-xs tracking-wider">Infrastructure Alert</h3>
                        </div>

                        <!-- Quick Track -->
                        <div class="glass-panel p-6 rounded-xl">
                            <h3 class="text-white font-bold mb-4">Quick Cargo Track</h3>
                            <div class="flex gap-2">
                                <input type="text" placeholder="Container ID (e.g. CG-2029)" class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 text-white">
                                <button class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm transition"><i class="fa-solid fa-arrow-right"></i></button>
                            </div>
                        </div>

                        <!-- System Info -->
                        <div class="p-4 rounded-xl bg-slate-800/30 text-xs text-slate-500 space-y-2">
                            <div class="flex justify-between"><span>Server Time:</span> <span class="font-mono text-slate-400">${new Date().toISOString()}</span></div>
                            <div class="flex justify-between"><span>Node ID:</span> <span class="font-mono text-slate-400">EU-WEST-04</span></div>
                            <div class="flex justify-between"><span>Version:</span> <span class="font-mono text-slate-400">v4.2.1 (Legacy)</span></div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="border-t border-slate-800 bg-slate-900/50 py-8 mt-auto">
                <div class="max-w-7xl mx-auto px-6 text-center">
                    <p class="text-slate-500 text-sm">&copy; 2024 RailTrack Logistics PLC. All rights reserved.</p>
                    <p class="text-slate-600 text-xs mt-2">
                        <br>
                    </p>
                </div>
            </footer>
        </body>
        </html>
    `);
});

// --- 2. VULNERABILITY: CONFIG LEAK ---
app.get('/config.php.bak', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(`<?php
// DATABASE CONFIGURATION
// DO NOT COMMIT TO GIT
// Internal Admin Console: /internal/db_console
define('DB_HOST', 'localhost');
define('DB_NAME', 'railtrack_legacy');
define('DB_USER', 'root');
define('DB_PASS', 'Xy9#L_Train_M@ster!'); // TODO: Rotate this password
?>`);
});

// --- 3. VULNERABILITY: EXPOSED DB CONSOLE ---
app.get('/internal/db_console', (req, res) => {
    const auth = req.cookies['db_session'];
    if (auth === 'logged_in') {
        return res.send(renderConsole());
    }
    res.send(renderLogin());
});

app.post('/internal/db_console/login', (req, res) => {
    const { username, password } = req.body;
    // Validating against the leaked credentials
    if (username === 'root' && password === 'Xy9#L_Train_M@ster!') {
        res.cookie('db_session', 'logged_in');
        return res.redirect('/internal/db_console');
    }
    res.send(renderLogin('ACCESS DENIED: Invalid credentials.'));
});

// --- HELPER: LOGOUT (For testing) ---
app.get('/logout', (req, res) => {
    res.clearCookie('db_session');
    res.redirect('/internal/db_console');
});

// --- 4. VULNERABILITY: SQL TO RCE (Simulated) ---
app.post('/internal/db_console/query', (req, res) => {
    const auth = req.cookies['db_session'];
    if (auth !== 'logged_in') return res.status(403).send("Unauthorized");

    const query = req.body.sql_query.trim();
    
    // Check if the user is trying to write a shell
    // Pattern: SELECT ... INTO OUTFILE ...
    if (query.toUpperCase().includes('INTO OUTFILE')) {
        if (query.includes('shell.php') || query.includes('cmd.php')) {
            shellUploaded = true;
            return res.send(renderConsole(`
                <div class="text-green-500 mb-4 border border-green-500 p-2 bg-green-900/20">
                    [SUCCESS] Query OK, 1 row affected (0.02 sec)<br>
                    File written to: /var/www/html/shell.php
                </div>
            `));
        }
    }

    // Default response for other queries
    if (query.toUpperCase().startsWith('SELECT')) {
        return res.send(renderConsole(`
            <div class="text-yellow-400 mb-4 font-mono text-xs">
                +----+----------+-------------+<br>
                | id | train_id | status      |<br>
                +----+----------+-------------+<br>
                | 1  | RT-001   | ACTIVE      |<br>
                | 2  | RT-002   | MAINTENANCE |<br>
                +----+----------+-------------+<br>
            </div>
        `));
    }

    res.send(renderConsole(`<div class="text-red-400 mb-4">[ERROR] SQL Syntax Error or Operation Not Allowed</div>`));
});

// --- 5. THE WEB SHELL (The RCE Sink) ---
app.get('/shell.php', (req, res) => {
    if (!shellUploaded) {
        return res.status(404).send("404 Not Found");
    }

    const cmd = req.query.cmd;
    if (!cmd) {
        return res.send("Usage: ?cmd=whoami");
    }

    // Execute the command on the HOST machine (Real RCE)
    exec(cmd, (error, stdout, stderr) => {
        res.set('Content-Type', 'text/plain');
        if (error) return res.send(stderr || error.message);
        res.send(stdout);
    });
});

// --- UI TEMPLATES ---

function renderLogin(error = '') {
    return `
    <html>
    <head>
        <title>RailTrack DB Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>body { background: #000; color: #0f0; font-family: 'Courier New', monospace; }</style>
    </head>
    <body class="flex items-center justify-center h-screen">
        <div class="border border-green-700 p-8 rounded w-96 shadow-[0_0_20px_rgba(0,255,0,0.2)]">
            <div class="flex justify-center mb-6 text-4xl">
                <!-- Simple database icon manually to avoid external font dependency if offline -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
            </div>
            <h1 class="text-xl mb-4 font-bold uppercase text-center border-b border-green-800 pb-2">Legacy DB Access</h1>
            <p class="text-red-500 mb-4 text-center font-bold animate-pulse">${error}</p>
            <form method="POST" action="/internal/db_console/login" class="flex flex-col gap-4">
                <div>
                    <label class="text-xs text-green-700">USERNAME</label>
                    <input type="text" name="username" class="w-full bg-black border border-green-800 p-2 text-green-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition">
                </div>
                <div>
                    <label class="text-xs text-green-700">PASSWORD</label>
                    <input type="password" name="password" class="w-full bg-black border border-green-800 p-2 text-green-500 focus:outline-none focus:border-green-500 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition">
                </div>
                <button type="submit" class="mt-4 bg-green-900 text-black font-bold py-2 hover:bg-green-700 hover:text-white transition uppercase tracking-widest">Authenticate</button>
            </form>
        </div>
    </body>
    </html>`;
}

function renderConsole(output = '') {
    return `
    <html>
    <head>
        <title>RailTrack SQL Console</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { background: #0d1117; color: #c9d1d9; font-family: 'Courier New', monospace; }
            .sql-input { background: #000; border: 1px solid #30363d; color: #fff; }
        </style>
    </head>
    <body class="p-4 md:p-10">
        <nav class="border-b border-gray-700 pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 class="text-2xl font-bold text-white"><span class="text-yellow-500">MySQL</span> Admin Console v4.2</h1>
                <p class="text-xs text-gray-500 mt-1">Internal Management System - Authorized Personnel Only</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-xs text-green-500 border border-green-900 bg-green-900/20 px-3 py-1 rounded">
                    Connected as: root@localhost
                </div>
                 <a href="/logout" class="text-xs text-red-400 hover:text-red-300 border border-red-900 bg-red-900/20 px-3 py-1 rounded transition">LOGOUT</a>
            </div>
        </nav>

        <div class="max-w-5xl mx-auto">
            
            <!-- Output Area -->
            <div class="bg-[#050505] p-4 rounded border border-gray-700 mb-6 min-h-[100px] font-mono text-sm shadow-inner">
                ${output || '<span class="text-gray-600">// Query results will appear here...</span>'}
            </div>

            <form method="POST" action="/internal/db_console/query">
                <label class="block text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">Execute SQL Query:</label>
                <div class="relative">
                    <textarea name="sql_query" rows="6" class="sql-input w-full p-4 rounded focus:outline-none focus:border-yellow-500 font-mono text-yellow-100" placeholder="SELECT * FROM trains WHERE..."></textarea>
                    <div class="absolute bottom-4 right-4 text-xs text-gray-600">MySQL 5.7 Syntax</div>
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <div class="text-xs text-gray-500">
                         Warning: <code>FILE</code> privileges detected.
                    </div>
                    <button type="submit" class="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-8 rounded shadow-lg shadow-yellow-900/50 transition">
                        EXECUTE
                    </button>
                </div>
            </form>
            
            <div class="mt-12 border-t border-gray-800 pt-6 text-xs text-gray-600 flex justify-between">
                <span>RailTrack Operations Ltd.</span>
                <span>Server Time: ${new Date().toISOString()}</span>
            </div>
        </div>
    </body>
    </html>`;
}

app.listen(PORT, () => {
    console.log(`[LAB] RailTrack Legacy Lab running at http://localhost:${PORT}`);
});
