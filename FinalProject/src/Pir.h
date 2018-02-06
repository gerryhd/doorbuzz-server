#ifndef PIR_H
#define PIR_H

#include <Arduino.h>

class Pir {
private:
  uint8_t pin;
  int val = 0;
public:
  void begin(uint8_t _pin);
  void loop();
  bool get();
};

#endif //PIR_H
