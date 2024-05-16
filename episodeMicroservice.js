// episodeMicroservice.js
const grpc = require('@grpc/grpc-js');
const mongoose = require('mongoose');
const protoLoader = require('@grpc/proto-loader');
const { consumeMessages, sendMessage } = require('./kafkaHelper');

// Charger le fichier episode.proto
const episodeProtoPath = 'episode.proto';
const episodeProtoDefinition = protoLoader.loadSync(episodeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const episodeProto = grpc.loadPackageDefinition(episodeProtoDefinition).episode;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/MiniProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the episode schema    
const episodeModel = mongoose.model('episode', {
    title: String,
    description: String,
});

// Implémenter le service episode
const episodeService = {
    getepisode: async (call, callback) => {
        const { episode_id } = call.request;
        try {
            // Find the episode by its ID in the database
            const episode = await episodeModel.findOne({ _id: episode_id });
            if (!episode) {
                const notFoundError = new Error(`episode with ID ${episode_id} not found`);
                console.error(notFoundError);
                throw notFoundError;
            }
            console.log('episode retrieved successfully:', episode);
            callback(null, { episode });
        } catch (err) {
            console.error('Error retrieving episode:', err);
            callback(err);
        }
    },

    // Search for episodes where title or description contains the query string
    searchepisodes: async (call, callback) => {
        const { query } = call.request;
        try {
            const episodes = await episodeModel.find({
                $or: [
                    { title: { $regex: `^.*${query}.*`, $options: 'i' } },
                ]
            });
            callback(null, { episodes });
        } catch (err) {
            console.error('Error searching episodes:', err);
            callback(err);
        }
    },
    // Ajouter d'autres méthodes au besoin
    createepisode: async (call, callback) => {
        const { title, description } = call.request;
        const newepisode = new episodeModel({
            title,
            description
        });
        const savedepisode = await newepisode.save()
        await sendMessage('episodes_topic', savedepisode);
        callback(null, { episode: savedepisode });
        await consumeMessages('episodes_topic', savedepisode);
    },
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(episodeProto.episodeService.service, episodeService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Échec de la liaison du serveur:', err);
            return;
        }
        console.log(`Le serveur s'exécute sur le port ${port}`);
        server.start();
    });
console.log(`Microservice de films en cours d'exécution sur le port ${port}`);