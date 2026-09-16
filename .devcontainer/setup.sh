#!/bin/bash
cd /workspaces/supreme-pancake
if [ ! -f xray ]; then
  curl -L -o xray.zip https://github.com/XTLS/Xray-core/releases/latest/download/Xray-linux-64.zip
  unzip -o xray.zip
  chmod +x xray
fi
cat > config.json << 'CFGEOF'
{
  "log": {"loglevel": "warning"},
  "inbounds": [{
    "port": 8080,
    "protocol": "vless",
    "settings": {
      "clients": [{"id": "b831381d-6324-4d53-ad4f-8cda48b30811"}],
      "decryption": "none"
    },
    "streamSettings": {
      "network": "ws",
      "wsSettings": {"path": "/ws"}
    }
  }],
  "outbounds": [{"protocol": "freedom"}]
}
CFGEOF
pkill xray 2>/dev/null
nohup ./xray run -c config.json > xray.log 2>&1 &
