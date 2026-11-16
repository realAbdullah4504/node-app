const http = require("node:http");
const { OAuth2Client } = require("google-auth-library");

const PORT = process.env.PORT || 8080;

const EXPECTED_AUDIENCE =
  "/projects/125883305568/global/backendServices/3977996298811115627";

const EXPECTED_ISSUER = "https://cloud.google.com/iap";
const oauth2Client = new OAuth2Client();

// Sandbox-only application users and permissions.
// The key is the verified Google subject, not a request header.
const DEMO_USERS = {
  "accounts.google.com:100941514123938136313": {
    id: "demo-admin-1",
    role: "admin",
    permissions: ["users:read", "users:manage"],
  },
};

async function validateIapJwt(assertion) {
  if (!assertion) {
    throw new Error("IAP JWT header is missing");
  }

  const response = await oauth2Client.getIapPublicKeys();

  const ticket = await oauth2Client.verifySignedJwtWithCertsAsync(
    assertion,
    response.pubkeys,
    EXPECTED_AUDIENCE,
    [EXPECTED_ISSUER]
  );

  const payload = ticket.getPayload();
  const [encodedHeader] = assertion.split(".");
  const jwtHeader = JSON.parse(
    Buffer.from(encodedHeader, "base64url").toString("utf8")
  );

  if (jwtHeader.alg !== "ES256") {
    throw new Error("Unexpected JWT signing algorithm");
  }

  if (!payload || !payload.email || !payload.sub) {
    throw new Error("Required identity claims are missing");
  }

  const now = Math.floor(Date.now() / 1000);
  const clockSkew = 30;
  const maxLifetime = 10 * 60 + 2 * clockSkew;

  if (
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number" ||
    payload.iat > now + clockSkew ||
    payload.exp <= now - clockSkew ||
    payload.exp <= payload.iat ||
    payload.exp - payload.iat > maxLifetime
  ) {
    throw new Error("JWT time claims are invalid");
  }

  return {
    email: payload.email,
    subject: payload.sub,
    issuer: payload.iss,
    audience: payload.aud,
    expiresAt: payload.exp,
  };
}

function sendJson(res, status, body) {
  res.writeHead(status);
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  let identity;

  // Stage 1: Authenticate the request by verifying the IAP JWT.
  try {
    const assertion = req.headers["x-goog-iap-jwt-assertion"];

    identity = await validateIapJwt(
      Array.isArray(assertion) ? assertion[0] : assertion
    );
  } catch (error) {
    console.error("IAP JWT validation failed:", error.message);

    return sendJson(res, 401, {
      message: "IAP JWT validation failed",
      authenticated: false,
    });
  }

  // Stage 2: Map the verified Google subject to an application user.
  const appUser = DEMO_USERS[identity.subject];

  if (!appUser) {
    return sendJson(res, 403, {
      message: "Authenticated Google user is not registered in this application",
      authenticated: true,
      authorized: false,
    });
  }

  const url = new URL(req.url, "http://localhost");
  const pathname = url.pathname.replace(/^\/iap-debug(?=\/|$)/, "") || "/";

  // Stage 3: Return the mapped application identity.
  if (req.method === "GET" && url.pathname === "/me") {
    return sendJson(res, 200, {
      message: "Identity mapped successfully",
      authenticated: true,
      authorized: true,
      identity: {
        email: identity.email,
        subject: identity.subject,
      },
      applicationUser: appUser,
    });
  }

  // Stage 4: Check permission for the protected endpoint.
  if (req.method === "GET" && url.pathname === "/users") {
    if (!appUser.permissions.includes("users:read")) {
      return sendJson(res, 403, {
        message: "Missing required permission: users:read",
        authenticated: true,
        authorized: false,
      });
    }

    return sendJson(res, 200, {
      message: "Permission granted",
      authenticated: true,
      authorized: true,
      permission: "users:read",
      users: [
        { id: "demo-admin-1", role: "admin" },
        { id: "demo-viewer-1", role: "viewer" },
      ],
    });
  }

  return sendJson(res, 404, {
    message: "Endpoint not found",
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`IAP identity and authorization diagnostic listening on port ${PORT}`);
});
