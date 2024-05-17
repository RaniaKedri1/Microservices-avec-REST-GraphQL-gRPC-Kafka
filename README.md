Introduction:

This project demonstrates the implementation of a microservices architecture using Node.js, gRPC, MongoDB, Kafka, and GraphQL.

🔰 About:
This project showcases how to create and manage episodes and videos using a microservices architecture. It leverages gRPC for inter-service communication and GraphQL for querying and mutating data.

⚡ Usage:
Instructions on how to use the Microservices Demo Project.

🔌 Installation:
To install and set up the project, follow these steps:

Clone the repository:

	https://github.com/RaniaKedri1/Project_Microservices.git
 
Set up Kafka and Zookeeper:
1.Create Kafka topics:

	.\bin\kafka-topics.sh --create --partitions 1 --replication-factor 1 --topic movies-topic --bootstrap-server localhost:9092
	.\bin\kafka-topics.sh --create --partitions 1 --replication-factor 1 --topic tvshows-topic --bootstrap-server localhost:9092
 
2.Start Zookeeper:
Open Command Prompt as Administrator.
Navigate to the Kafka directory and start Zookeeper:

 	cd C:\kafka
	.\bin\windows\zookeeper-server-start.bat config\zookeeper.properties

3.Start Kafka:
Open a new Command Prompt session as Administrator.
Navigate to the Kafka directory and start Kafka:
	
 	cd C:\kafka
	.\bin\windows\kafka-server-start.bat config\server.properties


📦 Commands
To start the services, run the following commands:
Start the API Gateway:

	nodemon apiGateway.js
 
 Start the Episode Microservice:
 
 	nodemon episodeMicroservice.js
  
  Start the Video Microservice:

  	nodemon videoMicroservice.js

🔧 Development
Guidelines for contributing to the Microservices Demo Project.

📓 Pre-Requisites
	Node.js (v14 or higher)
	npm (v6 or higher)
	MongoDB
	gRPC
Ensure MongoDB is running.
📁 File Structure
The basic file structure is as follows:

mini-projet-microservice

	├── api
	│   ├── apiGateway.js
	│   ├── resolvers.js
	├── database
	│   └── db.js
	├── models
	│   ├── episodeModel.js
	│   ├── videoModel.js
	├── proto
	│   ├── episode.proto
	│   ├── video.proto
	├── services
	│   ├── episodeMicroservice.js
	│   ├── videoMicroservice.js
	├── kafkaHelper.js
	├── schema.js
	├── package.json
	├── package-lock.json
	└── README.md

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
API Gateway <-> Microservices
Microservices <-> MongoDB
Microservices <-> Kafka
