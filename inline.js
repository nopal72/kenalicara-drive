import fs from "fs";
import path from "path";

// Define the root directory and the path for the gas folder
const rootDir = process.cwd(); // Current working directory (root)
const gasDir = path.join(rootDir, "gas"); // Path to the gas folder
const distDir = path.join(rootDir, "dist"); // Path to the dist directory
const assetsDir = path.join(distDir, "assets"); // Path to the assets directory

// Check if the gas directory exists, create if it doesn't
if (!fs.existsSync(gasDir)) {
  fs.mkdirSync(gasDir);
  console.log("Created gas directory.");
}

// Function to find the latest .js or .css file in the assets directory
const findLatestFile = (dir, ext) => {
  const files = fs.readdirSync(dir);
  const latestFile = files
    .filter((file) => file.endsWith(ext))
    .sort()
    .pop(); // Get the latest file
  return latestFile ? path.join(dir, latestFile) : null;
};

// Find the latest index.js and index.css files in the assets directory
const jsFile = findLatestFile(assetsDir, ".js");
const cssFile = findLatestFile(assetsDir, ".css");

if (!jsFile || !cssFile) {
  console.error("JavaScript or CSS file not found in the assets directory.");
  process.exit(1);
}

// Read the content of the files
const cssContent = fs.readFileSync(cssFile, "utf8");
const jsContent = fs.readFileSync(jsFile, "utf8");

// Create HTML files for JavaScript and CSS in the gas directory
const jsHtmlPath = path.join(gasDir, "js.html");
const cssHtmlPath = path.join(gasDir, "css.html");

const b64 = Buffer.from(jsContent).toString('base64');
const jsWrapper = `<script>
  try {
    var decoded = decodeURIComponent(escape(atob("${b64}")));
    var script = document.createElement('script');
    script.type = 'module';
    script.textContent = decoded;
    document.head.appendChild(script);
  } catch (e) {
    console.error("Failed to load JS bundle", e);
  }
</script>`;

fs.writeFileSync(jsHtmlPath, jsWrapper);
fs.writeFileSync(cssHtmlPath, `<style>${cssContent}</style>`);



console.log("Created js.html and css.html in the gas directory successfully!");
