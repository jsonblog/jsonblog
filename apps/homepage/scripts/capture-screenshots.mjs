import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'marketplace', 'screenshots');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function captureScreenshots() {
  // Track current demo context for routing
  let currentDemo = null;

  // Start a simple local server
  const server = http.createServer((req, res) => {
    let filePath = path.join(PUBLIC_DIR, req.url);

    // Special handling for absolute paths like /main.css when viewing demos
    // If requesting /main.css while viewing a demo, serve from the demo directory
    if (currentDemo && req.url.startsWith('/') && !req.url.startsWith('/demos/')) {
      const demoFilePath = path.join(PUBLIC_DIR, 'demos', currentDemo, req.url.slice(1));
      if (fs.existsSync(demoFilePath) && fs.statSync(demoFilePath).isFile()) {
        filePath = demoFilePath;
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
      }[ext] || 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  server.listen(3456);
  console.log('Local server started on http://localhost:3456');

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport for consistent screenshots
  await page.setViewportSize({ width: 1200, height: 800 });

  const demos = [
    { name: 'boilerplate', url: 'http://localhost:3456/demos/boilerplate/index.html' },
    { name: 'tailwind', url: 'http://localhost:3456/demos/tailwind/index.html' },
  ];

  for (const demo of demos) {
    try {
      console.log(`Capturing screenshot for ${demo.name}...`);

      // Set current demo context for server routing
      currentDemo = demo.name;

      await page.goto(demo.url);

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000); // Extra wait for any animations

      // Capture screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${demo.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false, // Just capture viewport
      });

      console.log(`✓ Screenshot saved: ${screenshotPath}`);
    } catch (err) {
      console.error(`✗ Failed to capture ${demo.name}:`, err.message);
    }
  }

  await browser.close();
  server.close();
  console.log('✓ All screenshots captured');
}

captureScreenshots().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
