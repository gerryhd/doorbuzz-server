#ifndef MAGNETICSENSOR_H
#define MAGNETICSENSOR_H

#include <Arduino.h>

class MagneticSensor {
private:
  uint8_t pin;
  int val = 0;
public:
  void begin(uint8_t _pin);
  void loop();
  bool get();
};

#endif //MAGNETICSENSOR_H
