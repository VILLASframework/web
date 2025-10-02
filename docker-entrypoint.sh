#!/bin/sh

# Write env.js file on container startup
# -> sets the branding which is declared in Helm values
cat <<EOF > /usr/share/nginx/html/env.js
window._env_ = {
  FRONTEND_BRANDING: "${FRONTEND_BRANDING:-villasweb}"
}
EOF

exec nginx -g "daemon off;"
