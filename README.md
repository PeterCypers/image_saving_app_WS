# Examenopdracht Web Services

- Student: Peter Cypers
- Studentennummer: 202185333
- E-mailadres: <mailto:peter.cypers@student.hogent.be>

## <u>Project: Image Saving Application</u>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

For users of [Chocolatey](https://chocolatey.org/):

```powershell
choco install nodejs -y
choco install yarn -y
choco install mysql -y
choco install mysql.workbench -y
```

Voor gebruikers van [Homebrew](https://brew.sh/):

```powershell
brew install node
brew install yarn
brew install mysql
brew install --cask mysqlworkbench
```

### Project verbinden met online database(enkel ter info)

Maak een nieuwe `.env` (development) file aan, in dezelfde folder als de src, met deze template:

```ini
NODE_ENV=development
DATABASE_HOST=vichogent.be
DATABASE_PORT=40043
DATABASE_USERNAME=185333pc
DATABASE_PASSWORD=yKiLqME9ItaMrwXwWNbo
```

### Project verbinden met lokale database(required)

Dit is nodig om het project lokaal te laten lopen en lokaal te testen.

1. Maak een nieuwe `.env` (development) file aan, in dezelfde folder als de src, met deze template:

```ini
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=<jouw_db_connectie_gebruikersnaam>
DATABASE_PASSWORD=<jouw_db_connectie_paswoord>
JWT_SECRET=<jouw_jwt_secret_code>
```

2. Maak een nieuw schema genaamd `185333pc` aan in de lokale mysql database met mysql workbench

Ter info: de JWT mag eender welke string van tekens zijn, best zo lang mogelijk om hackers tegen te gaan.

## Opstarten

- Installeer alle dependencies: `yarn install`
- Maak een `.env` file aan (zie boven)
- Start de development server: `yarn start`

## Testen

Maak een nieuwe `.env.test` (test) file aan, in dezelfde folder als de src, met deze template:

```ini
NODE_ENV=test
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=<jouw_db_connectie_gebruikersnaam>
DATABASE_PASSWORD=<jouw_db_connectie_paswoord>
JWT_SECRET=<jouw_jwt_secret_code>
```

De tests gebeuren op een lokaal database connectie. Pas deze gegevens aan naar je eigen database connectie.

Ik gebruik localhost op poort 3306 (evt. aanpassen naar je eigen verkozen mysql-connectie)

- Installeer alle dependencies: `yarn install`
- Maak een `.env.test` file aan (zie boven)
- Run de tests op de server: `yarn test`
- Testen met meer info over de coverage: `yarn test:coverage`