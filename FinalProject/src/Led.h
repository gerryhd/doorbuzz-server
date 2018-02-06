#ifndef LED_H
#define LED_H

#include <Arduino.h>

class Led {
private:
  uint8_t pin;
public:
  void begin(uint8_t _pin);
  void set(bool on);
  void toggle();
  bool get();
};

#endif //LED_H
