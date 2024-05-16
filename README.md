Overview:👨‍💻
This mini-project demonstrates the implementation of microservices architecture using Node.js, gRPC, MongoDB , Kafka, and GraphQL. 
The project consists of an API Gateway, episode microservice, and video microservice, each serving different functionalities related to episodes and videos.

📄Components:
1.API Gateway (apiGateway.js):
Responsible for routing requests to the appropriate microservices.
Utilizes Express.js and Apollo Server for handling GraphQL requests.
Communicates with the episode microservice and video microservice via gRPC for CRUD operations.
Connects to MongoDB to store and retrieve data.

2.Episode Microservice (episodeMicroservice.js):
Implements gRPC server for episode-related operations.
Defines gRPC methods to get, search, and create episodes.
Uses MongoDB to store episode data.
Integrates with Kafka for message consumption and production.

3.Video Microservice (videoMicroservice.js):
Similar to the episode microservice, but deals with video-related operations.
Implements gRPC server for video-related operations.
Defines gRPC methods to get, search, and create videos.
Utilizes MongoDB to store video data.
Integrates with Kafka for message consumption and production.

4.Resolvers (resolvers.js):
Contains resolver functions for GraphQL queries and mutations.
Utilizes gRPC clients to communicate with the episode and video microservices.
Maps GraphQL queries to gRPC service methods for fetching data.

5.Kafka Helper (kafkaHelper.js):
Provides functionality to interact with Kafka.
Configures Kafka producer and consumer for sending and receiving messages.
Used by episode and video microservices for asynchronous message processing.

6.GraphQL Schema (schema.js):
Defines the GraphQL schema for episodes and videos.
Specifies the structure of queries and mutations available to clients.

📄Data Schema:

     Episode Schema:
	_id: Unique identifier for episodes.
	title: Title of the episode.
	description: Description of the episode.
 
     Video Schema:
	id: Unique identifier for videos.
	title: Title of the video.
	description: Description of the video.
 
📄Interactions:
API Gateway <-> Microservices:
API Gateway routes requests to the appropriate microservice based on the request URL.
Utilizes gRPC for communication between API Gateway and microservices.

Microservices <-> MongoDB:
Microservices interact with MongoDB for storing and retrieving episode and video data.

Microservices <-> Kafka:
Microservices integrate with Kafka for asynchronous message processing.
Kafka is used for message production and consumption within microservices.
