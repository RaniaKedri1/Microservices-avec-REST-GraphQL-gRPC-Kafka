// apiGateway.js
const mongoose = require('mongoose');
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les films et les séries TV
const episodeProtoPath = 'episode.proto';
const videoProtoPath = 'video.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Créer une nouvelle application Express
const app = express();
const episodeProtoDefinition = protoLoader.loadSync(episodeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const videoProtoDefinition = protoLoader.loadSync(videoProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const episodeProto = grpc.loadPackageDefinition(episodeProtoDefinition).episode;
const videoProto = grpc.loadPackageDefinition(videoProtoDefinition).video;

// Connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/MiniProject', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });
// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
    );
});
app.use(bodyParser.json());
app.get('/episodes', (req, res) => {
    const client = new episodeProto.episodeService('localhost:50051',
        grpc.credentials.createInsecure());
    client.searchepisodes({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.episodes);
        }
    });
});
app.get('/episodes/:id', (req, res) => {
    const client = new episodeProto.episodeService('localhost:50051',
        grpc.credentials.createInsecure());
    const _id = req.params.id;
    client.getepisode({ episode_id: _id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.episode);
        }
    });
});

app.post('/episodes/create', (req, res) => {
    const client = new episodeProto.episodeService('localhost:50051', grpc.credentials.createInsecure());
    const { title, description } = req.body;

    // Check if title and description are present
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const request = { title, description };

    client.createepisode(request, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.episode);
        }
    });
});

app.get('/videos', (req, res) => {
    const client = new videoProto.videoService('localhost:50052',
        grpc.credentials.createInsecure());
    client.searchvideos({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.videos);
        }
    });
});
app.get('/videos/:id', (req, res) => {
    const client = new videoProto.videoService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getvideo({ videoId: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.video);
        }
    });
});

app.post('/episodes/create', (req, res) => {
    const client = new videoProto.videoService('localhost:50052', grpc.credentials.createInsecure());
    const { title, description } = req.body;

    // Check if title and description are present
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const request = { title, description };

    client.createepisode(request, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.video);
        }
    });
});
// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
    connectToMongoDB();
    console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});