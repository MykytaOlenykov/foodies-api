# 🍽️ Foodies API

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root directory based on the example:

```bash
cp .env.example .env
```

Then update the `.env` file

### 3. Run the app in development mode

```bash
npm run dev
```

### 4. Initialize the Database (for a fresh setup)

If you're setting up the project with a fresh database, run the following commands to sync the schema and populate initial data:

```bash
node ./db/sync.js    # Creates tables based on Sequelize models
```

```bash
node ./db/seed.js    # Inserts seed data into the database
```

## ⚙️ Requirements

- **Node.js v22+**
