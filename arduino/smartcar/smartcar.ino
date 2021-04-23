#include <Smartcar.h>
#include <MQTT.h>
#include <WiFi.h>

#ifndef __SMCE__
WiFiClient net;
#endif
MQTTClient mqtt;

const int TRIGGER_PIN           = 6; 
const int ECHO_PIN              = 7; 
const unsigned int MAX_DISTANCE = 200;
const int FRONT_PIN = 0;
const auto oneSecond = 1000UL;


ArduinoRuntime arduinoRuntime;
SR04 front(arduinoRuntime, TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
GP2Y0A21 frontIR(arduinoRuntime, FRONT_PIN); 
BrushedMotor leftMotor(arduinoRuntime, smartcarlib::pins::v2::leftMotorPins);
BrushedMotor rightMotor(arduinoRuntime, smartcarlib::pins::v2::rightMotorPins);
DifferentialControl control(leftMotor, rightMotor);

SimpleCar car(control);

void setup()
{
  Serial.begin(9600);
  #ifndef __SMCE__
  mqtt.begin(net);
  #else
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

void loop()
{
  if (mqtt.connected()){
    mqtt.loop();
  }
  static long previousTransmission = 0;
  const auto currentTime = millis();
  if (currentTime - previousTransmission >= oneSecond) {
    previousTransmission = currentTime;
    mqtt.publish("/smartcar/sensors/ultra", String(front.getDistance()));
    mqtt.publish("/smartcar/sensors/infra", String(frontIR.getDistance()));
  }
  delay(10);
}
