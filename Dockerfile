# syntax=docker/dockerfile:1
ARG HUGO_BASE_IMAGE=hugomods/hugo:exts-non-root
FROM ${HUGO_BASE_IMAGE}

# Install Bun for TypeScript compilation
# Download Bun binary for Linux ARM64 (Apple Silicon / M-series Macs)
USER root
RUN wget -qO /tmp/bun.zip https://github.com/oven-sh/bun/releases/latest/download/bun-linux-aarch64.zip && \
    unzip -q /tmp/bun.zip -d /tmp && \
    mv /tmp/bun-linux-aarch64/bun /usr/local/bin/bun && \
    chmod +x /usr/local/bin/bun && \
    rm -rf /tmp/bun.zip /tmp/bun-linux-aarch64

WORKDIR /src
ENV HUGO_CACHEDIR=/tmp/hugo_cache

EXPOSE 1313
