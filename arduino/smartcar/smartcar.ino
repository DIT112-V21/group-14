#include <Smartcar.h>
#include <MQTT.h>
#include <WiFi.h>
#ifdef __SMCE__
#include <OV767X.h>
#include <vector>
std::vector<char> frameBuffer;
#endif

#ifndef __SMCE__
WiFiClient net;
#endif
MQTTClient mqtt;

ArduinoRuntime arduinoRuntime;
BrushedMotor leftMotor(arduinoRuntime, smartcarlib::pins::v2::leftMotorPins);
BrushedMotor rightMotor(arduinoRuntime, smartcarlib::pins::v2::rightMotorPins);
DifferentialControl control(leftMotor, rightMotor);
SimpleCar car(control);

const int TRIGGER_PIN = 6; 
const int ECHO_PIN = 7; 
const unsigned int MAX_DISTANCE = 200;
const int FRONT_PIN = 0;
const auto oneSecond = 1000UL;
SR04 front(arduinoRuntime, TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
GP2Y0A21 frontIR(arduinoRuntime, FRONT_PIN); 


void setup() {
  Serial.begin(9600);
#ifndef __SMCE__
  mqtt.begin(net);
#else
  Camera.begin(QVGA, RGB888, 15);
  frameBuffer.resize(Camera.width() * Camera.height() * Camera.bytesPerPixel());
  mqtt.begin(WiFi);
#endif
  if (mqtt.connect("arduino", "public", "public")) {
    mqtt.subscribe("/smartcar/control/#", 1);
    mqtt.onMessage([](String topic, String message) {
      if (topic  == "/smartcar/control/throttle") {
        car.setSpeed(message.toInt());
      } else if(topic == "/smartcar/control/steering") {
        car.setAngle(message.toInt());
      } else {
      Serial.println("Topic: " + topic + " Message: " + message);
      }
    });
  }
}

void loop() {
  if (mqtt.connected()){
    mqtt.loop();
    const auto currentTime = millis();
#ifdef __SMCE__
    static auto previousFrame = 0UL;
    if (currentTime - previousFrame >= 65) {
      previousFrame = currentTime;
      Camera.readFrame(frameBuffer.data());
      mqtt.publish("/smartcar/camera", frameBuffer.data(), frameBuffer.size(), false, 0);
    }
#endif
    static auto previousTransmission = 0;
    if (currentTime - previousTransmission >= oneSecond) {
      previousTransmission = currentTime;
      mqtt.publish("/smartcar/sensors/ultra", String(front.getDistance()));
      mqtt.publish("/smartcar/sensors/infra", String(frontIR.getDistance()));
    }
  }
#ifdef __SMCE__
  delay(10);
#endif
}
