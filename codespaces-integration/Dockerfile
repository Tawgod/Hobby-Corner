FROM node:22-bookworm-slim
ARG TUNNEL_VERSION=v0.0.20
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl unzip gh git openssh-client tini \
 && rm -rf /var/lib/apt/lists/*
RUN set -eu; \
    base="https://github.com/openai/tunnel-client/releases/download/${TUNNEL_VERSION}"; \
    file="tunnel-client-runtime-${TUNNEL_VERSION}-linux-amd64.zip"; \
    curl -fL --retry 3 --connect-timeout 15 "$base/SHA256SUMS.txt" -o /tmp/SHA256SUMS.txt; \
    curl -fL --retry 3 --connect-timeout 15 "$base/$file" -o "/tmp/$file"; \
    grep -F "  $file" /tmp/SHA256SUMS.txt > /tmp/tunnel-checksum.txt; \
    test -s /tmp/tunnel-checksum.txt; \
    cd /tmp && sha256sum -c tunnel-checksum.txt; \
    mkdir -p /tmp/tunnel-unpack; \
    unzip -q "/tmp/$file" -d /tmp/tunnel-unpack; \
    found="$(find /tmp/tunnel-unpack -type f -name tunnel-client-runtime | head -n 1)"; \
    test -n "$found"; \
    install -m 0755 "$found" /usr/local/bin/tunnel-client-runtime; \
    rm -rf /tmp/tunnel-unpack "/tmp/$file" /tmp/tunnel-checksum.txt /tmp/SHA256SUMS.txt
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts --no-audit --no-fund
COPY scripts/ ./scripts/
USER node
ENV NODE_ENV=production \
    HC_BRIDGE_ENABLED=false \
    HC_CODESPACE_EXECUTION_ENABLED=false \
    HC_CODESPACE_AUDIT_PATH=/data/audit/codespaces.jsonl \
    MCP_COMMAND="node /app/scripts/mcp-stdio.mjs" \
    LOG_LEVEL=info
ENTRYPOINT ["/usr/bin/tini","--","node","scripts/railway-entrypoint.mjs"]
