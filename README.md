# Finanzverwaltung

Persönliche Finanzverwaltung als Web-App: Konten, Transaktionen, Kategorien und
monatliche Budgets mit einer Dashboard-Übersicht.

## Stack

- [Next.js](https://nextjs.org) (App Router) mit TypeScript
- [Prisma](https://www.prisma.io) + SQLite als Datenbank
- Tailwind CSS
- Server Actions für alle Schreiboperationen (kein separates API-Backend nötig)

## Funktionen

- **Übersicht**: Gesamtvermögen, Einnahmen/Ausgaben des Monats, Verlauf der letzten
  6 Monate, Ausgaben nach Kategorie, letzte Transaktionen
- **Konten**: mehrere Konten (Giro, Spar, Bar, …) mit automatisch berechnetem Saldo
- **Transaktionen**: erfassen, bearbeiten, löschen, filtern nach Konto, Kategorie,
  Art, Monat und Freitextsuche
- **Kategorien**: frei definierbare Einnahmen-/Ausgaben-Kategorien mit Farbe
- **Budgets**: monatliche Ausgabenlimits je Kategorie mit Fortschrittsanzeige

## Erste Schritte

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed   # optional: Beispieldaten
npm run dev
```

Anschließend [http://localhost:3000](http://localhost:3000) öffnen.

### Nützliche Skripte

| Befehl               | Beschreibung                                  |
| -------------------- | ---------------------------------------------- |
| `npm run dev`         | Entwicklungsserver starten                     |
| `npm run build`       | Produktions-Build erstellen                    |
| `npm run start`       | Produktions-Build starten                      |
| `npm run lint`        | ESLint ausführen                               |
| `npm run db:migrate`  | Neue Prisma-Migration erstellen/anwenden       |
| `npm run db:seed`     | Datenbank mit Beispieldaten befüllen           |
| `npm run db:studio`   | Prisma Studio (DB-GUI) öffnen                  |

## Datenmodell

Das Schema liegt in `prisma/schema.prisma`:

- **Account** – Konten mit Startsaldo, Farbe und Typ
- **Category** – Kategorien mit Art (`INCOME`/`EXPENSE`) und Farbe
- **Transaction** – Buchungen, verknüpft mit Konto und Kategorie
- **Budget** – monatliches Limit je Kategorie
