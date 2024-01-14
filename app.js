// Dans votre script principal, par exemple, index.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
(async () => {
    try {
        await sequelize.sync(); // Ceci créera la table si elle n'existe pas déjà
        console.log('La synchronisation avec la base de données est réussie.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation avec la base de données :', error);
    }
})();

// index.js

const { Pool } = require('pg');
const dbConfig = require('./config');

const pool = new Pool(dbConfig);

pool.query('SELECT ST_AsGeoJSON(geom) as geometry, gid, name, alt_name, cross_st, long_name, label, borough, nghbhd, routes, transfers, color, express, closed FROM nyc_subway_stations', (error, results) => {
    if (error) {
        console.error('Erreur lors de l\'exécution de la requête SQL :', error);
    } else {
        const geojson = {
            type: 'FeatureCollection',
            features: results.rows.map(row => ({
                type: 'Feature',
                geometry: JSON.parse(row.geometry),
                properties: {
                    gid: row.gid,
                    name: row.name,
                    alt_name: row.alt_name,
                    cross_st: row.cross_st,
                    long_name: row.long_name,
                    label: row.label,
                    borough: row.borough,
                    nghbhd: row.nghbhd,
                    routes: row.routes,
                    transfers: row.transfers,
                    color: row.color,
                    express: row.express,
                    closed: row.closed,
                },
            })),
        };

        console.log('GeoJSON récupéré avec succès :', geojson);
    }

    pool.end(); // Fermez la connexion après avoir exécuté la requête
});

app.use(express.static('public'));

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
