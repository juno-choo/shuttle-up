// test-admin.js
const admin = require('firebase-admin'); // Use require for simple Node script

// IMPORTANT: Make sure GOOGLE_APPLICATION_CREDENTIALS is set in this terminal session
// You might need to export it again:
// export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
// Or on Windows CMD:
// set GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\serviceAccountKey.json"
// Or on Windows PowerShell:
// $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\serviceAccountKey.json"

console.log('Attempting standalone admin.initializeApp()...');
console.log('Using credentials file:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

try {
    if (!admin.apps.length) {
        admin.initializeApp();
        console.log('Standalone Initialization SUCCESSFUL.');
        const auth = admin.auth();
        console.log('Successfully got auth instance.');
    } else {
        console.log('Standalone: Already initialized?');
    }
} catch (error) {
    console.error('Standalone Initialization FAILED:', error);
}