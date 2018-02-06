#include "Pir.h"

void Pir::begin(uint8_t _pin)
{
  pin = _pin;
  pinMode(pin, INPUT);
}

void Pir::loop(){
  val = get();
  if(val == HIGH){
      Serial.println("Sensor Pir: Presencia Detectada");
  }else{
    Serial.println("Sensor Pir: Se ha detenido la presencia");
  }
}

bool Pir::get()
{
  return digitalRead(pin);
}
