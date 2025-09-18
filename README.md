# Cloud-based Warehouse Management System

## Projektübersicht

Dieses Repository dokumentiert die **strukturierte und technisch bereinigte Abschlussversion** eines cloudbasierten Warenwirtschaftssystems (WaWi), das im Rahmen des Moduls **Mobile Business-Anwendungen, Teil 1** im 5. Semester des Studiengangs Wirtschaftsinformatik an der Hochschule Harz entwickelt wurde.

Im Unterschied zum ursprünglichen Entwicklungsgit-Repository handelt es sich hierbei um eine **konsolidierte, aufgeräumte Version** der Anwendung. Ziel war es, den finalen Zustand der Architektur, Funktionen und Sicherheitsaspekte übersichtlich zu dokumentieren und gleichzeitig nicht produktionsreife oder experimentelle Codepfade aus der frühen Phase der Entwicklung auszugliedern.

Die Anwendung digitalisiert zentrale betriebliche Prozesse wie Einkauf, Lagerverwaltung und Produktion. Sie basiert auf einer modernen, serverlosen Cloud-Architektur mit REST-API und legt besonderen Fokus auf Skalierbarkeit, Wartbarkeit und Security-by-Design.

---

## Inhaltsziele

* Digitalisierung operativer Warenwirtschaftsprozesse
* Zentrale Plattform für Bestands- und Rezeptverwaltung
* Umsetzung mit modernen Cloud- und Webtechnologien
* Modular erweiterbare Architektur (z. B. für BI, IoT)
* Realistische, praxisnahe Projektarbeit in Teamstruktur

---

## Technologie-Stack

| Bereich             | Technologie / Dienst                               |
| ------------------- | -------------------------------------------------- |
| Frontend            | Next.js (React) + TypeScript, TailwindCSS          |
| Hosting             | AWS EC2 (Frontend), S3 (statische Ressourcen)      |
| Authentifizierung   | JWT / AWS Cognito                                  |
| Backend             | AWS Lambda (Node.js + TypeScript) + Serverless     |
| API Gateway         | HTTP REST API via AWS API Gateway                  |
| Datenbank           | MariaDB (AWS RDS)                                  |
| DevOps / Monitoring | AWS CloudWatch, Docker (lokale DB), Serverless CLI |

---

## Kernfunktionen

* Verwaltung von Produkten, Rezepturen und Materialien
* Einkauf: manuelle Bestellverwaltung & Lieferantendatenbank
* Lager: Echtzeit-Bestandsverfolgung, Inventur, Umlagerung
* Herstellung: Rezeptverwaltung, automatischer Materialverbrauch
* Warenaustrag: Kundenbestellungen & Materialverbrauchserfassung
* Benutzerverwaltung mit rollenbasiertem Zugriff (RBAC)

---

## Systemarchitektur

```
┌──────────────────────────────────────┐
│  Nutzer: Einkauf, Lager, Produktion  │
└────────────┬─────────────────────────┘
             ↓
┌──────────────────────────────────┐
│ Frontend (Next.js, TailwindCSS)  │
└────────────┬─────────────────────┘
             ↓
┌────────────────────────────┐
│ AWS API Gateway (HTTP API) │
└────────────┬───────────────┘
             ↓
┌────────────────────────────────┐
│ Lambda-Funktionen (Serverless) │
└────────────┬───────────────────┘
             ↓
┌────────────────────────────┐
│      MariaDB (AWS RDS)     │
└────────────────────────────┘
```

---

## Backend-Struktur & HTTP API

* **Architektur**: Microservice-basiert mit domänenspezifischen Handlern (z. B. `/products`, `/orders`, `/inventory`)
* **Technologien**: Node.js + TypeScript, Serverless Framework, node-fetch, Zod für Validierung
* **API**: REST-konforme HTTP-Endpunkte über AWS API Gateway (z. B. `GET /products`, `POST /order`, `PUT /inventory/:id`)
* **Datenzugriff**: Direkte SQL-Kommunikation (MySQL-kompatibel via MariaDB) ohne ORM, mit Prepared Statements
* **Sicherheit**: Authentifizierung per JWT, Zugriffskontrolle via RBAC auf Endpoint-Ebene
* **Validierung**: Schema-basierte Payload-Prüfung mit Zod (minimale Kaltstartzeiten, optimal für Lambda)
* **Deployment**: Automatisiert mit Serverless CLI (inkl. Layer-Verwaltung & VPC-Integration)

---

## Frontend-Struktur

* **Framework**: Next.js mit React + TypeScript
* **Styling**: TailwindCSS für modulare, responsive Komponenten
* **Authentifizierung**: JWT-gestütztes Login mit Refresh-Mechanismus
* **State Management**: Context API + React Hooks für lokale Session- und UI-Zustände
* **Spezialfunktionen**:

  * Inventurmodus mit direkter DB-Aktualisierung
  * Rezepteditor mit dynamischen Mengenberechnungen
  * Darstellung von Bestell- & Produktionsstatus mit Echtzeitdaten

---

## Sicherheit & Datenschutz

* DSGVO-konformes Berechtigungskonzept mit rollenbasiertem Zugriff (Admin, Einkauf, Lager, Produktion)
* Zugriffsschutz über JSON Web Tokens (JWT), signiert mit HMAC SHA-256
* Verschlüsselung auf Transportebene (HTTPS/TLS 1.3) und optionaler AES-256-Verschlüsselung in RDS
* Schutzmaßnahmen gegen gängige Web-Bedrohungen:

  * **SQL Injection**: Verhindert durch Prepared Statements
  * **XSS/CSRF**: Absicherung via Token-Management, HTTP-Header und CORS-Policies
  * **Brute Force & Rate Limits**: Durch Integration mit API Gateway Throttling
  * Logging & Monitoring durch AWS CloudWatch, inkl. Alarme bei Anomalien

---

## Team & Rollen

* **Julian B.** – Frontend, DB-Modellierung, Dokumentation, Security-Konzept

  -> GitHub: [@1Jul1an](https://github.com/1Jul1an)

* **Omar K.** – Authentifizierung, API-Integration, Deployment

  -> GitHub: [@Ok963](https://github.com/Ok963)

* **Richard P.** – Backend, Datenbank, Architektur, Logging

  -> GitHub: [@r-peist](https://github.com/r-peist)

* **Ben V.** – AWS Setup, Protokoll, Anforderungsanalyse

  -> GitHub: [@B3n-31](https://github.com/B3n-31)

* **Franz L.** – Stakeholderanalyse, AWS Deploy, Requirements

  -> GitHub: [@FranzRL](https://github.com/FranzRL)

---

## Screenshots

### Warenübersicht & Rezeptverwaltung (Use-Case 1)

![WMS-Dashboard](https://github.com/user-attachments/assets/2cbdfc0b-8962-45e1-a843-fa8a1508a7a3)
*Intuitive Oberfläche*

### Inventurmodus & Umlagerung (Use-Case 2)

![WMS-Inventory](https://github.com/user-attachments/assets/43f7a582-5d08-439d-acb9-61d54e9e0acb)
*Materialverfolgung mit Datumsfilter und Standortwechsel.*

---

## Lizenz & Hinweise

Dieses Repository dient ausschließlich zur Demonstration und wurde im Rahmen eines Hochschulprojekts erstellt.

Für Entwicklungshistorie und den ursprünglichen Quellstand siehe:
[Original Repository (unbereinigt)](https://github.com/r-peist/CandleWaWi)
