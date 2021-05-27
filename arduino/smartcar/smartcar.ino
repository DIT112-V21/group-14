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

const auto oneSecond = 1000UL;
const int GYROSCOPE_OFFSET = 37;
const auto pulsesPerMeter = 400;

DirectionlessOdometer leftOdometer{
    arduinoRuntime,
    smartcarlib::pins::v2::leftOdometerPin,
    []() { leftOdometer.update(); },
    pulsesPerMeter};

DirectionlessOdometer rightOdometer{
    arduinoRuntime,
    smartcarlib::pins::v2::rightOdometerPin,
    []() { rightOdometer.update(); },
    pulsesPerMeter};

GY50 gyro(arduinoRuntime, GYROSCOPE_OFFSET);

SmartCar car(arduinoRuntime, control, gyro, leftOdometer, rightOdometer);

void setup() {
  Serial.begin(9600);
#ifndef __SMCE__
  mqtt.begin(net);
#else
  Camera.begin(VGA, RGB888, 30);
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
      mqtt.publish("/smartcar/sensors/camera", frameBuffer.data());
    }
#endif
    static auto previousTransmission = 0;
    if (currentTime - previousTransmission >= oneSecond) {
      previousTransmission = currentTime;
      gyro.update();
      mqtt.publish("/smartcar/sensors/gyro", String(car.getHeading()));
      mqtt.publish("/smartcar/sensors/distance", String(car.getDistance()));
      mqtt.publish("/smartcar/sensors/speed", String(car.getSpeed()));
    }
  }
#ifdef __SMCE__
  delay(10);
#endif
}