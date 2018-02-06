#include "MagneticSensor.h"

void MagneticSensor::begin(uint8_t _pin){
  pin = _pin;
  pinMode(pin, INPUT);
}

void MagneticSensor::loop(){
  val = get();
  if(val == HIGH){
      Serial.println("Magnetic Sensor: Circuito Abierto");
  }else{
    Serial.println("Magnetic Sensor: Circuito Cerrado");
  }
}

bool MagneticSensor::get(){
  return digitalRead(pin);
}
