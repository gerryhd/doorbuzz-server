#include "Led.h"

void Led::begin(uint8_t _pin)
{
  pin = _pin;
  pinMode(pin, OUTPUT);
  set(false);
}

void Led::set(bool on)
{
  digitalWrite(pin, !on);
}

void Led::toggle()
{
  digitalWrite(pin, !digitalRead(pin));
}

bool Led::get()
{
  return !digitalRead(pin);
}
