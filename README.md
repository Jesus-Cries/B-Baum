# B-Baum

## Specs

-   Frontend: React with TypeScript
-   Backend: NodeJS with Express

## Installation

1. npm install
2. cd client
3. npm install
4. npm audit fix
5. cd ..

## Scripts

Use as follows: npm run <script name>

-   start: Starts the node server
-   server: Starts the node server with nodemon (dynamic reloading)
-   client: Starts only frontend with React
-   dev: Starts frontend and backend
-   prod: Creates a new build for the frontend
  
## Anforderungen
  
Für die Aufgabe gelten folgende Rahmenbedingungen:

- Implementierung in folgende Programmiersprachen: Python, Java und Javascript/TypeScript
- Es muss ein Algorithmus für das Suchen, Einfügen und Löschen von Werten implementiert werden.
- Es muss eine grafische Benutzeroberfläche (UI) für die Bedienung, Auswertung und Visualisierung des B-Baumes implementiert werden.
- Für das UI können gängige Frameworks, die in der jeweiligen Programmiersprache vorhanden sind, verwendet werden (z.B. React oder Angular bei JavaScript).
- Eine eigenständige Implementierung der Aufgabe ist zwingend erforderlich, Kopien aus einschlägige Quellen bzw. von den anderen Gruppen werden nicht bewertet.
- Jeder Programmentwurf muss dokumentiert sein. Die Dokumentation muss folgende Punkte beinhalten:
- Schritte, die für die Ausführung des Programmes notwendig sind (z.B. Installationanleitung etc.)
- Eine Funktionsbeschreibung
- Die Lösung sollte bevorzugt als Docker Image/Container bereitgestellt werden, wenn für die Lösung viele Abhänfigkeiten zu instlalieren wären (z.B. React/Angular bzw. Server/Client Anwendungen). Wenn nicht, müssen alle benötigten Komponenten als ZIP File bereitgestellt werden.

Folgende Anforderungen sind bei der Implementierung zu berücksichtigen und umzusetzen:

- Als Anwender möchte ich für den Aufbau des B-Baumes folgende Möglicheiten haben.
- Eingabe/Löschen/Suchen von Einzelwerte
- Eingabe/Löschen von mehreren Werten auf einmal (z.B. durch Komma getrennt)
- Eingabe von Werten über eine CSV Datei. Die Werte sollen in der Reihenfolge, wie sie in der CSV Datei eingegeben wurden, eingefügt bzw. gelöscht werden. Die CSV Datei soll wie folgt aufgebaut sein: Jede Zeile beinhaltet in der ersten Spalte die Operation (i für Insert, d für Delete). Die Zweite Spalte beinhaltet den Wert.
- Automatisches Erzeugen von zufälligen Werten. Dabei kann die Unter- und Obergrenze und die Anzahl der einzufügenden Werten bestimmt werden.
- Beim Auf- und Abbau des B-Baumes müss zur Prüfung der durchgeführten Aktion jedes Zwischenergebnis angezeigt werden. D.h. z.B. beim Hinzufügen von mehreren Werten soll das Ergebnis nach jedem Einfügen angezeigt werden.
- Die Geschwindigkeit, wie die Operationen hintereinander ausgeführt werden, soll einstellbar sein.
- Wenn die Werte aus einer CSV Datei eingelesen werden, müssen die eingelesenen Werte zunächst angezeigt werden. Nach der Bestätigung sollen die sie einzeln und automatisch hinzugefügt/gelöscht werden.
- Es muss möglich sein, die Ordnung des B-Baumes zu verändern. Wenn die Ordnung des B-Baumes verändert wird, soll der B-Baum initialisiert werden.
- Bei einer Suche nach einem Wert sollte folgendes ausgegeben werden:
- Ob der Wert gefunden wurde oder nicht. Wenn ja, soll die Fundstelle angezeigt werden.
- Die Kosten der Suche (wie viele Seitenzugriffe waren dafür notwendig)
- Es soll eine Möglichkeit geben das Programm zurückzusetzen, um von Vorne zu beginnen.
