#include "Button.h"

void Button::begin(uint8_t _pin)
{
  pin = _pin;
  pinMode(pin, INPUT);
  prevPress = false;
}

bool Button::pressed() {
  bool isPressed = false;
  bool pressed = !digitalRead(pin);
  if(pressed && !prevPress) {
    isPressed = true;
  }
  prevPress = pressed;
  return isPressed;
}
