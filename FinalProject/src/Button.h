#ifndef BUTTON_H
#define BUTTON_H

#include <Arduino.h>

class Button {
private:
  uint8_t pin;
  bool prevPress;
public:
  void begin(uint8_t _pin);
  bool pressed();
};

#endif //BUTTON_H
