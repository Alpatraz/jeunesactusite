const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const normalizeRegion = (region) => {
  if (!region) return null;
  const r = region.trim().toLowerCase();
  if (["test", "testland", "unknown", "n/a", "", "inconnue"].includes(r)) return null;

  const map = {
    "europe": "Europe",
    "eu": "Europe",
    "usa": "États-Unis",
    "us": "États-Unis",
    "united states": "États-Unis",
    "canada": "Canada",
    "quebec": "Québec",
    "asie": "Asie",
    "asia": "Asie",
    "africa": "Afrique",
    "afrique": "Afrique",
    "latin america": "Amérique latine",
    "south america": "Amérique du Sud",
    "north america": "Amérique du Nord",
    "monde": "Monde"
  };

  return map[r] || r.charAt(0).toUpperCase() + r.slice(1);
};

(async () => {
  const snapshot = await db.collection('actus').get();
  const batch = db.batch();
  let count = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    let updateNeeded = false;

    let theme = data.theme?.trim().toLowerCase();
    if (!theme || theme === "test") {
      theme = "Général";
      updateNeeded = true;
    } else {
      theme = theme.charAt(0).toUpperCase() + theme.slice(1);
    }

    let region = normalizeRegion(data.region);
    if (!region) {
      region = "Monde";
      updateNeeded = true;
    }

    if (updateNeeded) {
      batch.update(doc.ref, { region, theme });
      count++;
    }
  });

  if (count > 0) {
    await batch.commit();
    console.log(`✅ ${count} documents corrigés.`);
  } else {
    console.log("👍 Tous les documents étaient déjà propres.");
  }
})();
