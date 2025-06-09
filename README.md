 # backend-tienda

 Este README explica cómo probar los endpoints del backend.

 ---

 ## Cómo probar endpoints

 Para cada endpoint, usar el método **POST** y la URL base `http://35.168.133.16:3000`. Asegúrate de seleccionar **`raw`** en el cuerpo de la solicitud (body) e ingresar el JSON.

 ### Ruta `/login`

 **Cuerpo de la solicitud (Body):**
 ```json
 {
   "username":"user",
   "password":"password"
 }
 ```

 **Posibles errores:**
 * `400 Bad Request`: Credenciales inválidas o usuario no confirmado.
 * `401 Unauthorized`: Acceso denegado.

 **Respuesta exitosa:**
 ```json
 {
   "token": "token",
   "accessToken": "accestoken",
   "refreshToken": "refreshtoken"
 }
 ```

 ---

 ### Ruta `/register`

 **Cuerpo de la solicitud (Body):**
 ```json
 {
   "username": "usuario123",
   "password": "Contrasena123.",
   "email": "usuario@gmail.com",
   "name": "Nombre",
   "familyName": "Apellido"
 }
 ```

 **Posibles errores:**
 * `400 Bad Request`: Faltan campos obligatorios, el usuario ya existe, o hay errores de validación.

 **Respuesta exitosa:**
 ```json
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
 ```

 ---

 ### Ruta `/Confirm`

 **Cuerpo de la solicitud (Body):**
 ```json
 {
   "username":"usuario",
   "code":"CodigoDeVerificacion"
 }
 ```

 **Posibles errores:**
 * `400 Bad Request`: Código incorrecto, expirado o usuario inexistente.

 **Respuesta exitosa:**
 ```json
 {
   "message": "Usuario confirmado exitosamente",
   "data": {}
 }
 ```
