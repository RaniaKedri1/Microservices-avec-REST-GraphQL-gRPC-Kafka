// resolvers.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader'); //for loading protocol buffer files
// Charger les fichiers proto pour les videos et les episodes
const episodeProtoPath = 'episode.proto';
const videoProtoPath = 'video.proto';
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
// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
    Query: {
        episode: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de episodes
            const client = new episodeProto.episodeService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getepisode({ episode_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.episode);
                    }
                });
            });
        },
        episodes: () => {
            // Effectuer un appel gRPC au microservice de episodes
            const client = new episodeProto.episodeService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchepisodes({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.episodes);
                    }
                });
            });
        },
        video: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de video
            const client = new videoProto.videoService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getvideo({ video_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.video);
                    }
                });
            });
        },
        videos: () => {
            // Effectuer un appel gRPC au microservice de video
            const client = new videoProto.videoService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchvideos({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.videos);
                    }
                });
            });
        },
    },

    Mutation: {
        addepisode: async (_, { title, description }) => {
            const client = new episodeProto.episodeService('localhost:50051', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.createepisode({ title, description }, function (err, response) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.episode);
                    }
                });
            });
        },
        addvideo: async (_, { title, description }) => {
            const client = new videoProto.videoService('localhost:50052', grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.Createvideo({ title, description }, function (err, response) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.video);
                    }
                });
            });
        }
    }




};
module.exports = resolvers;