// ── Firebase Config ──
// วิธีใช้:
// 1. ไปที่ https://console.firebase.google.com → สร้างโปรเจกต์ใหม่ (ฟรี)
// 2. Build → Realtime Database → Create database → เลือก "test mode"
// 3. Project settings → Your apps → "+ Add app" → Web → copy config
// 4. Copy ไฟล์นี้เป็นชื่อ firebase-config.js (ถูก gitignore — ไม่ถูก commit)
// 5. ใส่ค่าจาก Firebase console ใน firebase-config.js
//
// Firebase Rules (แนะนำ) — ไปที่ Realtime Database → Rules:
// {
//   "rules": {
//     "sharedVocab": {
//       ".read": true,
//       ".write": true,
//       "$item": { ".validate": "newData.hasChildren(['en','th','cat'])" }
//     }
//   }
// }

window.FIREBASE_CFG = {
  apiKey:            "",
  authDomain:        "",
  databaseURL:       "",   // https://your-project-rtdb.REGION.firebasedatabase.app
  projectId:         "",
  storageBucket:     "",
  messagingSenderId: "",
  appId:             ""
};
