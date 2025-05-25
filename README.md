# backend-tienda
Como probar endpoints en postman:
Despues de selccionar post e ingresar http://3.91.242.183, debemos seleccionar raw e ingresar el siguiente body:
Ruta /login
{
  "username":"user",
  "password":"password"
}
Posibles errores: 400 Bad Request: Credenciales inválidas o usuario no confirmado u 401 Unauthorized: Acceso denegado
Si todo esta correcto,la respuesta sera:
{
  "token": "token",
  "accessToken": "accestoken",
  "refreshToken": "refreshtoken"
}
Ruta /register(POST):
{
  "username": "usuario123",
  "password": "Contrasena123.",
  "email": "usuario@gmail.com",
  "name": "Nombre",
  "familyName": "Apellido"
}
Posibles Errores: 400 Bad Request: Faltan campos obligatorios, el usuario ya existe, o hay errores de validación.
Si todo esta correcto,la respuesta sera: 
{
  "message": "Usuario registrado con éxito",
  "data": {
    "UserConfirmed": false,
    "CodeDeliveryDetails": {
      "AttributeName": "email",
      "DeliveryMedium": "EMAIL",
      "Destination": "u***@e***.com"
    },
    "UserSub": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
Ruta /Confirm (POST):
Ingresar siguiente body:
{
  "username":"usuario"
  "code":"CodigoDeVerificacion"
}
Posibles errores:  400 Bad Request: Código incorrecto, expirado o usuario inexistente.
Si todo esta correcto, la respuesta sera:
{
  "message": "Usuario confirmado exitosamente",
  "data": {}
}
