// videoMicroservice.js
const grpc = require('@grpc/grpc-js');
const mongoose = require('mongoose');
const protoLoader = require('@grpc/proto-loader');
const { consumeMessages, sendMessage } = require('./kafkaHelper')
// Charger le fichier video.proto
const videoProtoPath = 'video.proto';
const videoProtoDefinition = protoLoader.loadSync(videoProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const videoProto = grpc.loadPackageDefinition(videoProtoDefinition).video;

mongoose.connect('mongodb://localhost:27017/MiniProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the episode schema
const videoModel = mongoose.model('video', {
    title: String,
    description: String,
});

// Implémenter le service de séries TV
const videoService = {
    getvideo: async (call, callback) => {
        // Récupérer les détails de la série TV à partir de la base de données
        const { video_id } = call.request;
        try {
            // Find the video by its ID in the database
            const video = await videoModel.findOne({ _id: video_id });
            if (!video) {
                const notFoundError = new Error(`episode with ID ${video_id} not found`);
                console.error(notFoundError);
                throw notFoundError;
            }
            console.log('episode retrieved successfully:', video);
            callback(null, { video: video });
        } catch (err) {
            console.error('Error retrieving episode:', err);
            callback(err);
        }
    },
    // Search for video where title or description contains the query string
    Searchvideos: async (call, callback) => {
        const { query } = call.request;
        try {
            const video = await videoModel.find({
                $or: [
                    { title: { $regex: `^.*${query}.*`, $options: 'i' } },
                ]
            });
            callback(null, { videos: video });
        } catch (err) {
            console.error('Error searching tv Show:', err);
            callback(err);
        }
    },

    Createvideo: async (call, callback) => {
        const { title, description } = call.request;
        const newvideo = new videoModel({
            title,
            description,
        });
        const savedvideo = await newvideo.save()
        await sendMessage('videos_topic', { title, description });
        callback(null, { video: savedvideo });
        await consumeMessages('videos_topic', savedvideo);
    },
};
// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(videoProto.videoService.service, videoService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
    (err, port) => {
        if (err) {
            console.error('Échec de la liaison du serveur:', err);
            return;
        }
        console.log(`Le serveur s'exécute sur le port ${port}`);
        server.start();
    });
console.log(`Microservice de séries TV en cours d'exécution sur le port ${port}`);
consumeMessages('new_videos');