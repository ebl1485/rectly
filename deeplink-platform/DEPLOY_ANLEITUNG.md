# 🚀 DeepLinker – Deploy-Anleitung (Schritt für Schritt)

Keine Coding-Kenntnisse nötig. Folge einfach diesen Schritten.

---

## Was du brauchst
- Einen kostenlosen Account bei **GitHub** (github.com)
- Einen kostenlosen Account bei **Vercel** (vercel.com)
- Das ZIP-Archiv dieser Plattform

---

## Schritt 1 – GitHub Account erstellen
1. Gehe zu https://github.com/signup
2. E-Mail, Passwort, Benutzername eingeben
3. E-Mail bestätigen

---

## Schritt 2 – Projekt auf GitHub hochladen

1. Gehe zu https://github.com/new
2. Gib einen Namen ein, z.B. `deeplinker`
3. Wähle **Private** (dein Code bleibt privat)
4. Klicke auf **"Create repository"**
5. Klicke auf **"uploading an existing file"**
6. Entpacke das ZIP-Archiv auf deinem Computer
7. Ziehe **alle Dateien und Ordner** in das GitHub Upload-Fenster
8. Klicke auf **"Commit changes"**

---

## Schritt 3 – Vercel Account erstellen & deployen

1. Gehe zu https://vercel.com/signup
2. Wähle **"Continue with GitHub"** – so verbindest du beides
3. Klicke auf **"Add New Project"**
4. Wähle dein `deeplinker` Repository aus
5. Klicke auf **"Deploy"** – fertig!

Vercel baut dein Projekt automatisch und gibt dir eine URL wie:
`https://deeplinker-xyz.vercel.app`

---

## Schritt 4 – Eigene Domain verbinden (optional)

Falls du dir später eine Domain kaufst (z.B. bei Namecheap oder Cloudflare):

1. In Vercel: Dein Projekt → **Settings** → **Domains**
2. Deine Domain eingeben
3. Vercel zeigt dir DNS-Einstellungen, die du bei deinem Domain-Anbieter eintragen musst
4. Nach ein paar Minuten ist deine Domain aktiv

---

## Wichtiger Hinweis: Link-Speicherung

> **Die aktuelle Version speichert Links im Arbeitsspeicher des Servers.**
> Das bedeutet: Wenn Vercel den Server neu startet (was selten passiert), gehen die Links verloren.

### Für dauerhafte Links – kostenlose Lösung:
1. Gehe zu https://upstash.com und erstelle einen kostenlosen Account
2. Erstelle eine **Redis-Datenbank** (kostenlos bis 10.000 Anfragen/Tag)
3. Kopiere die `UPSTASH_REDIS_REST_URL` und `UPSTASH_REDIS_REST_TOKEN`
4. In Vercel: **Settings** → **Environment Variables** → beide Werte eintragen
5. Schreibe mir dann, ich aktualisiere die `lib/store.js` für dich!

---

## Support

Wenn etwas nicht funktioniert, mach einen Screenshot und frage mich – ich helfe dir!
