# Group-14 

**What is this application?**

We made an Arduino-powered car controllable through a keyboard and controller, such as an Xbox one. It also uses object detection to analyze images, allowing the car to recognize the trees in front of it. 

We implemented the interface to be user friendly and elegant, making it easy for anyone to use our app. 

**Why did we make it?**

We did this to experiment with computer vision and machine learning to help conceptualize self-driving cars. This helped us greatly improve our coding skills by using many new and different coding languages. 

**What problem does it solve?**

We used machine learning and communications between different languages in this application to learn and experience how an application works. This gave us insight on the basics of applications to help us innovate in the industry in the future.

As it is now the application can be used to drive a small car around for e.g. delivering small packages whilst informing the driver about obstacles. 

**How did we make it?**

The application was built using Electron on top of JavaScript. We chose to do it this way because we could make use of HTML and CSS for the user interface, which are very easy to use. 

Car’s logic is implemented in JavaScript and the car is controlled by C++ by sending commands through a MQTT broker.

We used Tensorflow in Python to process the images. We chose to use Tensorflow because it has great documentation and because of its speed.

**Video**

link

**Getting Started**

-> Node.js
-> SMCE
-> MQTT
	-> Suggestion: MQTT Explorer
-> Anaconda (Python)
-> Tensorflow

Setup information can be found on our wiki.
