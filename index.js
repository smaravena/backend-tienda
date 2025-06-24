const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const AWS = require("aws-sdk");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// REGION
AWS.config.update({ region: "us-east-1" });

// SECRETS
const CLIENT_ID = "";
const CLIENT_SECRET = "";
const USER_POOL_ID = "";

// AWS CONSOLE SECRETS
const accessKeyId ="";
const secretAccessKey = "";
const sessionToken="";
AWS.config.update({accessKeyId,secretAccessKey,sessionToken});

// GEN HASH
function generateSecretHash(username) {
  return crypto
    .createHmac("SHA256", CLIENT_SECRET)
    .update(username + CLIENT_ID)
    .digest("base64");
}

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Falta username o password" });
  }

  const cognito = new AWS.CognitoIdentityServiceProvider();

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: generateSecretHash(username),
    },
  };

  try {
    const response = await cognito.initiateAuth(params).promise();

    if (
      response.AuthenticationResult &&
      response.AuthenticationResult.IdToken
    ) {
      res.json({
        token: response.AuthenticationResult.IdToken,
        accessToken: response.AuthenticationResult.AccessToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
      });
    } else {
      console.warn("Autenticación incompleta:", response);
      res
        .status(400)
        .json({ error: "Autenticación incompleta", response });
    }
  } catch (err) {
    console.error("Error al autenticar:", err);
    res
      .status(400)
      .json({ error: err.message || JSON.stringify(err) });
  }
});

// REGISTER ROUTE
app.post("/register", async (req, res) => {
  const { username, password, email, name, familyName } = req.body;

  if (!username || !password || !email || !name || !familyName) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const cognito = new AWS.CognitoIdentityServiceProvider();

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    SecretHash: generateSecretHash(username),
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
      { Name: "family_name", Value: familyName },
    ],
  };

  try {
    const data = await cognito.signUp(params).promise();
    res.json({ message: "Usuario registrado con éxito", data });
  } catch (err) {
    console.error("Error al registrar:", err);
    res.status(400).json({ error: err.message || JSON.stringify(err) });
  }
});

// CONFIRM ROUTE
app.post("/confirm", async (req, res) => {
  const { username, code } = req.body;

  if (!username || !code) {
    return res.status(400).json({ error: "Se requiere username y código de confirmación" });
  }

  const cognito = new AWS.CognitoIdentityServiceProvider();

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
    SecretHash: generateSecretHash(username),
  };

  try {
    const data = await cognito.confirmSignUp(params).promise();
    res.json({ message: "Usuario confirmado exitosamente", data });
  } catch (err) {
    console.error("Error al confirmar:", err);
    res.status(400).json({ error: err.message || JSON.stringify(err) });
  }
});

// LIST USERS ROUTE
app.get("/users", async (req, res) => {
  const cognito = new AWS.CognitoIdentityServiceProvider(); 
  const users = [];
  let paginationToken = undefined;

  try {
    do {
      const params = {
        UserPoolId: USER_POOL_ID,
        PaginationToken: paginationToken,
      };

      const response = await cognito.listUsers(params).promise();

      for (const user of response.Users) {
        try {
          const groupResp = await cognito.adminListGroupsForUser({
            Username: user.Username,
            UserPoolId: USER_POOL_ID
          }).promise();

          const grupo = groupResp.Groups[0]?.GroupName || "Sin grupo";

          users.push({
            Email: user.Attributes.find(attr => attr.Name === 'email')?.Value || null,
            Name: user.Attributes.find(attr => attr.Name === 'name')?.Value || null,
            FamilyName: user.Attributes.find(attr => attr.Name === 'family_name')?.Value || null,
            Group: grupo
          });

        } catch (err) {
          console.warn(`Error con el usuario ${user.Username}: ${err.message}`);
          users.push({
            Username: user.Username,
            Email: user.Attributes.find(attr => attr.Name === 'email')?.Value || null,
            Group: "Sin grupo"
          });
        }
      }

      paginationToken = response.PaginationToken;

    } while (paginationToken);

    // SORT BY GROUP ASC
    users.sort((a, b) => a.Group.localeCompare(b.Group));

    res.json(users);

  } catch (error) {
    console.error("Error al obtener usuarios:", error.message, error.stack);
    res.status(500).json({ 
      error: "Error al obtener usuarios de Cognito",
      message: error.message 
    });
  }
});

//VER ESTO
/*
app.get("/protegido", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const decoded = jwt.decode(token);

  if (!decoded["cognito:groups"]?.includes("seguridad")) {
    return res.status(403).json({ error: "Acceso denegado: no pertenece al grupo 'seguridad'" });
  }

  res.json({ mensaje: "Acceso concedido al grupo seguridad" });
});
*/

// START SERVER
const PORT = 3000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Servidor corriendo en http://35.168.133.16:${PORT}`);
});
